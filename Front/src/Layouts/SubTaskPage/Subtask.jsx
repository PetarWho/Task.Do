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
import fetch from "../../axiosInterceptor";
import './subtask.css';


function Subtask() {
  const navigate = useNavigate();
  const { subtaskId } = useParams();
  const [subtask, setSubtask] = useState(null);
  const [fileName, setFileName] = useState("");
  const [noteText, setNoteText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const authToken = localStorage.getItem("authToken");
  const [userRole, setUserRole] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("https://localhost:7136/api/Users/get_role", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });


        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const role = await response.text();
        setUserRole(role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchSubtaskData = async () => {
      try {
        const response = await fetch(
          `https://localhost:7136/api/subtasks/get_by_id?subtaskId=${subtaskId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
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
        const arrayBuffer = event.target.result;
        const byteArray = new Uint8Array(arrayBuffer);

        const response = await fetch(
          `https://localhost:7136/api/subtasks/add_image?subtaskId=${subtask.Id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/octet-stream",
              Authorization: `Bearer ${authToken}`,
            },
            body: byteArray,
          }
        );



        if (!response.ok) {
          throw new Error("Image upload failed");
        }
        window.location.reload(true);
        setIsLoading(false);

      } catch (error) {
        console.error("Error uploading image:", error);
        setErrorMsg("Failed to upload image. Please try again.");

        // You can set a timer to clear the error message after a certain time
        setTimeout(() => {
          setErrorMsg("");
        }, 5000); // Clear the error message after 5 seconds, adjust as needed
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const addNote = async () => {
    try {
      const response = await fetch(
        `https://localhost:7136/api/subtasks/add_note?subtaskId=${subtask.Id}&noteText=${noteText}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Adding note failed");
      }

      navigate(`/task/${subtask.TaskId}`);
    } catch (error) {
      console.error("Error adding note:", error);
      setErrorMsg("Failed to add note. Please try again.");

      // You can set a timer to clear the error message after a certain time
      setTimeout(() => {
        setErrorMsg("");
      }, 5000); // Clear the error message after 5 seconds, adjust as needed
    }

  };

  if (!subtask) {
    return <SpinnerLoading />;
  }

  return (
    <Box sx={{ flexGrow: 1, maxWidth: "100%" }}>
      <Grid container spacing={2}>
        <Grid item xs={1} md={1} sx={{ marginTop: "10px" }}>
          <BackButton />
        </Grid>

        <Grid item xs={12} md={12}>
          <Typography variant="h5">{subtask.Title}</Typography>
          <Typography variant="body1">{subtask.Description}</Typography>
        </Grid>

        {/* Display Subtask Properties */}
        <Grid item xs={12} md={12}>
          <Typography variant="body1">Photos: {subtask.Images.$values.length}/{subtask.RequiredPhotosCount}</Typography>
          <Typography variant="body1">Notes: {subtask.Notes.$values.length}/{subtask.RequiredNotesCount}</Typography>
          <Typography variant="body1">{subtask.IsFinished ? "Finished" : "Unfinished"}</Typography>
        </Grid>

        {/* Display Uploaded Images */}
        <Grid item xs={12} md={12}>

          <Typography variant="h6">Uploaded Images</Typography>
          <div className="images-container">
            {subtask.Images && subtask.Images.$values && subtask.Images.$values.length > 0 ? (
              (() => {

                const imageElements = [];
                for (let i = 0; i < subtask.Images.$values.length; i++) {
                  const image = subtask.Images.$values[i];
                  imageElements.push(
                    <div key={image.Id}>
                      <img className="subtask-image" src={image.URL} alt={`Image ${image.Id}`} />
                    </div>
                  );
                }
                return imageElements;
              })()
            ) : (
              <Typography variant="body1">No images uploaded</Typography>
            )}
          </div>
        </Grid>
        {!userRole.includes("Manager") && subtask.Task.Status === 1 && subtask.Images.$values.length < subtask.RequiredPhotosCount && (
          <>
            <Grid item xs={12} md={12}>
              <FileUploader handleFile={handleFile} />
            </Grid>
          </>
        )}

        {/* Display Added Notes */}
        <Grid item xs={12} md={12}>
          <Typography variant="h6">Added Notes</Typography>
          {subtask.Notes && subtask.Notes.$values && subtask.Notes.$values.length > 0 ? (
            (() => {
              const noteElements = [];
              for (let i = 0; i < subtask.Notes.$values.length; i++) {
                const note = subtask.Notes.$values[i];
                noteElements.push(
                  <Typography key={note.Id} variant="body1" gutterBottom>
                    {note.Text}
                  </Typography>
                );
              }
              return noteElements;
            })()
          ) : (
            <Typography variant="body1">No notes added</Typography>
          )}
        </Grid>

        {!userRole.includes("Manager") && subtask.Task.Status === 1 &&subtask.Notes.$values.length < subtask.RequiredNotesCount && (
          <>
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

            <Grid item xs={12} md={12} sx={{ marginBottom: "120px" }}>
              <Button
                variant="contained"
                onClick={addNote}
                disabled={!fileName && !noteText}
              >
                Save Note
              </Button>
              {errorMsg && (
                <Typography variant="body1" color="error">
                  {errorMsg}
                </Typography>
              )}
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
}


export default Subtask;

