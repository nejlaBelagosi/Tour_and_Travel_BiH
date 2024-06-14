import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = Math.random().toString(36).substring(2, 9); // Generiše nasumičan ID
    setRows((oldRows) => [...oldRows, { id, totalTravelers, name: '', reservationStatus: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'location' },
    }));
  };

  return (
    <GridToolbarContainer>
      <h1 style={{ marginLeft:'20px'
      }}>Reservations</h1>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});

  // Dohvati REZERVACIJU
  React.useEffect(() => {
    fetch('http://localhost:5278/api/Reservation/GetReservation') // link za dohvacanje destinacija
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((reservation) => ({
          id: reservation.reservationId,
          destinationName: reservation.destinationName,
          totalTravelers: reservation.totalTravelers,
          dateOfReservation: reservation.dateOfReservation,
          totalPrice: reservation.totalPrice,
          userName: reservation.username, // Use 'username' property instead of 'userId'
          packageDescription: reservation.packageDescription,
          reservationStatus: reservation.reservationStatus
        }));
        setRows(formattedData);
      })
      .catch((error) => console.error('Error fetching destination data:', error));
  }, []);
  

  // Brisanje destinacije
  const deleteReservation = async (id) => {
    const response = await fetch(`http://localhost:5278/api/Reservation/DeleteReservation/${id}`, {
      method: 'DELETE',
      mode: 'cors',
    });
    if (response.ok) {
      setRows((rows) => rows.filter((row) => row.id !== id));
    } else {
      console.error('Error deleting reservation:', response.statusText);
    }
  };

  // Uređivanje destinacije
  const updateReservation= async (updatedRow) => {
    const response = await fetch(`http://localhost:5278/api/Reservation/UpdateReservation/${updatedRow.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedRow),
      mode: 'cors',
    });
  
    if (!response.ok) {
      console.error('Error updating reservation:', response.statusText);
    }
    return response.ok;
  };

  // ------------------------------- Handle ------------------------------

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  // samo za edit
  const handleSaveClick = (id) => async () => {
    const updatedRow = rows.find((row) => row.id === id);
    if (await updateReservation(updatedRow)) {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    }
  };

  const handleDeleteClick = (id) => async () => {
    await deleteReservation(id);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    if (await updateReservation(updatedRow)) {
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    }
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: 'destinationName', headerName: ' Destination name', width: 180, editable: true },
    { field: 'totalTravelers', headerName: ' Total Travelers', width: 180, editable: true },
    { field: 'dateOfReservation', headerName: 'Date', width: 180, editable: true },
    { field: 'totalPrice', headerName: 'Total Price', width: 200, editable: true },
    { field: 'userName', headerName: 'Name and surname', width: 200, editable: true }, // Change field to 'userName'
    { field: 'packageDescription', headerName: 'Package description', width: 200, editable: true },
    { field: 'reservationStatus', headerName: 'Status', width: 200, editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: 'primary.main' }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
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
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        sx={{marginLeft:'20px', marginRight:'20px', marginTop:'20px', marginBottom:'20px'}}
      />
    </Box>
  );
}
