import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import BackButton from "../Utils/BackButton";
import FileUploader from "../Utils/FileUploader";
import SpinnerLoading from "../Utils/SpinnerLoading";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate, useParams } from "react-router-dom";
import fetch from '../../axiosInterceptor';

function Subtask() {
  const navigate = useNavigate();
  const { subtaskId } = useParams();
  const [subtask, setSubtask] = useState(null);
  const [fileName, setFileName] = useState("");
  const [noteText, setNoteText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchSubtaskData = async () => {
      try {
        const response = await fetch(
          `https://localhost:7136/api/subtasks/get_by_id?subtaskId=${subtaskId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSubtask(data);
      } catch (error) {
        console.error("Error fetching subtask data:", error);
      }
      setIsLoading(false);
    };

    if (subtaskId) {
      fetchSubtaskData();
    }
  }, [subtaskId]);

  const handleFile = async (file) => {
    setFileName(file.name);
  
    const reader = new FileReader();
  
    reader.onload = async (event) => {
      try {
        const response = await fetch(`https://localhost:7136/api/subtasks/add_image?subtaskId=${subtask.Id}&imagePath=${file.name}`, {
          method: "POST",
          headers:{
            "Content-Type": `application/json;`,
            Authorization: `Bearer ${authToken}`
          }
        });
  
        if (!response.ok) {
          throw new Error("Image upload failed");
        }
  
        setIsLoading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    };
  
    reader.readAsDataURL(file); 
  };

  const addNote = async () => {
    try {
      const formData = new FormData();
      formData.append("subtaskId", subtask.Id); 
      formData.append("noteText", noteText);

      const response = await fetch(`https://localhost:7136/api/subtasks/add_note?subtaskId=${subtask.Id}&noteText=${noteText}`, {
        method: "POST",
        headers:{
          "Content-Type": `application/json;`,
          Authorization: `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error("Adding note failed");
      }

      navigate(`/task/${subtask.TaskId}`);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  if (!subtask) {
    return <SpinnerLoading />;
  }

  return (
    <Box sx={{ flexGrow: 1, maxWidth: "100%" }}>
      <Grid container spacing={2}>
        <Grid item xs={1} md={1} sx={{marginTop: '10px'}}>
          <BackButton />
        </Grid>

        <Grid item xs={12} md={12}>
          <Typography variant="h5">{subtask.title}</Typography>
          <Typography variant="body1">{subtask.description}</Typography>
        </Grid>

        <Grid item xs={12} md={12}>
          <FileUploader handleFile={handleFile} />
          {fileName && <p>Uploaded file: {fileName}</p>}
        </Grid>

        <Grid item xs={12} md={12}>
          <TextField
            id="note-text"
            label="Leave a note"
            multiline
            rows={4}
            variant="outlined"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={12}>
          <Button
            variant="contained"
            onClick={addNote}
            disabled={!fileName && !noteText}
          >
            Save Note
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Subtask;
