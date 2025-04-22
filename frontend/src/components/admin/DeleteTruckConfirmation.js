import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import axios from "axios";
import { API_URL } from "../../config/config";

const DeleteTruckConfirmation = ({ open, handleClose, truck, success }) => {
  const handleDelete = async (e) => {
    try {
      await axios.delete(`${API_URL}/truck/deletetruck/${truck._id}`, {
        withCredentials: true,
      });
      handleClose();
      success();
    } catch (error) {
      console.error("Failed to delete truck", error);
    }
  };

  return (
    <>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Truck</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the truck with number plate "{truck.numberPlate}"?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary.text">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="primary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default DeleteTruckConfirmation;
