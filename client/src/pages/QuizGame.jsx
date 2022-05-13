import React, {useContext, useEffect, useState} from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import moment from 'moment';

import { AuthContext } from '../store/Contexts/AuthContext';
import  useStateQuizContext  from '../store/Contexts/QuizContext';
import LoadingPage from '../components/LoadingPage';
import { Button, Box, Card, CardHeader, Typography, CardActions, CardContent } from '@mui/material';

function QuizGame() {

  const { userinfo } = useContext(AuthContext);
  const { quizcontext, setQuizContext } = useStateQuizContext();

  const { classroomId, lessonId } = useParams();

  const [gamequiz, setGamequiz] = useState([]);

  const [timeTaken, setTimeTaken] = useState(0);

  let timer;

  const startTimer = () => {
    timer = setInterval(() => {
      setTimeTaken(prev => prev + 1);
    }, [1000]);
  }

  const {
    isLoading,
    isError,
    isSuccess,
    data
  } = useQuery(
    "quizgame",
    () => axios.get(`http://localhost:8000/api/classroom/${classroomId}/lesson/${lessonId}/quizgame`),
    {
      retry: false,
      refetchOnWindowFocus: false,
      //retechOnmount is important to avoid empty render when navigating from another page (always true)
      refetchOnMount: true,
      //on guest mode, no need to query scores
      enabled: userinfo ? true : false,
      onSuccess: (data) => {
        // console.log(data);
        setGamequiz(data.data.data);

        startTimer();
        setQuizContext({attempts: ++quizcontext.attempts});
      },
    }
  );


  if (isLoading) {
    return <LoadingPage />
  }

  // useEffect(() => {
  //   if(userinfo){
  //     getQuiz()
  //   }
  // }, [])

  // const getQuiz = () => {
  //   axios.get(`http://localhost:8000/api/classroom/${classroomId}/lesson/${lessonId}/quizgame`)
  //   .then(res => {
  //     console.log(res.data)
  //     setGamequiz(res.data)
  //   }
  //   )
  //   .catch(err => {
  //     console.log(err)
  //   }
  //   )
  // }


  //click increase to +1 to quiz.attempts context
  const increaseAttempts = () => {
    setQuizContext({attempts: quizcontext.attempts + 1})
  }

  const clearContext = () => {
    setQuizContext({attempts: 0, timeTaken: 0})
  }
  if(isSuccess){

    console.log(gamequiz)

  return (
    <Box >
      <h1>
        Quiz Game
      </h1>
      <Card sx={{
        maxWidth: "640px",
        margin: "auto",
        padding: "1rem",
        backgroundColor: "wheat",
        '& .MuiCardHeader-action': { margin: "0" , alignSelf: "center"},
      }}>
        <CardHeader
          title={'Quiz Game' + ' - ' + 0 + ' / ' + gamequiz.length + ' questions'}
          subheader={'Attempts: ' + quizcontext.attempts + ' - Time Taken: ' + timeTaken + ' seconds'}
          action={
            <Button onClick={increaseAttempts}>
              Increase Attempts
            </Button>
          }
        />
        <CardContent>
          <Typography variant="h6" component="h6">
            {gamequiz.quizDescription}
          </Typography>
        </CardContent>
        <CardActions>
          <Button onClick={clearContext}>
            Clear Context
          </Button>
        </CardActions>
      </Card>     
    </Box>
  )
}
}

export default QuizGame

{/* <Button onClick={increaseAttempts}>
Increase attempts
</Button>
<Button onClick={clearContext}>
Clear context
</Button> */}