import React from "react";
import { Typography, List, ListItem, ListItemAvatar, ListItemText, Button, Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const AssignedUsers = ({ assignedUsers, handleDeleteUser, openAddUserDialog }) => {
  return (
    <Grid item xs={6}>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h5" component="div">
        Assigned users
      </Typography>
      <List>
        {assignedUsers.map((user, index) => (
          <ListItem key={index} sx={{ margin: "15px", width: "auto", display: "flex", justifyContent: "space-between" }}>
            <ListItemText primary={user.username} />
            <ListItemAvatar>
              <DeleteIcon onClick={() => handleDeleteUser(user.id)} style={{ cursor: "pointer" }} />
            </ListItemAvatar>
          </ListItem>
        ))}
      </List>
      <Grid item xs={12} md={12} sx={{ display: "flex", justifyContent: "flex-end", margin: "20px" }}>
        <Button variant="outlined" style={{ color: 'green', borderColor: 'green' }} onClick={openAddUserDialog}>
          Add Users
        </Button>
      </Grid>
    </Grid>
  );
};

export default AssignedUsers;
