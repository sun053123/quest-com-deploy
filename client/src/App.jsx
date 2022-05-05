import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NoPage from "./pages/NoPage";
import Classroom from "./pages/Classroom";
import Blog from "./pages/Blog";

import LoadingPage from "./components/LoadingPage";
import Navbar from "./components/Navbar";
import AlertToast from "./components/AlertToast";
import ProtectRoute from "./utils/ProtectRoute";
import AuthRoute from "./utils/AuthRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AlertToast />
      <Routes>
        <Route element={<ProtectRoute />} >
          <Route path="/login" element={ <Login />} />
          <Route path="/register" element={<Register />} />
        </ Route>
        <Route path="/" exact element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/loading" element={<LoadingPage />} />
        {/* <Route path="/blog" element={<Blog />} /> */}
        <Route element={<AuthRoute />} >
          <Route path="/classroom" element={<Classroom />} />
        </Route>
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
