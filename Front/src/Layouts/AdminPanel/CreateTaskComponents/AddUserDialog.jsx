// AddUserDialog.js

import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete, TextField, Button } from "@mui/material";

const AddUserDialog = ({ isOpen, onClose, userOptions, selectedUser, handleAddUser, handleUserChange }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth >
      <DialogTitle>Add User</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={userOptions}
          getOptionLabel={(user) => user.username}
          value={selectedUser}
          onChange={handleUserChange}
          renderInput={(params) => <TextField {...params} label="Username" variant="outlined" fullWidth />}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAddUser} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;
