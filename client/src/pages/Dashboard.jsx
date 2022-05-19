import React, {useState, useEffect, useContext} from 'react'

import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useQuery } from 'react-query'
import LoadingPage from '../components/LoadingPage'

import { AlertContext } from '../store/Contexts/AlertContext'
import { AlertShow } from '../store/Actions/AlertAction'

import { Box, Button, Container, Divider, Grid, Paper, Typography } from '@mui/material'
import StudentCountCard from '../components/Dasboard/StudentCountCard'
import {ToastContainer} from 'react-toastify'
import AlertToast from '../components/AlertToast'
import LessonScore from '../components/Dasboard/LessonScore'
import JoinTodayClass from '../components/Dasboard/JoinTodayClass'
import LessonCount from '../components/Dasboard/LessonCount'
import StudentsTable from '../components/Dasboard/StudentsTable'
import DashboardPathbar from '../components/Dasboard/DashboardPathbar'

function Dashboard() {
  const { classroomId } = useParams()
  const { AlertDispatch } = useContext(AlertContext)
  const [dashboardData, setDashboardData] = useState({})
  const [lessonDashboardData, setLessonDashboardData] = useState({})

  //react query axios fetch dashboard data
  const { isLoading, isSuccess, isError } = useQuery(['dashboard', classroomId], async () => {
    const res = await axios.get(`http://localhost:8000/api/classroom/${classroomId}/dashboard`)
    return res.data
  }
  , {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: false,
    retryError: (err) => {
      console.log(err)
    },
    onSuccess: (data) => {
      setDashboardData(data.dashboard)
      sortByLesson(data.dashboard.studentCompleteQuiz)
    },
    onError: (err) => {
      AlertDispatch(AlertShow(err.response.data.error, 'error'))
    }
  });

  const sortByLesson = (studentCompleteQuiz) => {

    // split studentCompleteQuiz to array by lesson._id
    const lessonArray = []
    studentCompleteQuiz.forEach(item => {
      if (!lessonArray.includes(item.lesson._id)) {
        lessonArray.push(item.lesson._id)
      }
    })

    // sort studentCompleteQuiz by lesson._id
    const lessonDashboardData = {}
    lessonArray.forEach(item => {
      const lesson = studentCompleteQuiz.filter(student => student.lesson._id === item)
      //push index with lesson._id to lessonDashboardData
      lessonDashboardData[item] = lesson

    })

    setLessonDashboardData(lessonDashboardData)
  }

  if (isLoading) {
    return <LoadingPage />
  }

  if(isError){
    return <div>Error</div>
  }

  if (isSuccess && dashboardData) {
    console.log(dashboardData)
    console.log(lessonDashboardData)

  return (
    <>
      <AlertToast />
      <Box sx={{ width: '100%', height: '100%' }}>
              <DashboardPathbar classroomStatus={dashboardData?.classroom?.isComplete} />
          <Box sx={{ backgroundColor: '#fafafa' }}>
            <Box sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '1.5rem',
              fontWeight: 'bold',
            }}>
              <Typography variant="h3" fontWeight={'bold'} sx={{ marginTop: '3.5rem', marginBottom:"2rem", 
              color:`${dashboardData.classroom?.category}` }}>
                {dashboardData.classroom?.title}
              </Typography>
            </Box>
              <Container maxWidth="lg">
                  <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <StudentCountCard studentCount={dashboardData.classroom?.studentCount} />
                      </Grid>
                      <Grid item xs={4}>
                        <JoinTodayClass studentsCheckin={dashboardData?.studentsCheckin} />
                      </Grid>
                      <Grid item xs={4}>
                        <LessonCount lessonCount={dashboardData.classroom?.lessonCount} />
                      </Grid>
                  </Grid>

                  <Typography variant="h4" fontWeight={'bold'} sx={{ marginTop: '3.5rem', marginBottom:"2rem",
                  color:'text' }}>
                    All students in this classroom
                  </Typography>
                  <StudentsTable studentsCheckin={dashboardData?.studentsCheckin} />

                  <Typography variant="h4" fontWeight={'bold'} sx={{ marginTop: '3.5rem', marginBottom:"2rem",
                  color:'text' }}>
                    Lesson Score
                  </Typography>
                  {
                    Object.keys(lessonDashboardData).map((key, index) => {
                      return (
                        <>
                        <Paper key={key} sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          //columns
                          flexDirection: 'column',
                          borderRadius: 2,
                          marginBottom: '2rem',
                          marginTop: '2rem',
                        }}>
                         
                            <Typography variant="h5" fontWeight={'bold'} sx={{ marginTop: '3.5rem', marginBottom:"2rem",
                            color: `${dashboardData.classroom?.category}` }}>
                              Lesson : {lessonDashboardData[key][0].lesson.title}
                            </Typography>                            
                            <LessonScore lessonScore={lessonDashboardData[key]} />
                        </Paper>
                        <Divider />
                        </>
                      )
                    }
                    )
                  }
                    
                  {/* <LessonScore lessonScore={lessonDashboardData} /> */}
              </Container>
            </Box>
      </Box>
    </>
    )
  }
}

export default Dashboard