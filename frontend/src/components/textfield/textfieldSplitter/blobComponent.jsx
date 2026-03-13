import React from "react";
import { Button } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
const BlobComponent = ({ value, handleChange, handleGroupNameChange }) => {
  function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    handleChange(selectedFile);
    handleGroupNameChange(event.target.files[0].name);
  }
  React.useEffect(() => {
    function dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }
    if (!(value instanceof File) && value !== "") {
      var file = dataURLtoFile(
        `data:application/pdf;base64,${value}`,
        "hello.pdf"
      );
      if (file) {
        handleChange(file);
      }
    }
  }, []);
  return (
    <form action="submit">
      <label htmlFor="file-input">
        <input
          id="file-input"
          type="file"
          accept=".pdf"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Button
          component="span"
          variant="outlined"
          sx={{
            width: "100%",
            paddingY: "1px",
            fontWeight: "400",
            fontSize: "1rem",
          }}
          endIcon={<FileUploadIcon />}
        ></Button>
      </label>
    </form>
  );
};

export default BlobComponent;
