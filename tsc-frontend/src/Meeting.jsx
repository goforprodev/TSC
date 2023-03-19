import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import FieldForm from "./components/FieldForm";
import {
  Container,
  CircularProgress,
  Box,
  Grid,
  Typography,
  Button,
} from "@mui/material";

export const Meeting = () => {
  const [meeting, setMeeting] = useState({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const location = useLocation();
  const q = new URLSearchParams(location.search);
  const urlSuffix = q.get("hash");

  useEffect(() => {
    const loadMeeting = async () => {
      const res = await axios.post("/api/load-meeting", { key: urlSuffix });
      setMeeting(res.data);
      setLoading(false);
    };
    loadMeeting();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formDataArray;
    if (formData) {
      formDataArray = Object.values(formData);
    }
    const res = await register(urlSuffix, formDataArray);
    console.log(res)
  };

  const register = async (key, detail) => {
    const res = await axios.post("/api/register", { key, detail });
    return res;
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Grid
          container
          direction={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          style={{ minHeight: "100vh" }}
        >
          <Grid item xs={12}>
            <CircularProgress />
          </Grid>
        </Grid>
      </Container>
    );
  }
  return (
    <Container maxWidth={"sm"}>
      <Typography variant="h3" paddingY={2} align="center">
        {meeting.title}
      </Typography>
      <Box component={"form"} onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {meeting.fields.map((field, idx) => (
              <FieldForm
                label={field}
                key={idx}
                formData={formData}
                handleChange={handleChange}
              />
            ))}
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth size="large">
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
