import * as React from 'react';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  GridRowModes,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';

export default function Reviews() {
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});

  React.useEffect(() => {
    fetch('http://localhost:5278/api/Review/GetReview') // link za dohvacanje recenzija
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((review) => ({
          id: review.reviewId,
          name: review.user.split(' ')[0],
          surname: review.user.split(' ')[1],
          postDate: review.postDate,
          rating: review.rating,
          reviewComment: review.reviewComment,
          destinationName: review.destinationName
        }));
        setRows(formattedData);
      })
      .catch((error) => console.error('Error fetching review data:', error));
  }, []);

  // brisanje recenzija
  const deleteReview = async (id) => {
    try {
      const response = await fetch(`http://localhost:5278/api/Review/DeleteReview/${id}`, {
        method: 'DELETE',
        mode: 'cors'
      });
      if (response.ok) {
        setRows((rows) => rows.filter((row) => row.id !== id));
      } else {
        console.error('Error deleting review:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleDeleteClick = (id) => async () => {
    await deleteReview(id);
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 180, editable: false },
    { field: 'surname', headerName: 'Surname', width: 180, editable: false },
    { field: 'destinationName', headerName: 'Destination Name', width: 200, editable: false },
    { field: 'reviewComment', headerName: 'Review', width: 180, editable: false },
    { field: 'postDate', headerName: 'Post Date', width: 150, editable: false },
    { field: 'rating', headerName: 'Rating', width: 150, editable: false },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDeleteClick(id)}
          color="inherit"
        />
      ],
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={(newRowModesModel) => setRowModesModel(newRowModesModel)}
        onRowEditStop={(params, event) => {
          if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
          }
        }}
        processRowUpdate={(newRow) => newRow}
        slots={{
          toolbar: () => (
            <GridToolbarContainer>
              <h1 style={{ marginLeft: '20px' }}>Reviews</h1>
            </GridToolbarContainer>
          ),
        }}
        sx={{ marginLeft: '20px', marginRight: '20px', marginTop: '20px', marginBottom: '20px' }}
      />
    </Box>
  );
}
