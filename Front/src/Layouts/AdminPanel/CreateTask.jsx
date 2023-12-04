import React, { useState } from "react";
import { useEffect } from "react";
import { Grid, TextField, Typography } from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import fetch from '../../axiosInterceptor';
import SubtaskModal from './subtaskModal';
import AddUserDialog from "./CreateTaskComponents/AddUserDialog";
import AssignedUsers from "./CreateTaskComponents/AssignedUsers";
import TaskDetails from "./CreateTaskComponents/TaskDetails";
import SubtaskList from "./CreateTaskComponents/SubTaskList";

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
      subtasks: subTasks,
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
  const handleEditSubtask = (subtaskId) => {
    const subtaskToEdit = subTasks.find((subtask) => subtask.id === subtaskId);
    if (subtaskToEdit) {
      setSubmittedSubtask(subtaskToEdit);
      setSubtaskModalOpen(true);
    }
  };

  const handleUpdateSubtask = (updatedSubtask) => {
    const updatedSubtasks = subTasks.map((subtask) =>
      subtask.id === updatedSubtask.id ? updatedSubtask : subtask
    );
    setSubTasks(updatedSubtasks);
    setSubmittedSubtask(null);
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
      {/* Task Details */}
      <Grid item xs={6}>
        <TaskDetails
          taskTitle={taskTitle}
          taskDescription={taskDescription}
          taskStartDate={taskStartDate}
          taskEndDate={taskEndDate}
          setTaskTitle={setTaskTitle}
          setTaskDescription={setTaskDescription}
          setTaskStartDate={setTaskStartDate}
          setTaskEndDate={setTaskEndDate}
        />
        {/* Subtask List */}
        <SubtaskList
          subTasks={subTasks}
          handleDeleteSubTask={handleDeleteSubTask}
          handleEditSubtask={handleEditSubtask}
        />
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
            onSubmit={(newSubtask) => {
              if (submittedSubtask) {
                handleUpdateSubtask(newSubtask);
              } else {
                handleSubtaskSubmit(newSubtask);
              }
            }}
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

      {/* Assigned Users */}
      <AssignedUsers
        key="uniqueAssignedUsersKey"
        assignedUsers={assignedUsers}
        handleDeleteUser={handleDeleteUser}
        openAddUserDialog={openAddUserDialog}
      />
      {/* Add User Dialog */}
      <AddUserDialog
        isOpen={isAddUserDialogOpen}
        onClose={closeAddUserDialog}
        userOptions={userOptions}
        selectedUser={selectedUser}
        handleAddUser={handleAddUser}
        handleUserChange={(event, newValue) => setSelectedUser(newValue)}
      />
    </Grid>
  );
};

export default CreateTask;
