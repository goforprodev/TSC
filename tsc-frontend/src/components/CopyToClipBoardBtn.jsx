import { Button, Snackbar } from "@mui/material";
import { useState } from "react";
const CopyToClipboardButton = ({ response }) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    navigator.clipboard.writeText(response || "hello");
    setOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant="outlined"
        style={{ borderColor: "#cf9c2e" }}
      >
        {response}
      </Button>
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={2000}
        message="Copied to clipboard"
      />
    </>
  );
};

export default CopyToClipboardButton;
