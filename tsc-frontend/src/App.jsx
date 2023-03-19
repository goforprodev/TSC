import React, { useState } from "react";
import axios from "axios";
import { PropTypes } from "prop-types";
// import AddBoxIcon from "@mui/icons-material/AddBox";
import {
  Container,
  Grid,
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import Choose from "./components/Choose/Choose";
import CopyToClipboardButton from "./components/CopyToClipBoardBtn";
import { useStyles } from "./main";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Grid
          padding={5}
          container
          spacing={0}
          direction="column"
          // justifyContent={"center"}
          // alignItems={"center"}
          rowGap={2}
          style={{ minHeight: "100vh" }}
        >
          {children}
        </Grid>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export const App = () => {
  const [title, setTitle] = useState("");
  const [field, setField] = useState("");
  const [fields, setFields] = useState([]);
  const [error, setError] = useState("");
  const [link, setLink] = useState("");
  const [value, setValue] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title && fields.length) {
      const data = await createForm(title, fields);
      const str = `http://localhost:5173/render-meeting?hash=${data.urlSuffix}`;
      setLink(str);
    } else {
      setError("Fill in all the fields");
    }
  };

  const handleDelete = (text) => {
    const newField = fields.filter((x) => x !== text);
    setFields(newField);
  };

  const createForm = async (title, fields) => {
    const res = await axios.post("/api/create", { title, fields });
    const data = await res.data;
    return data;
  };
  const allyprops = (index) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };
  const handleTabChange = (e, newVal) => {
    setValue(newVal);
  };

  // CUSTOME STYLE CLASSES ===
  const classes = useStyles();

  return (
    <>
      <Container maxWidth="sm">
        <img src="logo.png" alt="logo" height={"150px"}  />
        <Typography variant="body1">{error}</Typography>
        <Box>
          <Tabs value={value} onChange={handleTabChange}>
            <Tab label="Create Meeting" {...allyprops(0)} />
            <Tab label="inference" {...allyprops(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Box component={"form"} onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  id="meeting__title"
                  label="Title"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>
              <Grid item xs={10}>
                <TextField
                  fullWidth
                  id="meeting__field"
                  label="Fields"
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  className={classes.button}
                  variant="contained"
                  sx={{ height: "100%" }}
                  type="button"
                  onClick={() => {
                    field !== ""
                      ? setFields((prev) => [...prev, field])
                      : setError("display field");
                    setField("");
                  }}
                >
                  {/* <AddBoxIcon /> */}+
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Box
                  borderRadius={3}
                  paddingX={2}
                  paddingY={2}
                  sx={{ border: "1px solid #888", height: "250px" }}
                >
                  <Stack direction={"row"} spacing={2}>
                    {fields.map((field, idx) => (
                      <Choose
                        text={field}
                        handleClick={() => handleDelete(field)}
                        key={idx}
                      />
                    ))}
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button
                  className={classes.button}
                  variant="contained"
                  type="submit"
                  fullWidth
                  sx={{ height: "100%" }}
                >
                  Submit
                </Button>
              </Grid>
              <Grid item xs={12}>
                {link && <CopyToClipboardButton response={link} />}
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Grid item xs={3}>
            <TextField fullWidth label="Paste Link" />
          </Grid>
          <Grid item xs={12}>
            <Button>Download csv</Button>
          </Grid>
        </TabPanel>
      </Container>
    </>
  );
};
