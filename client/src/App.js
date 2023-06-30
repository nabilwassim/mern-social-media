import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
// من اهمية الكود اللي بكتبه ف الجي اس كونفيج دوت جيسون انه بيسهلي الامبورت 
// يعني شوفت عملت امبورت مباشرة من السينز 
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";

function App() {
  // that wil help us grab mode value from index in state (redux)
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  // عشان لو مش مسجل يوديه لصفحة التسجيل
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {/* cssbaseline = css reset */}
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/home"
                // عشان لو مش مسجل يوديه لصفحة التسجيل
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              path="/profile/:userId"
                // عشان لو مش مسجل يوديه لصفحة التسجيل
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
