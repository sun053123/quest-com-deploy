import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import QuizGameResult from "./pages/QuizGameResult";
import Profile from "./pages/Profile";

import { Worker } from '@react-pdf-viewer/core';
import ErrorPage from "./components/ErrorPage";
import Dashboard from "./pages/Dashboard";


// const Home = React.lazy(() => import("./pages/Home"));
// const Lesson = React.lazy(() => import("./pages/Lesson"));
// const Classroom = React.lazy(() => import("./pages/Classroom"));
function useScrollToTop() {
  const { pathname } = useLocation();
  // set always scroll to top when route changes
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}

function App() {
  useScrollToTop()
  return (
    <>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.13.216/build/pdf.worker.min.js">
      <AlertToast />
      <Routes>
        {/* TOKEN ROUTE PROTECT */}
        <Route element={<ProtectRoute />} >
          <Route path="/login" element={ <Login />} />
          <Route path="/register" element={<Register />} />
        </ Route>

        {/* PUBLIC ROUTE */}
        <Route path="/" element={<Navbar />} >
          <Route path="/" exact element={<Navigate to="/home" />} />
          {/* <Route path="/home" element={<React.Suspense fallback={<LoadingPage />}> <Home /> </React.Suspense>} /> */}
          <Route path="/home" element={<Home />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="*" element={<NoPage />} />
          <Route path="/error" element={<ErrorPage />} />

          {/* BasicAuth Route />} /> */}
          <Route element={<AuthRoute />} >
            <Route path="/profile" element={<Profile />} />
            <Route path="/classroom/:classroomId" element={<Classroom />} />
            <Route path="/classroom/:classroomId/lesson/:lessonId" element={<Lesson />} />
            <Route path="/classroom/:classroomId/lesson/:lessonId/quizgame" element={<QuizGame />} />
            <Route path="/classroom/:classroomId/lesson/:lessonId/quizgame/result" element={<QuizGameResult />} />
          </Route>

          {/* TeacherAuthRoute /> */}
          <Route element={<TeacherRoute />} >
            <Route path="/classroom/create" element={<ClassroomCreate />} />
            <Route path="/classroom/edit/:classroomId" element={<ClassroomCreate />} />
            <Route path="/classroom/:classroomId/dashboard" element={<Dashboard />} />
            <Route path="/classroom/:classroomId/lesson/create" element={<LessonCreate />} />
            <Route path="/classroom/:classroomId/lesson/edit/:lessonId" element={<LessonCreate />} />
            <Route path="/classroom/:classroomId/lesson/:lessonId/quizcontroller" element={<QuizCreate />} />
          </Route>
        </Route>
      </Routes>
      </Worker>
    </>
  );
}

export default App;
