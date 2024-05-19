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
    setRows((oldRows) => [...oldRows, { id, destinationId: '', packageAvailability: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [destinations, setDestinations] = React.useState([]);

  React.useEffect(() => {
    fetch('http://localhost:5278/api/Destination/GetDestination')
      .then((response) => response.json())
      .then((data) => {
        setDestinations(data);
      })
      .catch((error) => console.error('Error fetching destination data:', error));
  }, []);

  // React.useEffect(() => {
  //   fetch('http://localhost:5278/api/TourPackage/GetPackage') // link za dohvacanje paketa
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const formattedData = data.map((tourPackage) => ({
  //         id: tourPackage.packageId, 
  //         availability: tourPackage.packageAvailability ? 'Dostupna' : 'Nije dostupna',
  //         startDate: tourPackage.startDate,
  //         endDate: tourPackage.endDate,
  //         accomodation: tourPackage.accomodation,
  //         packageDescription: tourPackage.packageDescription,
  //         price: tourPackage.price,
  //         destinationName: destinations.find(dest => dest.destinationId === tourPackage.destinationId)?.destinationName || tourPackage.destinationId,
  //       }));
  //       setRows(formattedData);
  //     })
  //     .catch((error) => console.error('Error fetching package data:', error));
  // }, [destinations]);
  React.useEffect(() => {
    const token = localStorage.getItem('authToken'); // Pretpostavljamo da je token pohranjen u localStorage
    fetch('http://localhost:5278/api/TourPackage/GetPackage', { // link za dohvacanje paketa
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((tourPackage) => ({
          id: tourPackage.packageId, 
          availability: tourPackage.packageAvailability ? 'Dostupna' : 'Nije dostupna',
          startDate: tourPackage.startDate,
          endDate: tourPackage.endDate,
          accomodation: tourPackage.accomodation,
          packageDescription: tourPackage.packageDescription,
          price: tourPackage.price,
          destinationName: destinations.find(dest => dest.destinationId === tourPackage.destinationId)?.destinationName || tourPackage.destinationId,
        }));
        setRows(formattedData);
      })
      .catch((error) => console.error('Error fetching package data:', error));
  }, [destinations]);

  const deletePackage = async (id) => {
    const response = await fetch(`http://localhost:5278/api/TourPackage/DeletePackage/${id}`, {
      method: 'DELETE',
      mode: 'cors'
    });
    if (response.ok) {
      setRows((rows) => rows.filter((row) => row.id !== id));
    } else {
      console.error('Error deleting package:', response.statusText);
    }
  };

  const updatePackage = async (updatedRow) => {
    const response = await fetch(`http://localhost:5278/api/TourPackage/UpdatePackage/${updatedRow.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...updatedRow,
        packageAvailability: updatedRow.availability === 'Dostupna' ? 1 : 0,
        destinationId: destinations.find(dest => dest.destinationName === updatedRow.destinationName)?.destinationId,
      }),
      mode: 'cors',
    });

    if (!response.ok) {
      console.error('Error updating package:', response.statusText);
    }
    return response.ok;
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => async () => {
    const updatedRow = rows.find((row) => row.id === id);
    if (await updatePackage(updatedRow)) {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    }
  };

  const handleDeleteClick = (id) => async () => {
    await deletePackage(id);
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
    if (await updatePackage(updatedRow)) {
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    }
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: 'availability', headerName: 'Availability', width: 180, editable: true },
    { field: 'startDate', headerName: 'Start date', width: 180, editable: true },
    { field: 'endDate', headerName: 'End date', width: 180, editable: true },
    { field: 'accomodation', headerName: 'Accomodation', width: 150, editable: true },
    { field: 'packageDescription', headerName: 'Description', width: 150, editable: true },
    { field: 'price', headerName: 'Price', width: 200, editable: true },
    { field: 'destinationName', headerName: 'Destination', width: 200, editable: true },
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
      />
    </Box>
  );
}
