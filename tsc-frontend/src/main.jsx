import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { Meeting } from "./Meeting";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider, makeStyles } from "@mui/styles";
import { createTheme } from "@mui/material";

const theme = createTheme();
export const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: "#cf9c2e", // Replace with your desired primary color
    "&:hover": {
      backgroundColor: "#cf9c2e", // Replace with your desired hover color
    },
  },
}));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    ),
  },
  {
    path: "/render-meeting",
    element: <Meeting />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
