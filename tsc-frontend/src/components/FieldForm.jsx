import { Button, Grid, TextField } from "@mui/material";
import React from "react";

const FieldForm = ({ label, formData, handleChange }) => {
  return (
    <TextField
      fullWidth
      required
      label={label}
      name={label}
      variant="outlined"
      value={formData[label] || ""}
      type={label.toLowerCase().includes("email") ? "email" : "text"}
      sx={{ marginY: "1rem" }}
      onChange={handleChange}
    />
  );
};

export default FieldForm;
