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
    setRows((oldRows) => [...oldRows, { id, location: '', name: '', details: '', image: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add destination
      </Button>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});

// get #########################################################################################################
  React.useEffect(() => {
    fetch('http://localhost:5278/api/Destination/GetDestination') 
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((destination) => ({
          id: destination.destinationId,
          name: destination.destinationName,
          location: destination.destinationLocation,
          details: destination.destinationDetails,
          image: destination.destinationImage,
        }));
        setRows(formattedData);
      })
      .catch((error) => console.error('Error fetching destination data:', error));
  }, []);

// ########################################################################################################
// Postavljanje nove destinacije = > NE RADI
const postDestination = async (newRow) => {
  try {
    const response = await fetch('http://localhost:5278/api/Destination/PostDestination', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        destinationName: newRow.name,
        destinationLocation: newRow.location,
        destinationDetails: newRow.details,
        destinationImage: newRow.image,
      }),
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error('Failed to add destination');
    }

    const responseData = await response.json();

    // Update the frontend with the newly created record
    setRows((prevRows) => [...prevRows, { ...newRow, id: responseData.id, isNew: false }]);
    return true;
  } catch (error) {
    console.error('Error posting destination:', error.message);
    return false;
  }
};
// ####################################################################################################################
  // Azuriranje destinacije
  const updateDestination = async (updatedRow) => {
    const response = await fetch(`http://localhost:5278/api/Destination/UpdateDestination/${updatedRow.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        destinationName: updatedRow.name,
        destinationLocation: updatedRow.location,
        destinationDetails: updatedRow.details,
        destinationImage: updatedRow.image,
      }),
      mode: 'cors',
    });

    if (!response.ok) {
      console.error('Error updating destination:', response.statusText);
    }
    return response.ok;
  };

// delete #####################################################################################################
const deleteDestination = async (id) => {
  const response = await fetch(`http://localhost:5278/api/Destination/DeleteDestination/${id}`, {
      method: 'DELETE',
      mode: 'cors'
  });
  if (response.ok) {
      setRows((rows) => rows.filter((row) => row.id !== id));
  } else {
      console.error('Error deleting destination:', response.statusText);
  }
};
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

// ####################################################################################################################

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => async () => {
    const editedRow = rows.find((row) => row.id === id);
    const isNew = editedRow.isNew;

    let success;
    if (isNew) {
      success = await postDestination(editedRow);
    } else {
      success = await updateDestination(editedRow);
    }

    if (success) {
      setRows((rows) =>
        rows.map((row) => (row.id === id ? { ...row, isNew: false } : row))
      );
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

  const processRowUpdate = async (newRow) => {
    const isNew = newRow.isNew;
    let updatedRow = { ...newRow, isNew: false };

    if (isNew) {
      if (await postDestination(updatedRow)) {
        setRows((rows) => rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      }
    } else {
      if (await updateDestination(updatedRow)) {
        setRows((rows) => rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      }
    }
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 180, editable: true },
    { field: 'location', headerName: 'Location', width: 180, editable: true },
    { field: 'details', headerName: 'Details', width: 180, editable: true },
    { field: 'image', headerName: 'Image', width: 150, editable: true },
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