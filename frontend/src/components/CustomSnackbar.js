// CustomSnackbar.js
import React from "react";
import { Snackbar, Alert } from "@mui/material";

const CustomSnackbar = ({ open, onClose, message, severity = "success" }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
