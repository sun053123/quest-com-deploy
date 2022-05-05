import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NoPage from "./pages/NoPage";
import Classroom from "./pages/Classroom";

import LoadingPage from "./components/LoadingPage";
import Navbar from "./components/Navbar";
import AlertToast from "./components/AlertToast";
import ProtectRoute from "./utils/ProtectRoute";
import AuthRoute from "./utils/AuthRoute";
import TeacherRoute from "./utils/TeacherRoute";
import QuizCreate from "./pages/QuizCreate";
import ClassroomCreate from "./pages/ClassroomCreate";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AlertToast />
      <Routes>
        
        {/* TOKEN ROUTE PROTECT */}
        <Route element={<ProtectRoute />} >
          <Route path="/login" element={ <Login />} />
          <Route path="/register" element={<Register />} />
        </ Route>

        {/* PUBLIC ROUTE */}
        <Route path="/" exact element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/loading" element={<LoadingPage />} />
        {/* BasicAuth Route />} /> */}
        <Route element={<AuthRoute />} >
          <Route path="/classroom/:id" element={<Classroom />} />
        </Route>
        {/* TeacherAuthRoute /> */}
        <Route element={<TeacherRoute />} >
          <Route path="/createclassroom" element={<ClassroomCreate />} />
          <Route path="/createquiz" element={<QuizCreate />} />
        </Route>
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
