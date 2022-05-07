import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import LessonCreate from "./pages/LessonCreate";
import Lesson from "./pages/Lesson";
import QuizGame from "./pages/QuizGame";
import QuizGameResult from "./pages/QuizGame";
import Profile from "./pages/Profile";

import { Worker } from '@react-pdf-viewer/core';


// const Home = React.lazy(() => import("./pages/Home"));
// const Lesson = React.lazy(() => import("./pages/Lesson"));
// const Classroom = React.lazy(() => import("./pages/Classroom"));


function App() {
  return (
    <>
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.13.216/build/pdf.worker.min.js">
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
        <Route path="*" element={<NoPage />} />

        {/* BasicAuth Route />} /> */}
        <Route element={<AuthRoute />} >
          <Route path="/profile" element={<Profile />} />
          <Route path="/classroom/:classroomId" element={<Classroom />} />
          <Route path="/classroom/:classroomId/lesson/:lessonId" element={<Lesson />} />
          <Route path="/classroom/:classroomId/lesson/:lessonId/quizgame" element={<QuizGame />} />
          <Route path="/classroom/:classroomId/lesson/:lessonId/quizgameresult" element={<QuizGameResult />} />
        </Route>

        {/* TeacherAuthRoute /> */}
        <Route element={<TeacherRoute />} >
          <Route path="/classroom/create" element={<ClassroomCreate />} />
          <Route path="/classroom/edit/:classroomId" element={<ClassroomCreate />} />
          <Route path="/classroom/:classroomId/lesson/create" element={<LessonCreate />} />
          <Route path="/classroom/:classroomId/lesson/:lessonId/createquiz" element={<QuizCreate />} />
        </Route>
      </Routes>
      </Worker>
    </>
  );
}

export default App;
