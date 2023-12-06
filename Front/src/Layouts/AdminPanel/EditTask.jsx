import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import fetch from "../../axiosInterceptor";
import SubtaskModal from "./subtaskModal";
import AddUserDialog from "./CreateTaskComponents/AddUserDialog";
import AssignedUsers from "./CreateTaskComponents/AssignedUsers";
import TaskDetails from "./CreateTaskComponents/TaskDetails";
import SubtaskList from "./CreateTaskComponents/SubTaskList";

const EditTask = () => {
    const navigate = useNavigate();
    const { taskId } = useParams();
    const [subTasks, setSubTasks] = useState([]);
    const authToken = localStorage.getItem("authToken");
    const [errorMsg, setErrorMsg] = useState("");
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [submittedSubtask, setSubmittedSubtask] = useState(null);
    const [edit, setEdit] = useState(null);

    const [isAddUserDialogOpen, setAddUserDialogOpen] = useState(false);
    const [userOptions, setUserOptions] = useState([]);
    const [newUserName, setNewUserName] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskStartDate, setTaskStartDate] = useState("");
    const [taskEndDate, setTaskEndDate] = useState("");
    const [isSubtaskModalOpen, setSubtaskModalOpen] = useState(false);
    const [subTaskIdCounter, setSubTaskIdCounter] = useState(0);

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
        setNewUserName("");
    };

    useEffect(() => {
        const today = new Date();

        const startDate = new Date(today.getTime() + 60 * 60 * 1000);
        const endDate = new Date(today.getTime() + 2 * 60 * 60 * 1000);

        const formattedStartDate = `${startDate.getFullYear()}-${(
            startDate.getMonth() + 1
        )
            .toString()
            .padStart(2, "0")}-${startDate
                .getDate()
                .toString()
                .padStart(2, "0")}T${startDate
                    .getHours()
                    .toString()
                    .padStart(2, "0")}:00`;

        const formattedEndDate = `${endDate.getFullYear()}-${(
            endDate.getMonth() + 1
        )
            .toString()
            .padStart(2, "0")}-${endDate
                .getDate()
                .toString()
                .padStart(2, "0")}T${endDate.getHours().toString().padStart(2, "0")}:00`;

        setTaskStartDate(formattedStartDate);
        setTaskEndDate(formattedEndDate);
    }, []);

    const handleSubtaskSubmit = (newSubtask) => {
        const subtaskWithId = {
            ...newSubtask,
            id: subTaskIdCounter,
        };

        setSubTaskIdCounter(subTaskIdCounter + 1);

        setSubTasks([...subTasks, subtaskWithId]);
    };

    const handleDeleteUser = (userId) => {
        const updatedUsers = assignedUsers.filter(
            (user) => (user.Id || user.EmployeeId) !== userId
        );
        setAssignedUsers(updatedUsers);
    };
    
    const handleDeleteSubTask = (subTaskId) => {
        const updatedSubTasks = subTasks.filter(
            (subtask) => (subtask.Id || subtask.id)  !== subTaskId
        );
        setSubTasks(updatedSubTasks);
    };

    const formatDate = (date) => {
        const formattedDate = new Date(date);
        const day = formattedDate.getDate().toString().padStart(2, "0");
        const month = (formattedDate.getMonth() + 1).toString().padStart(2, "0");
        const year = formattedDate.getFullYear();
        const hours = formattedDate.getHours().toString().padStart(2, "0");
        const minutes = formattedDate.getMinutes().toString().padStart(2, "0");
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    useEffect(() => {
        const fetchTaskData = async () => {
            try {
                const response = await fetch(
                    `https://localhost:7136/api/tasks/get_by_id?taskId=${taskId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );

                if (response.ok) {
                    const taskData = await response.json();
                    setTaskTitle(taskData.Title);
                    setTaskDescription(taskData.Description);
                    setTaskStartDate(taskData.StartDate);
                    setTaskEndDate(taskData.EndDate);
                    setSubTasks(taskData.Subtasks.$values);
                    setAssignedUsers(taskData.Employees.$values);
                } else {
                    setErrorMsg("Failed to fetch task data");
                }
            } catch (error) {
                console.error("An error occurred while fetching task data", error);
                setErrorMsg("An error occurred while fetching task data");
            }
        };

        fetchTaskData();
    }, [taskId, authToken]);

    const handleEditTask = async () => {
        try {
            const response = await fetch(
                `https://localhost:7136/api/tasks/edit?taskId=${taskId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({
                        title: taskTitle,
                        description: taskDescription,
                        startDate: formatDate(taskStartDate),
                        endDate: formatDate(taskEndDate),
                        subtasks: subTasks,
                        employees: assignedUsers.map((user) => ({ employeeId: user.EmployeeId??user.Id })),
                    }),
                }
            );

            if (response.ok) {
                navigate("/");
            } else {
                setErrorMsg("Failed to edit the task");
            }
        } catch (error) {
            console.error("An error occurred while editing the task", error);
            setErrorMsg("An error occurred while editing the task");
        }
    };

    const handleEditSubtask = (subtaskk) => {
        const subtaskToEdit = subTasks.find(
            (subtask) => subtask.id === subtaskk.id
        );
        if (subtaskToEdit) {
            setEdit(subtaskToEdit);
            setSubtaskModalOpen(true);
            setSubmittedSubtask(subtaskToEdit);
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
                        Authorization: `Bearer ${authToken}`,
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
                    Edit Task
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
                        initialData={edit ? edit : null}
                        onSubmit={(newSubtask) => {
                            if (submittedSubtask) {
                                handleUpdateSubtask(newSubtask);
                            } else {
                                setSubmittedSubtask(null);
                                handleSubtaskSubmit(newSubtask);
                            }
                        }}
                    />
                    <Button
                        variant="outlined"
                        style={{ color: "green", borderColor: "green" }}
                        onClick={handleEditTask}
                    >
                        Save
                    </Button>
                    {errorMsg && (
                        <Typography color="error" variant="subtitle2" sx={{ marginTop: 1 }}>
                            {errorMsg}
                        </Typography>
                    )}
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

export default EditTask;
