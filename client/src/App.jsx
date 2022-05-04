import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NoPage from "./pages/NoPage";

import LoadingPage from "./components/LoadingPage";
import Navbar from "./components/Navbar";
import AlertToast from "./components/AlertToast";
import ProtectRoute from "./utils/ProtectRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AlertToast />
      <Routes>
        <Route path="/login" element={<ProtectRoute> <Login /> </ProtectRoute>} />
        <Route path="/register" element={<Register />} />

        <Route path="/" exact element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
