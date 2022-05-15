import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query';
import DOMPurify from 'dompurify';

import { Viewer, ProgressBar } from '@react-pdf-viewer/core';


import { Box, Button, Grid, Typography, CssBaseline } from '@mui/material';

import { AuthContext } from '../store/Contexts/AuthContext'
import { AlertContext } from '../store/Contexts/AlertContext';
import { AlertShow } from "../store/Actions/AlertAction";

import LessonBody from '../components/Lesson/LessonBody'
import LessonComment from '../components/Lesson/LessonComment';
import LessonQuizModal from '../components/Lesson/LessonQuizModal';
import axios from 'axios';
import ClassroomSidebar from '../components/Classroom/ClassroomSidebar';
import LoadingPage from '../components/LoadingPage';
import ErrorPage from '../components/ErrorPage';
import { ToastContainer } from 'react-toastify';

function Lesson() {
  const { AlertDispatch } = useContext(AuthContext)
  const { userinfo } = useContext(AuthContext)
  const { classroomId, lessonId } = useParams()

  const [lesson, setLesson] = useState({})
  const [lessons, setLessons] = useState([])

  const [quizModalopen, setQuizModalopen] = useState(false);
  const handleQuizOpen = () => setQuizModalopen(true);
  const handleQuizClose = () => setQuizModalopen(false);


  const {
    isLoading: isLoadingLesson,
    isError: isErrorLesson,
    isSuccess: isSuccessLesson,
    error: errorLesson,
  } = useQuery(
    ["lesson", classroomId, lessonId],
    () => axios.get(`http://localhost:8000/api/classroom/${classroomId}/lesson/${lessonId}`),
    {
      retry: false,
      enabled: true,
      refetchOnWindowFocus: false,
      //retechOnmount is important to avoid empty render when navigating from another page (always true)
      refetchOnMount: true,
      onSuccess: (data) => {
        setLesson(data.data.data.lesson)
        setLessons(data.data.data.lessons)
      },
      onError: (err) => {
        AlertDispatch(AlertShow(err.data.error, "error"))
    }
  }

  );

  if (isLoadingLesson) {
    return <LoadingPage />
  }

  if (isErrorLesson) {
    AlertDispatch(AlertShow(errorLesson))
    return <ErrorPage />
  }

  if (isSuccessLesson) {

  return (
    <>
    <CssBaseline />
    <ToastContainer />
      {/* ////////////////////////////// LESSON MODAL SKIP QUIZGAME ////////////////////////////// */}
      <LessonQuizModal quizModalopen={quizModalopen} handleQuizClose={handleQuizClose} />
      <Grid container spacing={0} >
        <Grid item xs={2} sx={{ backgroundColor: "#f7f9fc", }}>
          <ClassroomSidebar lessons={lessons} currentLessonID={lesson._id} handleQuizOpen={handleQuizOpen} />
        </Grid>
        <Grid item xs={10} sx={{ backgroundColor: "blue", }}>
          <LessonBody lesson={lesson} />
        </Grid>
      </Grid>
    </>
  )
  }
}

export default Lesson