import React from "react";
import ReactDOM from "react-dom/client";
import { StyledEngineProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <SnackbarProvider
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        maxSnack={5}
      >
        <App />
      </SnackbarProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);
