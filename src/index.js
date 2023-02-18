import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import * as Color from '@mui/material/colors';
import React from "react";
import MainLayout from "./layouts/MainLayout";
import MainHome from "./views/MainHome";
import VerificationScreen from "./views/Authorization/VerificationScreen";
import theme from "./theme";
import Settings from "./views/settings/Settings";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<MainHome />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/verification" element={<VerificationScreen />}>
          <Route index element={<VerificationScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const themeTemplate = createTheme(theme);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={themeTemplate}>
      <CssBaseline />
      <Router />
  </ThemeProvider>
);