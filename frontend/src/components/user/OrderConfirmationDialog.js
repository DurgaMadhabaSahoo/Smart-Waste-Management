// OrderConfirmationDialog.js
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const OrderConfirmationDialog = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Order Confirmation</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Your order has been successfully placed. A receipt will be generated for the transaction.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderConfirmationDialog;
