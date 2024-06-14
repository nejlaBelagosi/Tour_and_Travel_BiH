using Microsoft.EntityFrameworkCore;
using TourAndTravelBiH.Helper;
using TourAndTravelBiH.Models;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
    options.SerializerSettings.Formatting = Newtonsoft.Json.Formatting.Indented;
    options.SerializerSettings.DateFormatString = "MM-dd-yyyy";
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpContextAccessor(); //dodatnog zbog autorizacije
builder.Services.AddTransient<MyAuthService>(); //dodatnog zbog autorizacije
builder.Services.AddSwaggerGen(x => x.OperationFilter<AutorizacijaSwaggerHeader>()); //dodatnog zbog autorizacije



builder.Services.AddDbContext<DbTourAndTravelBiHContext>(
    options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

}
app.UseCors(options =>
{
    options.AllowAnyHeader();
    options.AllowAnyMethod();
    options.AllowAnyOrigin();
});
app.UseAuthorization();

app.MapControllers();

app.Run();
