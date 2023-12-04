import { Grid, TextField, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React, { useState, useEffect } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useNavigate, useLocation } from "react-router-dom";
import fetch from '../../axiosInterceptor';


function SubtaskModal({ isOpen, onClose, onSubmit }) {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [needsImage, setNeedsImage] = useState(false);
    const [imageCount, setImageCount] = useState(0);
    const [noteCount, setNoteCount] = useState(1);

    const navigate = useNavigate();
    const location = useLocation();
    const subtaskInfo = location.state
        ? location.state.subtask
        : {
            title: "",
            description: "",
            requiredPhotosCount: 0,
            requiredNotesCount: 1,
        };
    const [originalSubtaskInfo, setOriginalSubtaskInfo] = useState(subtaskInfo);
    const [editedSubtaskInfo, setEditedSubtaskInfo] = useState({
        ...subtaskInfo,
    });
    const [hasChanges, setHasChanges] = useState(false);
    const authToken = localStorage.getItem('authToken');
    const isEditing = !!location.state?.subtask;

    useEffect(() => {
        if (isEditing) {
            setEditedSubtaskInfo({ ...subtaskInfo });
            setOriginalSubtaskInfo({ ...subtaskInfo });
            setTaskName(subtaskInfo.title || "");
            setTaskDescription(subtaskInfo.description || "");
            setNeedsImage(subtaskInfo.requiredPhotosCount !== 0);
            setImageCount(subtaskInfo.requiredPhotosCount || 0);
            setNoteCount(subtaskInfo.requiredNotesCount || 1);
        }
        setHasChanges(false);
    }, [subtaskInfo, isEditing]);

    const handleTaskNameChange = (event) => {
        const updatedTaskName = event.target.value;
        setTaskName(updatedTaskName);
        setEditedSubtaskInfo({ ...editedSubtaskInfo, title: updatedTaskName });
        setHasChanges(true);
    };

    const handleTaskDescriptionChange = (event) => {
        const updatedDescription = event.target.value;
        setTaskDescription(updatedDescription);
        setEditedSubtaskInfo({
            ...editedSubtaskInfo,
            description: updatedDescription,
        });
        setHasChanges(true);
    };

    const handleImageCountChange = (event) => {
        const count = parseInt(event.target.value);
        setImageCount(count);
        setEditedSubtaskInfo({ ...editedSubtaskInfo, requiredPhotosCount: count });
        setHasChanges(true);
    };

    const handleNoteCountChange = (event) => {
        const count = parseInt(event.target.value);
        setNoteCount(count);
        setEditedSubtaskInfo({ ...editedSubtaskInfo, requiredNotesCount: count });
        setHasChanges(true);
    };

    //Edit subTask Method
    const EditSubtask = async () => {
        const id = "AF90AB0C-96ED-4352-36B6-08DBEB63AB9D";
        const data = {
            title: "Subtask Title Edited",
            description: "Subtask Description Edited",
            requiredPhotosCount: 0,
            requiredNotesCount: 1,
        };
        try {
            const response = await fetch(
                `https://localhost:7136/api/subtasks/edit?id=${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify(data),
                }
            );

            if (response.ok) {
                console.log("Task edited successfully:");
            } else {
                console.error("Failed to edit subtask");
            }
        } catch (error) {
            console.error("An error occurred while editing the subtask", error);
        }
    };

    const handleSubmit = () => {
        const newSubtask = {
            title: taskName,
            description: taskDescription,
            requiredPhotosCount: needsImage ? imageCount : 0,
            requiredNotesCount: noteCount,
        };
        onSubmit(newSubtask);
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>Create Subtask</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ width: "50%", margin: "auto" }}>
                    <Grid item xs={12}>
                        <Typography
                            style={{
                                textAlign: "center",
                                fontSize: "1.5rem",
                                marginBottom: "16px",
                            }}
                        >
                            {isEditing ? "Edit Subtask" : "Create Subtask"}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                        <TextField
                            fullWidth
                            label="Subtask Name"
                            variant="outlined"
                            margin="normal"
                            value={taskName}
                            onChange={handleTaskNameChange}
                        />
                    </Grid>
                    <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                        <TextField
                            fullWidth
                            label="Subtask Description"
                            multiline
                            rows={4}
                            placeholder="Enter Task Description"
                            variant="outlined"
                            margin="normal"
                            value={taskDescription}
                            onChange={handleTaskDescriptionChange}
                        />
                    </Grid>
                    <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={needsImage}
                                    onChange={(e) => setNeedsImage(e.target.checked)}
                                />
                            }
                            label="Needs image"
                        />
                    </Grid>
                    {needsImage && (
                        <Grid
                            item
                            xs={12}
                            style={{ display: "flex", justifyContent: "center" }}
                        >
                            <TextField
                                fullWidth
                                label="Number of Images Needed"
                                variant="outlined"
                                margin="normal"
                                type="number"
                                value={imageCount}
                                onChange={handleImageCountChange}
                                sx={{ maxWidth: "180px" }}
                            />
                        </Grid>
                    )}
                    <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                        <FormControlLabel
                            control={<Switch checked={true} />}
                            label="Required"
                        />
                    </Grid>
                    <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                        <TextField
                            fullWidth
                            label="Number of Notes Needed"
                            variant="outlined"
                            margin="normal"
                            type="number"
                            value={noteCount}
                            onChange={handleNoteCountChange}
                            sx={{ maxWidth: "180px" }}
                            inputProps={{ min: 1 }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={isEditing ? !hasChanges : false}
                    >
                        {isEditing ? "Save" : "Create"}
                    </Button>
                </Grid>
                {hasChanges && (
                    <Grid
                        item
                        xs={12}
                        style={{ display: "flex", justifyContent: "center" }}
                    ></Grid>
                )}
            </DialogActions>
        </Dialog>
    );
}

export default SubtaskModal;
