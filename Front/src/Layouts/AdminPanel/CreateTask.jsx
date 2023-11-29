import React, { useState } from "react";
import { useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography,Autocomplete } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import { Token } from "@mui/icons-material";

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

  const [assignedUsers, setAssignedUsers] = useState([]);
  const [submittedSubtask, setSubmittedSubtask] = useState(null);

  //for adding a user ot the task
  const [isAddUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

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
    const requestData = {
      title: "Task Title2",
      description: "Task Description2",
      startDate: "10/01/2023",
      endDate: "10/02/2023",
      subtasks: [
        {
          title: "Subtask Title2",
          description: "Subtask Description2",
          requiredPhotosCount: 1,
          requiredNotesCount: 1,
        },
      ],
      employees: [
        {
          employeeId: "9a5758dc-5eb8-426a-ae86-d86b1fddfbff",
        },
      ],
    };

    try {
      const response = await fetch("https://localhost:7136/api/tasks/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        console.log("Task created successfully:");
      } else {
        console.error("Failed to create task");
      }
    } catch (error) {
      console.error("An error occurred while creating the task", error);
    }
  };

  
  const handleAddUser = () => {
    if (selectedUser) {
      setAssignedUsers((prevUsers) => [...prevUsers, selectedUser]);
      closeAddUserDialog();
    }
  }; 

  const fetchUserOptions = async (inputValue) => {
    try {
      const response = await fetch(
        `https://localhost:7136/api/users/all_employees`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        return userData.map((user) => ({
          id: user.employeeId,
          username: user.userName,
        }));
      } else {
        console.error("Failed to fetch user options");
        return [];
      }
    } catch (error) {
      console.error("An error occurred while fetching user options", error);
      return [];
    }
  };

  useEffect(() => {
    const loadUserOptions = async () => {
      const options = await fetchUserOptions(newUserName);
      setUserOptions(options);
    };

    loadUserOptions();
  }, [newUserName]);
  
  

  return (
    <Grid container spacing={2} sx={{mb:10, mt:1}}>
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
                to={`/createSubtask`}
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
          <Autocomplete
            options={userOptions}
            getOptionLabel={(user) => user.username}
            value={selectedUser}
            onChange={(event, newValue) => setSelectedUser(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Username" variant="outlined" fullWidth />
            )}
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
