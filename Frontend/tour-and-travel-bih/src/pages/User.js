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
    setRows((oldRows) => [...oldRows, { id, name: '', surname: '', isNew: true }]);
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
// getUser
  React.useEffect(() => {
    fetch('http://localhost:5278/api/Users/GetUsers') // link za dohvacanje korisnika
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((user) => ({
          id: user.userId,   
          name: user.name,
          surname: user.surname,
          address: user.address,
          dateOfBirth: user.dateOfBirth,
          contact: user.contact,
          email: user.email,
        }));
        setRows(formattedData);
      })
      .catch((error) => console.error('Error fetching user data:', error));
  }, []);

  //brisanje korisnika
  const deleteUser = async (id) => {
    const response = await fetch(`http://localhost:5278/api/Users/DeleteUser/${id}`, {
        method: 'DELETE',
        mode: 'cors'
    });
    if (response.ok) {
        setRows((rows) => rows.filter((row) => row.id !== id));
    } else {
        console.error('Error deleting user:', response.statusText);
    }
};

// edit korisnika
const updateUser = async (updatedRow) => {
  const response = await fetch(`http://localhost:5278/api/Users/UpdateUser/${updatedRow.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedRow),
    mode: 'cors',
  });

  if (!response.ok) {
    console.error('Error updating user:', response.statusText);
  }
  return response.ok;
};

// add user 


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
    if (await updateUser(updatedRow)) {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    }
  };

  //add + edit

  
  const handleDeleteClick = (id) => async () => {
    await deleteUser(id);
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

  // const processRowUpdate = (newRow) => {
  //   const updatedRow = { ...newRow, isNew: false };
  //   setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
  //   return updatedRow;
  // };

  //samo za edit
  const processRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    if (await updateUser(updatedRow)) {
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    }
    return updatedRow;
  };

  // i za add i za edit korisnika
 

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 180, editable: true },
    { field: 'surname', headerName: 'Surname', width: 180, editable: true },
    { field: 'address', headerName: 'Address', width: 180, editable: true },
    { field: 'dateOfBirth', headerName: 'Date of Birth', width: 150, editable: true },
    { field: 'contact', headerName: 'Contact', width: 150, editable: true },
    { field: 'email', headerName: 'Email', width: 200, editable: true },
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
