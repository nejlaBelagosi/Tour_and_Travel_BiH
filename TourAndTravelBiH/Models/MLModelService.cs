using Microsoft.ML;
using Microsoft.ML.Data;
using System;
using System.Data;
using System.IO;
using ExcelDataReader;
using System.Collections.Generic;
using Microsoft.ML.Trainers;
using TourAndTravelBiH.Models;

namespace TourAndTravelBiH.Services
{
    public class MLModelService
    {
        private readonly MLContext _mlContext;
        private readonly string _modelPath;
        private readonly ITransformer _model;
        private readonly DbTourAndTravelBiHContext _db;

        public MLModelService()
        {
            _mlContext = new MLContext();
            _modelPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "model.zip");
        }

        public void TrainAndSaveModel()
        {
            var (trainingDataView, testDataView) = LoadData(_mlContext);
            ITransformer model = BuildAndTrainModel(_mlContext, trainingDataView);
            EvaluateModel(_mlContext, testDataView, model);
            UseModelForSinglePrediction(_mlContext, model);
            SaveModel(_mlContext, trainingDataView.Schema, model);
        }

        private (IDataView training, IDataView test) LoadData(MLContext mlContext)
        {
            string filePath = @"C:\Users\BLGS HP\Documents\GitHub\Tour_and_Travel_BiH\TourAndTravelBiH\Data\rating.xlsx";

            DataTable dataTable = ReadExcelFile(filePath);
            List<PackageRatingData.PackageRating> data = ConvertDataTableToList(dataTable);

            IDataView dataView = mlContext.Data.LoadFromEnumerable(data);

            // Split the data into train and test sets
            var splitData = mlContext.Data.TrainTestSplit(dataView, testFraction: 0.2);
            return (splitData.TrainSet, splitData.TestSet);
        }

        private DataTable ReadExcelFile(string filePath)
        {
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
            using (var stream = File.Open(filePath, FileMode.Open, FileAccess.Read))
            {
                using (var reader = ExcelReaderFactory.CreateReader(stream))
                {
                    var result = reader.AsDataSet(new ExcelDataSetConfiguration()
                    {
                        ConfigureDataTable = (_) => new ExcelDataTableConfiguration() { UseHeaderRow = true }
                    });
                    return result.Tables[0];
                }
            }
        }

        private List<PackageRatingData.PackageRating> ConvertDataTableToList(DataTable dataTable)
        {
            var data = new List<PackageRatingData.PackageRating>();
            
            var referenceDate = new DateTime(1970, 1, 1); // Unix epoch as reference date
            foreach (DataRow row in dataTable.Rows)
            {
                data.Add(new PackageRatingData.PackageRating
                {
                    userId = Convert.ToSingle(row["userId"]),
                    packageId = Convert.ToSingle(row["packageId"]),
                    Rating = Convert.ToSingle(row["rating"]),
                    timestamp = (float)(Convert.ToDateTime(row["DateOfReservation"]) - referenceDate).TotalDays
                });
            }

            return data;
        }

        private ITransformer BuildAndTrainModel(MLContext mlContext, IDataView trainingDataView)
        {
            // Map userId and packageId to key columns
            var estimator = mlContext.Transforms.Conversion.MapValueToKey(outputColumnName: "userIdEncoded", inputColumnName: nameof(PackageRatingData.PackageRating.userId))
                .Append(mlContext.Transforms.Conversion.MapValueToKey(outputColumnName: "packageIdEncoded", inputColumnName: nameof(PackageRatingData.PackageRating.packageId)))
                // Transform the key columns to numeric columns
                .Append(mlContext.Transforms.Conversion.MapKeyToValue("userIdNumeric", "userIdEncoded"))
                .Append(mlContext.Transforms.Conversion.MapKeyToValue("packageIdNumeric", "packageIdEncoded"))
                // Concatenate the numeric columns with other features
                .Append(mlContext.Transforms.Concatenate("Features", "userIdNumeric", "packageIdNumeric", nameof(PackageRatingData.PackageRating.timestamp)));
            var options = new MatrixFactorizationTrainer.Options
            {
                MatrixColumnIndexColumnName = "userIdEncoded",
                MatrixRowIndexColumnName = "packageIdEncoded",
                LabelColumnName = nameof(PackageRatingData.PackageRating.Rating),
                NumberOfIterations = 20,
                ApproximationRank = 100
            };

            var trainerEstimator = estimator.Append(mlContext.Recommendation().Trainers.MatrixFactorization(options));

            Console.WriteLine("=============== Training the model ===============");
            ITransformer model = trainerEstimator.Fit(trainingDataView);

            return model;
        }

        private void EvaluateModel(MLContext mlContext, IDataView testDataView, ITransformer model)
        {
            Console.WriteLine("=============== Evaluating the model ===============");
            var prediction = model.Transform(testDataView);
            var metrics = mlContext.Regression.Evaluate(prediction, labelColumnName: nameof(PackageRatingData.PackageRating.Rating), scoreColumnName: "Score");

            Console.WriteLine("Root Mean Squared Error : " + metrics.RootMeanSquaredError.ToString());
            Console.WriteLine("RSquared: " + metrics.RSquared.ToString());
        }

        private void UseModelForSinglePrediction(MLContext mlContext, ITransformer model)
        {
            Console.WriteLine("=============== Making a prediction ===============");
            var predictionEngine = mlContext.Model.CreatePredictionEngine<PackageRatingData.PackageRating, PackageRatingData.PackageRatingPrediction>(model);

            var testInput = new PackageRatingData.PackageRating { userId = 32, packageId = 10};

            var packageRatingPrediction = predictionEngine.Predict(testInput);
            if (Math.Round(packageRatingPrediction.Score, 1) > 3.5)
            {
                Console.WriteLine("Package " + testInput.packageId + " is recommended for user " + testInput.userId);
            }
            else
            {
                Console.WriteLine("Package " + testInput.packageId + " is not recommended for user " + testInput.userId);
            }
        }

        private void SaveModel(MLContext mlContext, DataViewSchema trainingDataViewSchema, ITransformer model)
        {
            var modelPath = Path.Combine(Environment.CurrentDirectory, "Data", "PackageRecommenderModel.zip");

            Console.WriteLine("=============== Saving the model to a file ===============");
            mlContext.Model.Save(model, trainingDataViewSchema, modelPath);
        }
        private void AnalyzeScoreDistribution()
        {
            var predictionEngine = _mlContext.Model.CreatePredictionEngine<PackageRatingData.PackageRating, PackageRatingData.PackageRatingPrediction>(_model);

            var recommendations = new List<PackageRatingData.PackageRatingPrediction>();
            var packageIds = _db.TourPackages.Select(p => p.PackageId).ToList();
            var userIds = _db.Users.Select(u => u.UserId).ToList();

            foreach (var userId in userIds)
            {
                foreach (var packageId in packageIds)
                {
                    var testInput = new PackageRatingData.PackageRating { userId = userId, packageId = packageId };
                    var prediction = predictionEngine.Predict(testInput);
                    prediction.packageId = packageId; // Ensure the package ID is included in the response
                    recommendations.Add(prediction);
                }
            }

            var scores = recommendations.Select(r => r.Score).ToList();
            var mean = scores.Average();
            var stdDev = Math.Sqrt(scores.Average(v => Math.Pow(v - mean, 2)));

            Console.WriteLine($"Mean Score: {mean}");
            Console.WriteLine($"Standard Deviation: {stdDev}");
        }

    }

}
