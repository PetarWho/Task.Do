import React, { useState } from "react";
import { useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography, Autocomplete } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import fetch from '../../axiosInterceptor';
import SubtaskModal from './subtaskModal';

const CreateTask = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [task, setTask] = useState();
  const [subTasks, setSubTasks] = useState([]);
  const authToken = localStorage.getItem('authToken');

  const [assignedUsers, setAssignedUsers] = useState([]);
  const [submittedSubtask, setSubmittedSubtask] = useState(null);

  //for adding a user ot the task
  const [isAddUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStartDate, setTaskStartDate] = useState('');
  const [taskEndDate, setTaskEndDate] = useState('');
  const [isSubtaskModalOpen, setSubtaskModalOpen] = useState(false);

  const openSubtaskModal = () => {
    setSubtaskModalOpen(true);
  };

  const closeSubtaskModal = () => {
    setSubtaskModalOpen(false);
  };
  const openAddUserDialog = () => {
    setAddUserDialogOpen(true);
  };

  const closeAddUserDialog = () => {
    setAddUserDialogOpen(false);
    setNewUserName(''); // Clear the input when the dialog is closed
  };

  useEffect(() => {
    const today = new Date();

    const startDate = new Date(today.getTime() + 60 * 60 * 1000);
    const endDate = new Date(today.getTime() + 2 * 60 * 60 * 1000);

    const formattedStartDate = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')
      }-${startDate.getDate().toString().padStart(2, '0')}T${startDate.getHours().toString().padStart(2, '0')
      }:00`;

    const formattedEndDate = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')
      }-${endDate.getDate().toString().padStart(2, '0')}T${endDate.getHours().toString().padStart(2, '0')
      }:00`;

    setTaskStartDate(formattedStartDate);
    setTaskEndDate(formattedEndDate);
  }, []);

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

  const handleSubtaskSubmit = (newSubtask) => {
    setSubTasks([...subTasks, newSubtask]);
  };

  const handleDeleteUser = (userId) => {
    const updatedUsers = assignedUsers.filter((user) => user.id !== userId);
    setAssignedUsers(updatedUsers);
  };
  const handleDeleteSubTask = (subTaskId) => {
    const updatedSubTasks = subTasks.filter((subtask) => subtask.id !== subTaskId);
    setSubTasks(updatedSubTasks);
  };

  const formatDate = (date) => {
    const formattedDate = new Date(date);
    const day = formattedDate.getDate().toString().padStart(2, '0');
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = formattedDate.getFullYear();
    const hours = formattedDate.getHours().toString().padStart(2, '0');
    const minutes = formattedDate.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };



  const handleCreateTask = async () => {
    const requestData = {
      title: taskTitle,
      description: taskDescription,
      startDate: formatDate(taskStartDate),
      endDate: formatDate(taskEndDate),
      subtasks: subTasks, // Updated to use subTasks from the frontend
      employees: assignedUsers.map((user) => ({ employeeId: user.EmployeeId })),
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
      navigate("/")
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
            Authorization: `Bearer ${authToken}`
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        return userData.map((user) => ({
          EmployeeId: user.id,
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
    <Grid container spacing={2} sx={{ mb: 10, mt: 1 }}>
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
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
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
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <form noValidate>
              <TextField
                id="datetime-local-start"
                label="Start time"
                type="datetime-local"
                InputLabelProps={{
                  shrink: true,
                }}
                value={taskStartDate}
                onChange={(e) => setTaskStartDate(e.target.value)}
              />
            </form>
          </Grid>
          <Grid item xs={6}>
            <form noValidate>
              <TextField
                id="datetime-local-start"
                label="End time"
                type="datetime-local"
                InputLabelProps={{
                  shrink: true,
                }}
                value={taskEndDate}
                onChange={(e) => setTaskEndDate(e.target.value)}
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
            onClick={() => openSubtaskModal()}
          >
            Add Subtask
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
          <SubtaskModal
            isOpen={isSubtaskModalOpen}
            onClose={closeSubtaskModal}
            onSubmit={handleSubtaskSubmit}
          />
          <Button
            variant="outlined"
            style={{ color: "green", borderColor: "green" }}
            onClick={handleCreateTask}
          >
            Create
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
