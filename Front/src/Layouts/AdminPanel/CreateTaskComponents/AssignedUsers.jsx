import React from "react";
import { Typography, List, ListItem, ListItemAvatar, ListItemText, Button, Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Inside the AssignedUsers component
const AssignedUsers = ({ assignedUsers, handleDeleteUser, openAddUserDialog }) => {
  return (
    <Grid item xs={5} sx={{ml:8}}>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h5" component="div">
        Assigned users
      </Typography>
      <List>
        {assignedUsers.map((user, index) => {
          return (
            <ListItem key={index} sx={{ margin: "10px", width: "auto", display: "flex", justifyContent: "space-between", border: "1px solid rgb(177, 226, 247)"}}>
              <ListItemText primary={user.username ?? user.UserName} />
              <ListItemAvatar>
                <DeleteIcon onClick={() => handleDeleteUser(user.EmployeeId)} style={{ cursor: "pointer" }} />
              </ListItemAvatar>
            </ListItem>
          );
        })}
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

