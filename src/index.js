import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import * as Color from '@mui/material/colors';
import React from "react";
import MainLayout from "./layouts/MainLayout";
import MainHome from "./views/MainHome";
import VerificationScreen from "./views/Authorization/VerificationScreen";
import theme from "./theme";
import Settings from "./views/Settings/Settings";
import Profile from "./views/Profile/Profile";
import FirebaseNotifications from "./firebase/firebase-notifications";
import TermsOfService from "./views/MainFooter/TermsOfService";
import PrivacyPolicy from "./views/MainFooter/PrivacyPolicy";
import FAQ from "./views/MainFooter/FAQ";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<MainHome />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile/:username" element={<Profile />} />
          <Route path="terms-of-service" element={<TermsOfService />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="faq" element={<FAQ />} />
        </Route>
        <Route path="/verification" element={<VerificationScreen />}>
          <Route index element={<VerificationScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const themeTemplate = responsiveFontSizes((createTheme(theme)));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={themeTemplate}>
      <CssBaseline />
      <Router />
      <FirebaseNotifications />
  </ThemeProvider>
);

// let name = 'AllSquads'
// let version = '1.0.1'
// console.log(`${name} v${version} 😎`)
// const last_version = localStorage.getItem(`${name}-Version`)
// if(last_version !== version){
//     console.log('New Version Available ! 😝')
//     localStorage.setItem(`${name}-Version`, version)
//     window.location.reload(true);
// }