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
    setRows((oldRows) => [...oldRows, { id, location: '', name: '',image: '', details: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'location' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add Destination
      </Button>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});

  // Dohvati destinacije
  React.useEffect(() => {
    fetch('http://localhost:5278/api/Destination/GetDestination') // link za dohvacanje destinacija
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((destination) => ({
          id: destination.destinationId,
          location: destination.destinationLocation,
          name: destination.destinationName,
          image: destination.destinationImage,
          details: destination.destinationDetails,
        }));
        setRows(formattedData);
      })
      .catch((error) => console.error('Error fetching destination data:', error));
  }, []);

  // Brisanje destinacije
  const deleteDestination = async (id) => {
    const response = await fetch(`http://localhost:5278/api/Destination/DeleteDestination/${id}`, {
      method: 'DELETE',
      mode: 'cors',
    });
    if (response.ok) {
      setRows((rows) => rows.filter((row) => row.id !== id));
    } else {
      console.error('Error deleting destination:', response.statusText);
    }
  };

  // Uređivanje destinacije
  const updateDestination = async (updatedRow) => {
    const response = await fetch(`http://localhost:5278/api/Destination/UpdateDestination/${updatedRow.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedRow),
      mode: 'cors',
    });
  
    if (!response.ok) {
      console.error('Error updating destination:', response.statusText);
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
    if (await updateDestination(updatedRow)) {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    }
  };

  const handleDeleteClick = (id) => async () => {
    await deleteDestination(id);
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

  // const processRowUpdate = async (newRow) => {
  //   const updatedRow = { ...newRow, isNew: false };
  //   if (await updateDestination(updatedRow)) {
  //     setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
  //   }
  //   return updatedRow;
  // };
  const processRowUpdate = async (newRow) => {
    console.log('Processing row update:', newRow); // Log za praćenje podataka koji se obrađuju
    const updatedRow = { ...newRow, isNew: false};
    const success = await updateDestination(updatedRow);
    if (success) {
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      console.log('Row updated successfully:', updatedRow); // Log za praćenje uspešnog ažuriranja stanja
    } else {
      console.error('Failed to update row:', updatedRow); // Log za praćenje neuspešnog ažuriranja stanja
    }
    return updatedRow;
  };
  

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: 'location', headerName: 'Location', width: 180, editable: true },
    { field: 'name', headerName: 'Name', width: 180, editable: true },
    { field: 'image', headerName: 'Image', width: 200, editable: true },
    { field: 'details', headerName: 'Details', width: 200, editable: true },
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
