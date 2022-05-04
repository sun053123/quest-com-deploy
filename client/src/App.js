import React from "react";
import { BrowserRouter , Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LoadingPage from "./components/LoadingPage";
import Navbar from "./components/Navbar";
import NoPage from "./pages/NoPage";

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="*" element={<NoPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/loading" element={<LoadingPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
