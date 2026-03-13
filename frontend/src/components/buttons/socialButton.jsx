import React from "react";

import { Box } from "@mui/material";

const socialButton = (props) => {
  const { Logo } = props;
  return (
    <Box
      sx={{
        width: "5rem",
        height: "3.5rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "8px",
        cursor: "pointer",
        color: "text.primary",
        border: 1,
      }}
    >
      <Logo sx={{ typography: "h4" }} />
    </Box>
  );
};

export default socialButton;
