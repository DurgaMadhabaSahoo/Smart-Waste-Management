import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import GetAppIcon from "@mui/icons-material/GetApp"; 
import { jsPDF } from "jspdf"; 
import "jspdf-autotable"; 
import { API_URL } from "../../../config/config";
import { useSelector } from "react-redux";
import UpdateCollection from "./UpdateCollection";

const StyledCard = styled(Card)(({ theme, status }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  backgroundColor:
    status === "Approved"
      ? "#28a745"
      : status === "Rejected"
      ? "#e64545"
      : "#8a8686",
  color: "#ffffff",
  marginBottom: "1rem",
  borderRadius: "10px",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: theme.shadows[6],
  },
}));

const SpecialCollectionHistory = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [editCollection, setEditCollection] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  const fetchCollections = async () => {
    try {
      const res = await axios.get(`${API_URL}/specialCollection/get`);
      setCollections(res.data.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch collections.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleStatusChange = (event, newStatus) => {
    if (newStatus !== null) {
      setFilterStatus(newStatus);
    }
  };

  const filteredCollections = collections.filter((collection) => {
    return (
      filterStatus === "all" ||
      (filterStatus === "Approved" && collection.wasteStatus === "Approved") ||
      (filterStatus === "Rejected" && collection.wasteStatus === "Rejected")
    );
  });

  const handleEditClick = (collection) => {
    setEditCollection(collection);
    setDialogOpen(true);
  };

  const handleCloseEdit = () => {
    setEditCollection(null);
    setDialogOpen(false);
    fetchCollections();
  };

  const handleDeleteClick = (collection) => {
    setCollectionToDelete(collection);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCollectionToDelete(null);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${API_URL}/specialCollection/delete/${collectionToDelete._id}`
      );
      setCollections(
        collections.filter((c) => c._id !== collectionToDelete._id)
      );
      handleCloseDeleteDialog();
    } catch (error) {
      setError("Failed to delete the collection.");
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();

    
    doc.setFontSize(20);
    doc.text("Special Collection Report", 14, 22);

    
    const columns = [
      { title: "Waste Type", dataKey: "wasteType" },
      { title: "Pick Up Date", dataKey: "chooseDate" },
      { title: "Status", dataKey: "wasteStatus" },
      { title: "Payment", dataKey: "payment" },
      { title: "Address", dataKey: "address" },
      { title: "Created At", dataKey: "createdAt" },
    ];

    
    const rows = filteredCollections.map((collection) => ({
      wasteType: collection.wasteType,
      chooseDate: new Date(collection.chooseDate).toLocaleDateString(),
      wasteStatus: collection.wasteStatus,
      payment: collection.payment ? `Rs ${collection.payment}` : "Not Paid",
      address: collection.user.address,
      createdAt: new Date(collection.createdAt).toLocaleDateString(),
    }));

   
    doc.autoTable({
      head: [columns.map((column) => column.title)], 
      body: rows.map((row) => columns.map((column) => row[column.dataKey])),
      startY: 30, 
      theme: "grid",
    });

    
    doc.save("special_collection_report.pdf");
  };

  return (
    <Box>
      <Container
        maxWidth="md"
        sx={{ marginTop: { xs: "2rem", md: "4rem" }, marginBottom: "2rem" }}
      >
        
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <ToggleButtonGroup
            value={filterStatus}
            exclusive
            onChange={handleStatusChange}
            aria-label="status filter"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <ToggleButton value="all">
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                All
              </Typography>
            </ToggleButton>
            <ToggleButton value="Approved">
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Approved
              </Typography>
            </ToggleButton>
            <ToggleButton value="Rejected">
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Rejected
              </Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<GetAppIcon />} 
            onClick={generateReport} 
          >
            Generate Report
          </Button>
        </Box>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={2}>
            {filteredCollections.map((collection) => (
              <Grid item xs={12} sm={6} key={collection._id}>
                <StyledCard status={collection.wasteStatus}>
                  <CardContent>
                    <Grid container spacing={0.5}>
                      <Grid
                        item
                        xs={4}
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          component="img"
                          src={collection.wasteImage}
                          alt="Waste"
                          sx={{
                            width: "100%",
                            maxWidth: "100px",
                            borderRadius: "9px",
                          }}
                        />
                      </Grid>

                      <Grid item xs={8}>
                        <Box sx={{ textAlign: "start", position: "relative" }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: { xs: "0.8rem", md: "0.9rem" },
                              position: "absolute",
                              top: "8px",
                              right: "8px",
                              zIndex: 1,
                              background: "rgba(0,0,0,0.5)",
                              padding: "2px 4px",
                              borderRadius: "4px",
                            }}
                          >
                            {new Date(
                              collection.createdAt
                            ).toLocaleDateString()}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: "bold",
                              fontSize: { xs: "20px", md: "22px" },
                            }}
                          >
                            {collection.wasteType}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: { xs: "15px", md: "16px" },
                              marginTop: "2px",
                            }}
                          >
                            Pick Up:{" "}
                            {new Date(
                              collection.chooseDate
                            ).toLocaleDateString()}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: { xs: "15px", md: "16px" },
                              marginTop: "2px",
                            }}
                          >
                            {<LocationOnIcon sx={{ fontSize: "18px" }} />}
                            {collection.user.address}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: { xs: "15px", md: "16px" },
                              marginTop: "2px",
                            }}
                          >
                            Status: {collection.wasteStatus}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: { xs: "15px", md: "16px" },
                              marginTop: "2px",
                            }}
                          >
                            Payment:{" "}
                            {collection.payment
                              ? `Rs ${collection.payment}`
                              : "Not Paid"}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "flex-end",
                          marginTop: "-10px",
                        }}
                      >
                        {collection.wasteStatus === "Pending" && (
                          <Button
                            startIcon={<EditIcon fontSize="large" />}
                            sx={{ color: "#dbb012" }}
                            onClick={() => handleEditClick(collection)}
                          />
                        )}
                        <Button
                          startIcon={<DeleteIcon fontSize="large" />}
                          sx={{ color: "#520303" }}
                          onClick={() => handleDeleteClick(collection)}
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                          marginTop: "-10px",
                        }}
                      >
                        {collection.wasteStatus === "Approved" && (
                          <Button
                            variant="contained"
                            color="secondary"
                            sx={{ marginRight: "8px" }}
                          >
                            Payment
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      
      <Dialog open={dialogOpen} onClose={handleCloseEdit}>
        <DialogTitle>Edit Collection</DialogTitle>
        <DialogContent>
          <UpdateCollection
            initialData={editCollection}
            onClose={handleCloseEdit}
          />
        </DialogContent>
      </Dialog>

      
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this collection?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SpecialCollectionHistory;
