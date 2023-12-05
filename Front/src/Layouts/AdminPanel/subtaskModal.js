import {
  Grid,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useNavigate, useLocation } from "react-router-dom";
import fetch from "../../axiosInterceptor";

function SubtaskModal({ isOpen, onClose, onSubmit, initialData }) {
  const [id, setId] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [needsImage, setNeedsImage] = useState(false);
  const [imageCount, setImageCount] = useState(0);
  const [noteCount, setNoteCount] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  //   const subtaskInfo = location.state
  //     ? location.state.subtask
  //     : {
  //         title: "",
  //         description: "",
  //         requiredPhotosCount: 0,
  //         requiredNotesCount: 1,
  //       };

  useEffect(() => {
    if (initialData) {
      setIsEditing(true);
      setId(initialData.id);
      setTaskName(initialData.title);
      setTaskDescription(initialData.description);
      setNeedsImage(initialData.requiredPhotosCount);
      setImageCount(initialData.requiredPhotosCount);
      setNoteCount(initialData.requiredNotesCount);
    }
  }, [initialData]);

  const [originalSubtaskInfo, setOriginalSubtaskInfo] = useState(initialData);
  const [editedSubtaskInfo, setEditedSubtaskInfo] = useState({
    ...initialData,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const authToken = localStorage.getItem("authToken");
  //   const isEditing = !!location.state?.subtask;

  useEffect(() => {
    if (isEditing) {
      setEditedSubtaskInfo({ ...initialData });
      setOriginalSubtaskInfo({ ...initialData });
      setTaskName(initialData.title || "");
      setTaskDescription(initialData.description || "");
      setNeedsImage(initialData.requiredPhotosCount !== 0);
      setImageCount(initialData.requiredPhotosCount || 0);
      setNoteCount(initialData.requiredNotesCount || 1);
    }
    setHasChanges(false);
  }, [initialData, isEditing]);

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

  const handleSubmit = () => {
    const updatedSubtask = {
      id: id,
      title: taskName,
      description: taskDescription,
      requiredPhotosCount: needsImage ? imageCount : 0,
      requiredNotesCount: noteCount,
    };

    if (isEditing) {
      console.log("You have updated the data");
      onSubmit(updatedSubtask);
    } else {
      const newSubtask = {
        title: taskName,
        description: taskDescription,
        requiredPhotosCount: needsImage ? imageCount : 0,
        requiredNotesCount: noteCount,
      };
      onSubmit(newSubtask);
    }

    // Reset the form fields and close the modal
    setId(null)
    setTaskName("");
    setTaskDescription("");
    setNeedsImage(false);
    setImageCount(0);
    setNoteCount(1);
    setHasChanges(false);
    initialData = null;
    setIsEditing(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        {initialData ? "Edit Subtask" : "Create Subtask"}
      </DialogTitle>
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
          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <TextField
              fullWidth
              label="Subtask Name"
              variant="outlined"
              margin="normal"
              value={taskName}
              onChange={handleTaskNameChange}
            />
          </Grid>
          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "center" }}
          >
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
          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "center" }}
          >
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
          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <FormControlLabel
              control={<Switch checked={true} />}
              label="Required"
            />
          </Grid>
          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "center" }}
          >
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
        <Grid
          item
          xs={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
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
