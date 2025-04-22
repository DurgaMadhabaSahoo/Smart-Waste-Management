// DeleteConfirmationDialog.js
import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Box
} from '@mui/material';

const DeleteConfirmationDialog = ({ open, onClose, onConfirm }) => {
    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            sx={{ backdropFilter: 'blur(5px)', zIndex: 1301 }} // Adjust the zIndex to place it above other elements
        >
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                Confirm Deletion
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ textAlign: 'center' }}>
                    Are you sure you want to delete this request? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <Button onClick={onClose} color="primary" variant="outlined" sx={{ marginRight: 1 }}>
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="error" variant="contained">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;
