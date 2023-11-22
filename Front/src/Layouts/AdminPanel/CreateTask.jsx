import React, { useState } from "react";
import { useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Button from "@mui/material/Button";

const CreateTask = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const navigate = useNavigate();
  const location = useLocation();
  const [subTasks, setSubTasks] = useState([
    { id: 1, title: "SubTask 1", description: "SubDescription 1" },
    { id: 2, title: "SubTask 2", description: "SubDescription 2" },
    { id: 3, title: "SubTask 3", description: "SubDescription 3" },
  ]);

  const [assignedUsers, setAssignedUsers] = useState([
    {
      id: 1,
      username: "Simona Simeonova",
    },
    {
      id: 2,
      username: "Peter Penev",
    },
    {
      id: 3,
      username: "Veselin Kokoshkov",
    },
  ]);
  const [submittedSubtask, setSubmittedSubtask] = useState(null);

  //for adding a user ot the task
  const [isAddUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  const openAddUserDialog = () => {
    setAddUserDialogOpen(true);
  };

  const closeAddUserDialog = () => {
    setAddUserDialogOpen(false);
    setNewUserName(''); // Clear the input when the dialog is closed
  };


  useEffect(() => {
    const receivedData = location.state?.submittedSubtask;
    if (receivedData) {
      console.log("Received subtask data:", receivedData);
      setSubmittedSubtask(receivedData);
    }
  }, [location.state]);

  useEffect(() => {
    if (submittedSubtask !== null) {
      setSubTasks((prevState) => [...prevState, submittedSubtask]);
    }
  }, [submittedSubtask]);

  const createSubtask = () => {
    navigate("/createSubtask");
  };

  const handleDeleteUser = (userId) => {
    const updatedUsers = assignedUsers.filter((user) => user.id !== userId);
    setAssignedUsers(updatedUsers);
  };
  const handleDeleteSubTask = async (subTaskId) => {
    subTaskId = '550e8400-e29b-41d4-a716-446655440000'; //Hardcode example for Guid Id
    try {
      const apiUrl = `https://localhost:7136/api/subtasks/delete?id=${subTaskId}`;
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error deleting subtask:', error);
    }
  };

  const handleCreateTask = async () => {
    try {
      
      const response = await fetch(`https://localhost:7136/api/tasks/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Task Title", 
          description: "Task Description", 
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(), 
          employees: assignedUsers.map(user => ({ employeeId: user.id })),
          subtasks: subTasks.map(subtask => ({
            title: subtask.title,
            description: subtask.description,
            requiredNotesCount: subtask.requiredNotesCount || 0,
            requiredPhotosCount: subtask.requiredPhotosCount || 0,
          })),
        }),
      });

      if (response.ok) {
        // Task created successfully
        console.log("Task created successfully");
        // You may want to redirect or handle success in some way
      } else {
        // Handle error
        console.error("Failed to create task");
      }
    } catch (error) {
      console.error("An error occurred while creating the task", error);
    }
  };

  const fetchUsersFromDatabase = async () => {
    try {
      const apiUrl = 'https://localhost:7136/api/Users/all'; // Change the URL to your actual API endpoint
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setAssignedUsers(data); // Assuming your API returns an array of users
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUsers = () => {
    fetchUsersFromDatabase();
  };

  const handleAddUser = async () => {
    try {
      const apiUrl = `https://localhost:7136/api/Users/check_existence?name=${newUserName}`;
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const userExists = await response.json();
  
      if (userExists) {
        // User exists, add the new user to the state
        const newUserId = assignedUsers.length + 1; // Replace with your logic to generate a unique ID
        const newUser = {
          id: newUserId,
          username: newUserName,
        };
        setAssignedUsers((prevUsers) => [...prevUsers, newUser]);
      } else {
        // User does not exist in the database, handle accordingly (show an error message, etc.)
        console.error('User does not exist in the database');
      }
  
      // Close the dialog
      closeAddUserDialog();
    } catch (error) {
      console.error('Error checking user existence:', error);
    }
  };
  
  

  

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography
          style={{
            textAlign: "center",
            fontSize: "1.5rem",
            marginBottom: "16px",
          }}
          variant="h6"
          component="div"
        >
          Create Task
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Grid container spacing={2} sx={{ margin: "10px" }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Task Name"
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Task Description"
              multiline
              rows={4}
              placeholder="Enter Task Description"
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <form noValidate>
              <TextField
                id="datetime-local-start"
                label="Start time"
                type="datetime-local"
                defaultValue="2017-05-24T10:30"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
          </Grid>
          <Grid item xs={6}>
            <form noValidate>
              <TextField
                id="datetime-local-end"
                label="End time"
                type="datetime-local"
                defaultValue="2017-05-24T10:30"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
          </Grid>
        </Grid>
        <List>
          {subTasks.map((subtask, index) => (
            <ListItem
              key={index}
              sx={{
                border: "1px solid rgb(177, 226, 247)",
                margin: "10px",
                width: "auto",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Link
                to={`/subtask/${subtask.id}`}
                state={{ subtask: subtask }}
                style={{
                  textDecoration: "none",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <ListItemText primary={subtask.title} />
              </Link>
              <ListItemAvatar>
                <DeleteIcon
                  onClick={() => handleDeleteSubTask(subtask.id)}
                  style={{ cursor: "pointer" }}
                ></DeleteIcon>
              </ListItemAvatar>
            </ListItem>
          ))}
        </List>
        <Grid
          item
          xs={12}
          md={12}
          sx={{ display: "flex", justifyContent: "flex-end", margin: "10px" }}
        >
          <Button
            variant="outlined"
            style={{ color: "green", borderColor: "green" }}
            onClick={() => createSubtask()}
          >
            Add
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            margin: "10px",
            gap: "10px",
          }}
        >
          <Button
            variant="outlined"
            style={{ color: "green", borderColor: "green" }}
            onClick={handleCreateTask}
          >
            Done
          </Button>
          <Button
            variant="outlined"
            style={{ color: "red", borderColor: "red" }}
          >
            Delete
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          Assigned users
        </Typography>
        <List>
          {assignedUsers.map((user) => (
            <ListItem
              key={user.id}
              sx={{
                margin: "10px",
                width: "auto",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <ListItemText primary={user.username} />
              <ListItemAvatar>
                <DeleteIcon
                  onClick={() => handleDeleteUser(user.id)}
                  style={{ cursor: "pointer" }}
                />
              </ListItemAvatar>
            </ListItem>
          ))}
        </List>

        <Grid
          item
          xs={12}
          md={12}
          sx={{ display: "flex", justifyContent: "flex-end", margin: "20px" }}
        >
          <Button
            variant="outlined"
            style={{ color: 'green', borderColor: 'green' }}
            onClick={openAddUserDialog}
          >
            Add Users
          </Button>
        </Grid>
      </Grid>
      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onClose={closeAddUserDialog}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddUserDialog}>Cancel</Button>
          <Button onClick={handleAddUser} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default CreateTask;
