import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

function EditToolbar(props) {
  const { setRows, setRowModesModel, searchTerm, setSearchTerm, handleSearch } =
    props;

  const handleClick = () => {
    const id = Math.random().toString(36).substring(2, 9); // Generate random ID
    const today = new Date().toISOString().split("T")[0]; // Current date in 'YYYY-MM-DD' format
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        dateOfReservation: today,
        totalTravelers: 1,
        name: "",
        reservationStatus: "Pending",
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "destinationName" },
    }));
  };

  return (
    <GridToolbarContainer>
      <h1 style={{ marginLeft: "20px" }}>Reservations</h1>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            backgroundColor: "#1A4D2E",
            "&:hover": {
              backgroundColor: "#E8DFCA",
              color: "#4F6F52",
            },
          }}
        >
          Search
        </Button>
      </Box>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [searchTerm, setSearchTerm] = React.useState("");

  const checkReservationStatus = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    return end < today ? "Zavrseno" : "Pending";
  };

  const updateReservationStatus = async (reservations) => {
    const token = localStorage.getItem("TokenValue");
    const updatedReservations = reservations.map((reservation) => {
      const status = checkReservationStatus(reservation.endDate);
      if (status !== reservation.reservationStatus) {
        return { ...reservation, reservationStatus: status };
      }
      return reservation;
    });

    for (const reservation of updatedReservations) {
      if (reservation.reservationStatus !== "Pending") {
        await fetch(
          `http://localhost:5278/api/Reservation/UpdateReservation/${reservation.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(reservation),
            mode: "cors",
          }
        );
      }
    }
    setRows(updatedReservations);
  };

  // Fetch Reservations
  React.useEffect(() => {
    fetch("http://localhost:5278/api/Reservation/GetReservation")
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((reservation) => ({
          id: reservation.reservationId,
          destinationName: reservation.destinationName,
          totalTravelers: reservation.totalTravelers,
          dateOfReservation: reservation.dateOfReservation,
          endDate: reservation.endDate,
          totalPrice: reservation.totalPrice,
          userName: reservation.username,
          packageDescription: reservation.packageDescription,
          reservationStatus: checkReservationStatus(reservation.endDate),
        }));
        updateReservationStatus(formattedData);
      })
      .catch((error) =>
        console.error("Error fetching reservation data:", error)
      );
  }, []);

  const fetchData = async (term) => {
    try {
      const response = await fetch(
        `http://localhost:5278/api/Reservation/SearchReservations/Search?searchTerm=${term}`
      );
      const data = await response.json();
      const formattedData = data.map((reservation) => ({
        id: reservation.reservationId,
        destinationName: reservation.destinationName,
        totalTravelers: reservation.totalTravelers,
        dateOfReservation: reservation.dateOfReservation,
        endDate: reservation.endDate,
        totalPrice: reservation.totalPrice,
        userName: reservation.username,
        packageDescription: reservation.packageDescription,
        reservationStatus: checkReservationStatus(reservation.endDate),
      }));
      updateReservationStatus(formattedData);
    } catch (error) {
      console.error("Error fetching reservation data:", error);
    }
  };

  React.useEffect(() => {
    fetchData("");
  }, []);

  const handleSearch = () => {
    fetchData(searchTerm);
  };

  // Delete Reservation
  const deleteReservation = async (id) => {
    const response = await fetch(
      `http://localhost:5278/api/Reservation/DeleteReservation/${id}`,
      {
        method: "DELETE",
        mode: "cors",
      }
    );
    if (response.ok) {
      setRows((rows) => rows.filter((row) => row.id !== id));
    } else {
      console.error("Error deleting reservation:", response.statusText);
    }
  };

  // Update Reservation
  const updateReservation = async (updatedRow) => {
    const response = await fetch(
      `http://localhost:5278/api/Reservation/UpdateReservation/${updatedRow.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRow),
        mode: "cors",
      }
    );

    if (!response.ok) {
      console.error("Error updating reservation:", response.statusText);
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

  // Save Edit
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
    newRow.reservationStatus = checkReservationStatus(newRow.endDate); // Update status based on endDate
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
    {
      field: "destinationName",
      headerName: "Destination name",
      width: 180,
      editable: true,
    },
    {
      field: "totalTravelers",
      headerName: "Total Travelers",
      width: 180,
      editable: true,
    },
    {
      field: "dateOfReservation",
      headerName: "Date of Reservation",
      width: 180,
      editable: true,
    },
    { field: "endDate", headerName: "End Date", width: 180, editable: true }, // Add endDate column
    {
      field: "totalPrice",
      headerName: "Total Price",
      width: 200,
      editable: true,
    },
    {
      field: "userName",
      headerName: "Name and surname",
      width: 200,
      editable: true,
    },
    {
      field: "packageDescription",
      headerName: "Package description",
      width: 200,
      editable: true,
    },
    {
      field: "reservationStatus",
      headerName: "Status",
      width: 200,
      editable: true,
    },
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
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
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
          toolbar: {
            setRows,
            setRowModesModel,
            searchTerm,
            setSearchTerm,
            handleSearch,
          },
        }}
        sx={{
          marginLeft: "20px",
          marginRight: "20px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      />
    </Box>
  );
}
