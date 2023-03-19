import React from "react";
import "./Choose.css";
import { Typography } from "@mui/material";

export default function Choose({ text, handleClick }) {
  return (
    <div className="choose__container">
      <Typography variant="body2">{text}</Typography>
      {/* <button type="button" onClick={handleClick}>x</button> */}
      <button onClick={handleClick} type="button">
        <Typography variant="button">x</Typography>
      </button>
    </div>
  );
}
