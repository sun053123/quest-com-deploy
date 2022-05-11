import React, {useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query';
import DOMPurify from 'dompurify';

import { Viewer, ProgressBar } from '@react-pdf-viewer/core';

import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import { Box,Button,Container,Grid, Typography } from '@mui/material';

import { AuthContext } from '../store/Contexts/AuthContext'
import { AlertContext } from '../store/Contexts/AlertContext';
import { AlertShow } from "../store/Actions/AlertAction";

import LessonBody from '../components/Lesson/LessonBody'
import LessonRightSide from '../components/Lesson/LessonRightSide';
import LessonMenu from '../components/Lesson/LessonComment';
import axios from 'axios';
import ClassroomSidebar from '../components/Classroom/ClassroomSidebar';
import LoadingPage from '../components/LoadingPage';
import ErrorPage from '../components/ErrorPage';

function Lesson() {
  const { AlertContext, AlertDispatch } = useContext(AuthContext)
  let navigate = useNavigate()
  const { userinfo } = useContext(AuthContext)
  const { classroomId, lessonId } = useParams()
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const [lesson, setLesson] = useState({})
  const [lessons, setLessons] = useState([])

  const {
    isLoading: isLoadingLesson,
    isError: isErrorLesson,
    isSuccess: isSuccessLesson,
    error: errorLesson,
  } = useQuery(
    ["lesson", classroomId, lessonId],
    async() => await axios.get("http://localhost:8000/api/classroom/" + classroomId + "/lesson/" + lessonId),
    {
      retry: false,
      enabled: true,
      refetchOnWindowFocus: false,
      //retechOnmount is important to avoid empty render when navigating from another page (always true)
      refetchOnMount: true,
      onSuccess: (data) => {
        setLesson(data.data.data.lesson)
        setLessons(data.data.data.lessons)
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
     
  

  return (
    <>
    <Grid container spacing={0} >        
      <Grid item xs={2} sx={{ backgroundColor: "#f7f9fc",}}>
          <ClassroomSidebar lessons={lessons} currentLessonID={lesson._id} />
      </Grid>
      <Grid item xs={10} sx={{ backgroundColor: "blue", }}>
          <LessonBody lesson={lesson} />
      </Grid>
      </Grid>
    </>
  )
}

export default Lesson