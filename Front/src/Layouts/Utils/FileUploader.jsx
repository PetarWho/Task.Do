import { useState, useRef } from "react";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const FileUploader = ({ handleFile, imageURL=null }) => {
  const hiddenFileInput = useRef(null);
  const [fileName, setFileName] = useState("");

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    handleFile(fileUploaded);
    setFileName(fileUploaded.name);
  };

  return (
    <>
      {!imageURL ? (
        <Button
          onClick={handleClick}
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          Upload
        </Button>
      ) : (
        <span onClick={handleClick}>
          <img
            className="profile-pic pointer"
            src={imageURL}
            alt="Profile Picture"
            referrerPolicy="no-referrer"
            title="Click to change"
          />
          <input
            type="file"
            onChange={handleChange}
            ref={hiddenFileInput}
            style={{ display: "none" }}
          />
        </span>
      )}
      {fileName && <p>Uploaded file: {fileName}</p>}
    </>
  );
};

export default FileUploader;
