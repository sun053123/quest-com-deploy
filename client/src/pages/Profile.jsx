import React, { useEffect, useState, useContext} from 'react'
import { useQuery } from 'react-query';
import axios from 'axios';

import { AuthContext } from '../store/Contexts/AuthContext' 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Grid, Typography, Link, Box, Avatar, Button, Paper, TextField } from '@mui/material'
import ProfilePathbar from '../components/Profile/ProfilePathbar'
import LoadingPage from '../components/LoadingPage';
import ErrorPage from '../components/ErrorPage';
import UserScore from '../components/Home/UserScore';
import FavoriteClassroom from '../components/Profile/FavoriteClassroom';
import QuizHistory from '../components/Profile/QuizHistory';
import OwnClassroom from '../components/Profile/OwnClassroom';

function Profile() {

  const { userinfo } = useContext(AuthContext);
  const [userscores, setUserscores] = useState();
  const [userprofile, setUserprofile] = useState();
  const [favoriteClassroom, setFavoriteClassroom] = useState();
  const [quizhistory, setQuizhistory] = useState();
  const [ownClassroom, setOwnClassroom] = useState();

  const { isLoading: isLoadingScore,  isError: isErrorScore, isSuccess: isSuccessScore } = useQuery("score",
    async() => await axios.get("http://localhost:8000/api/user/scores"),
    {
      retry: false,
      refetchOnWindowFocus: false,
      //retechOnmount is important to avoid empty render when navigating from another page (always true)
      refetchOnMount: true,
      //on guest mode, no need to query scores
      enabled: userinfo?.role === false ? true : false,
      onSuccess: (data) => {
        setUserscores(data.data.scores);
      },
    }
  );

  const { isLoading: isLoadingProfile,  isError: isErrorProfile, isSuccess: isSuccessProfile } = useQuery("profile",
    async() => await axios.get("http://localhost:8000/api/profile"),
    {
      retry: false,
      refetchOnWindowFocus: false,
      //retechOnmount is important to avoid empty render when navigating from another page (always true)
      refetchOnMount: true,
      //on guest mode, no need to query scores
      enabled: true,
      onSuccess: (data) => {
        setUserprofile(data.data.data);
      }
    }
  );

  const { isLoadingFavorite,  isError: isErrorFavorite, isSuccess: isSuccessFavorite } = useQuery("favorite",
    async() => await axios.get("http://localhost:8000/api/profile/favorite"),
    {
      retry: false,
      refetchOnWindowFocus: false,
      //retechOnmount is important to avoid empty render when navigating from another page (always true)
      refetchOnMount: true,
      //on guest mode, no need to query scores
      enabled: true,
      onSuccess: (data) => {
        setFavoriteClassroom(data.data.favorite);
      }
    }
  );

  const { isLoading: isLoadingQuiz,  isError: isErrorQuiz, isSuccess: isSuccessQuiz } = useQuery("quizhistory",
    async() => await axios.get("http://localhost:8000/api/profile/quizhistory"),
    {
      retry: false,
      refetchOnWindowFocus: false,
      //retechOnmount is important to avoid empty render when navigating from another page (always true)
      refetchOnMount: true,
      //on guest mode, no need to query scores
      enabled: userinfo?.role === false ? true : false,
      onSuccess: (data) => {
        setQuizhistory(data.data.quiz);
        console.log(data.data.quiz);
      }
    }
  );

  const { isLoading: isLoadingOwnClassroom,  isError: isErrorOwnClassroom, isSuccess: isSuccessOwnClassroom } = useQuery("ownclassroom",
    async() => await axios.get("http://localhost:8000/api/profile/ownclassroom"),
    {
      retry: false,
      refetchOnWindowFocus: false,
      //retechOnmount is important to avoid empty render when navigating from another page (always true)
      refetchOnMount: true,
      //on guest mode, no need to query scores
      enabled: userinfo?.role === true ? true : false,
      onSuccess: (data) => {
        setOwnClassroom(data.data.ownclassroom);
      }
    }
  );
        

  if (isLoadingScore || isLoadingProfile || isLoadingFavorite || isLoadingQuiz || isLoadingOwnClassroom) {
    return <LoadingPage />;
  }

  if (isErrorScore || isErrorProfile || isErrorFavorite || isErrorQuiz || isErrorOwnClassroom) {
    return <ErrorPage />;
  }

  if(isSuccessProfile && userprofile ){
    console.log("userprofile", userprofile);
  return (
    <>
    <ToastContainer />
      <ProfilePathbar />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4} md={3} lg={3}>
          <Box display="flex" flexDirection="column" alignItems="center" sx={{
            height: '80vh',
            width: '100%',
            backgroundColor: '#fafafa',
            minHeight: '150vh',
          }}>
            {/* PROFILE CARD */}
            <Paper elevation={3} sx={{
              width: '80%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              m: '1rem',
              padding: '1rem',
            }}>
              <Box mb={2}>
                <Avatar alt="picture" variant='square' src={userprofile.user.avatar} sx={{
                  width: '10rem',
                  height: '10rem',
                }}/>
              </Box>
              <Box mb={0}>
                <Typography variant="h5">
                  {userprofile.user.username}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" color={'gray'}>
                  {userprofile.user.email}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" color={'gray'}>
                  {userprofile.profile.firstname} {userprofile.profile.lastname}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" color={'gray'}>
                  {userprofile.profile.dob}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="h5" color={'gray'}>
                  {userprofile.user.role === true ? 'Teacher' : 'Student'}
                </Typography>
              </Box>
            </Paper>
            {/* SCORE CARD */}
            { userinfo?.role === false && isSuccessScore && userscores && (
            <Paper elevation={3} sx={{
              mt: '1rem',
              width: '80%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}>
              <Box mb={2}>
                <Typography variant="h5">
                  overall EXP :
                </Typography>
                <Typography variant="h4">
                  {parseInt(userprofile.profile.math_score) + parseInt(userprofile.profile.science_score) + parseInt(userprofile.profile.computer_score) + parseInt(userprofile.profile.english_score) + parseInt(userprofile.profile.social_score)}
                </Typography>
                </Box>
                
              </Paper>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} md={9} lg={9}>

          { userinfo?.role === false && isSuccessScore && userscores && (
          <UserScore userscores={userscores} />
          )}

          { favoriteClassroom && favoriteClassroom.length > 0 && (
            <FavoriteClassroom favoriteClassroom={favoriteClassroom} />
          )}

          {userinfo?.role === true && isSuccessOwnClassroom && ownClassroom && (
              <OwnClassroom ownclassrooms={ownClassroom} />
          )}

          

          { userinfo?.role === false && quizhistory && quizhistory.length > 0 && (
            <QuizHistory quizhistory={quizhistory} />
          )}

          
        </Grid>
      </Grid>
    </>
  )
          }      
}

export default Profile