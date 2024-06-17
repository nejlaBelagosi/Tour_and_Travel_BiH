import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { FormControl, InputLabel, IconButton } from "@mui/material";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";

function EditToolbar(props) {
  const { handleOpenDialog } = props;
  return (
    <GridToolbarContainer>
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpenDialog}
      >
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function TourPackages() {
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [destinations, setDestinations] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [newPackage, setNewPackage] = React.useState({
    availability: "",
    dates: [{ startDate: "", endDate: "", dateId: null }],
    accomodation: "",
    packageDescription: "",
    price: "",
    destinationName: "",
  });

  const fetchData = React.useCallback(() => {
    const token = localStorage.getItem("TokenValue");
    fetch("http://localhost:5278/api/TourPackage/GetPackage", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((tourPackage) => ({
          id: tourPackage.packageId,
          availability: tourPackage.packageAvailability
            ? "Dostupna"
            : "Nije dostupna",
          startDate: tourPackage.dates[0]?.startDate || "",
          endDate: tourPackage.dates[0]?.endDate || "",
          dates: tourPackage.dates,
          accomodation: tourPackage.accomodation,
          packageDescription: tourPackage.packageDescription,
          price: tourPackage.price,
          destinationName: tourPackage.destinationName,
        }));
        setRows(formattedData);
      })
      .catch((error) => console.error("Error fetching package data:", error));
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  React.useEffect(() => {
    fetch("http://localhost:5278/api/Destination/GetDestination")
      .then((response) => response.json())
      .then((data) => setDestinations(data))
      .catch((error) =>
        console.error("Error fetching destination data:", error)
      );
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewPackage({
      availability: "",
      dates: [{ startDate: "", endDate: "", dateId: null }],
      accomodation: "",
      packageDescription: "",
      price: "",
      destinationName: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewPackage({ ...newPackage, [name]: value });
  };

  const handleDateChange = (index, event) => {
    const { name, value } = event.target;
    const dates = [...newPackage.dates];
    dates[index][name] = value;
    setNewPackage({ ...newPackage, dates });
  };

  const handleAddDate = () => {
    setNewPackage({
      ...newPackage,
      dates: [
        ...newPackage.dates,
        { startDate: "", endDate: "", dateId: null },
      ],
    });
  };

  const handleRemoveDate = (index) => {
    const dates = [...newPackage.dates];
    dates.splice(index, 1);
    setNewPackage({ ...newPackage, dates });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("TokenValue");
    try {
      const response = await fetch(
        "http://localhost:5278/api/TourPackage/PostPackage",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            packageAvailability: newPackage.availability === "Dostupna" ? 1 : 0,
            accomodation: newPackage.accomodation,
            packageDescription: newPackage.packageDescription,
            price: newPackage.price,
            destinationId: destinations.find(
              (dest) => dest.destinationName === newPackage.destinationName
            )?.destinationId,
            dates: newPackage.dates,
          }),
          mode: "cors",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add package");
      }

      await response.json();
      fetchData();
      handleClose();
    } catch (error) {
      console.error("Error posting package:", error.message);
    }
  };

  const deletePackage = async (id) => {
    const response = await fetch(
      `http://localhost:5278/api/TourPackage/DeletePackage/${id}`,
      {
        method: "DELETE",
        mode: "cors",
      }
    );
    if (response.ok) {
      fetchData();
    } else {
      console.error("Error deleting package:", response.statusText);
    }
  };

  const updatePackage = async (updatedRow) => {
    const token = localStorage.getItem("TokenValue");
    const response = await fetch(
      `http://localhost:5278/api/TourPackage/UpdatePackage/${updatedRow.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          packageAvailability: updatedRow.availability === "Dostupna" ? 1 : 0,
          accomodation: updatedRow.accomodation,
          packageDescription: updatedRow.packageDescription,
          price: updatedRow.price,
          destinationId: destinations.find(
            (dest) => dest.destinationName === updatedRow.destinationName
          )?.destinationId,
          dates: updatedRow.dates,
        }),
        mode: "cors",
      }
    );

    if (!response.ok) {
      console.error("Error updating package:", response.statusText);
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
      fetchData();
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
    {
      field: "destinationName",
      headerName: "Destination",
      width: 200,
      editable: true,
    },
    {
      field: "availability",
      headerName: "Availability",
      width: 180,
      editable: true,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      width: 150,
      editable: true,
      renderCell: (params) => (
        <FormControl fullWidth>
          {/* <InputLabel>Start Date</InputLabel> */}
          <Select
            value={params.row.startDate}
            onChange={(e) => {
              const updatedRow = { ...params.row, startDate: e.target.value };
              processRowUpdate(updatedRow);
            }}
          >
            {params.row.dates.map((date) => (
              <MenuItem key={date.dateId} value={date.startDate}>
                {date.startDate}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: "endDate",
      headerName: "End Date",
      width: 150,
      editable: true,
      renderCell: (params) => (
        <FormControl fullWidth>
          {/* <InputLabel>End Date</InputLabel> */}
          <Select
            value={params.row.endDate}
            onChange={(e) => {
              const updatedRow = { ...params.row, endDate: e.target.value };
              processRowUpdate(updatedRow);
            }}
          >
            {params.row.dates.map((date) => (
              <MenuItem key={date.dateId} value={date.endDate}>
                {date.endDate}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: "accomodation",
      headerName: "Accomodation",
      width: 150,
      editable: true,
    },
    {
      field: "packageDescription",
      headerName: "Description",
      width: 150,
      editable: true,
    },
    { field: "price", headerName: "Price", width: 200, editable: true },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: "primary.main" }}
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
        width: "100%",
        "& .actions": { color: "text.secondary" },
        "& .textPrimary": { color: "text.primary" },
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
        slots={{ toolbar: EditToolbar }}
        slotProps={{ toolbar: { handleOpenDialog: handleClickOpen } }}
        sx={{
          marginLeft: "20px",
          marginRight: "20px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Package</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the form below to add a new package.
          </DialogContentText>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              name="availability"
              label="Availability"
              type="text"
              fullWidth
              value={newPackage.availability}
              onChange={handleChange}
            />
            {newPackage.dates.map((date, index) => (
              <React.Fragment key={index}>
                <TextField
                  margin="dense"
                  name="startDate"
                  label="Start Date"
                  type="date"
                  fullWidth
                  value={date.startDate}
                  onChange={(e) => handleDateChange(index, e)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  margin="dense"
                  name="endDate"
                  label="End Date"
                  type="date"
                  fullWidth
                  value={date.endDate}
                  onChange={(e) => handleDateChange(index, e)}
                  InputLabelProps={{ shrink: true }}
                />
                <IconButton
                  aria-label="remove date"
                  onClick={() => handleRemoveDate(index)}
                >
                  <CancelIcon />
                </IconButton>
              </React.Fragment>
            ))}
            <Button onClick={handleAddDate} startIcon={<AddIcon />}>
              Add another date
            </Button>
            <TextField
              margin="dense"
              name="accomodation"
              label="Accomodation"
              type="text"
              fullWidth
              value={newPackage.accomodation}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="packageDescription"
              label="Package Description"
              type="text"
              fullWidth
              value={newPackage.packageDescription}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="price"
              label="Price"
              type="number"
              fullWidth
              value={newPackage.price}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Destination Name</InputLabel>
              <Select
                margin="dense"
                name="destinationName"
                label="Destination Name"
                fullWidth
                value={newPackage.destinationName}
                onChange={handleChange}
              >
                {destinations.map((destination) => (
                  <MenuItem
                    key={destination.destinationId}
                    value={destination.destinationName}
                  >
                    {destination.destinationName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit">Submit</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
