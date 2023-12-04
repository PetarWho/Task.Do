
import React from "react";
import { List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";

const SubtaskList = ({ subTasks, handleDeleteSubTask }) => {
  return (
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
  );
};

export default SubtaskList;
