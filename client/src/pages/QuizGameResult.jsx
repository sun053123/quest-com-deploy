import React, {useEffect, useState, useContext} from 'react'

import useStateQuizContext from '../store/Contexts/QuizContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from 'react-query';
import axios from 'axios';

import { AuthContext } from '../store/Contexts/AuthContext';
import { AlertContext } from '../store/Contexts/AlertContext';
import { AlertShow } from '../store/Actions/AlertAction';
import { CssBaseline,Box,Card,Button, Grid } from '@mui/material';

import quizgame_bg from '../assets/img/quizgame_bg.jpg';

function QuizGameResult() {

  const { classroomId, lessonId } = useParams();
  const navigate = useNavigate();
  const { userinfo } = useContext(AuthContext);
  const { AlertDispatch } = useContext(AlertContext);
  const { quizcontext, setQuizContext } = useStateQuizContext();

  const [quizAnswer, setQuizAnswer] = useState([]);
  const [score, setScore] = useState(0);

  const calculateScore = async (questionSelectedAnswer) => {
    //loop check selected === answer and add to score
    // let score = 0;
    // questionSelectedAnswer.forEach((question) => {
    //   if (question.selected === question.answer) {
    //     score += 1;
    //   }}
    // );
    // setScore(score);
    // return score;
    
    let tempSocre = questionSelectedAnswer.reduce((acc, curr) => {
      return curr.answer === curr.selected ? acc + 1 : acc;
    }, 0);
    setScore(tempSocre);
  }

  useEffect(() => {
    if(quizcontext.selectedOptions.length === 0){
      navigate(`/classroom/${classroomId}/lesson/${lessonId}/quizgame`)
    }else{
      const selectedArray = quizcontext.selectedOptions.map(option => option.gamequizId)
      const quizIdSelected = {
        quizIdSelected: selectedArray,
      }
      mutate(quizIdSelected)
      // console.log("data", quizIdSelected)
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  , [])

  const { isLoading, isError, isSuccess, mutate } = useMutation(
    async (packSelected) => {
      return await axios.post(`http://localhost:8000/api/classroom/${classroomId}/lesson/${lessonId}/quizgame/result`, packSelected )
    }
    , {
      onSuccess: (data) => {
        // console.log(data.data.data)

        // join user answer and quiz answer
        const questionSelectedAnswer = quizcontext.selectedOptions.map(option => ({
            ...option,
            ...(data.data.data.find(answer => answer.answer === option.selected))
        }))
        // console.log("questionSelectedAnswer", questionSelectedAnswer)
        setQuizAnswer(questionSelectedAnswer)
        calculateScore(questionSelectedAnswer)
      },
      onError: (err) => {
        AlertDispatch(AlertShow(err.response.data.error, "danger"))
      }
    }
  );


   


  return (
    <>
    <CssBaseline />
    <Box sx={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundImage: `url(${quizgame_bg})`,
    }}>
      <Card sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
        padding: "20px",
        margin: "20px",
        overflow: "auto",
        minHeight: "680px",
      }}>
        {/* make 4 grids square */}
        <Grid container spacing={3}>
          <Grid item xs={6} sx={{backgroundColor:"red"}}>
          </Grid>
          <Grid item xs={6} sx={{backgroundColor:"green"}}>
          </Grid>
          <Grid item xs={6} sx={{backgroundColor:"blue"}}>
          </Grid>
          <Grid item xs={6} sx={{backgroundColor:"wheat"}}>
          </Grid>
        </Grid>
        
      </Card>
    

    </Box>
    </>
  )
}

export default QuizGameResult



{/* <h1>Quiz Game Result</h1>
        <h3>attempts {quizcontext.attempts}</h3>
        <h3>time taken {quizcontext.timeTaken} secs</h3>
        <h2>Score: {score}</h2>
        <h2>Total Question: {quizcontext.selectedOptions.length}</h2>
        <h2>Correct Answer: {quizAnswer.filter(answer => answer.answer === answer.selected).length}</h2>
        <h2>Wrong Answer: {quizAnswer.filter(answer => answer.answer !== answer.selected).length}</h2>
        <h2>Unanswered: {quizAnswer.filter(answer => answer.selected === undefined).length}</h2>
        <h2>
          {quizAnswer.filter(answer => answer.selected === answer.answer).length > 0 ?
            <>
              <h2>Correct Answer:</h2>
              {quizAnswer.filter(answer => answer.selected === answer.answer).map(answer => (
                <p>{answer.question}</p>
              ))}
            </>
            :
            <>
              <h2>Wrong Answer:</h2>
              {quizAnswer.filter(answer => answer.selected !== answer.answer).map(answer => (
                <p>{answer.question}</p>
              ))}
            </>
          }
        </h2>
        <h2>Unanswered:</h2>
        {quizAnswer.filter(answer => answer.selected === undefined).map(answer => (
          <p>{answer.question}</p>
        ))}
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            navigate(`/classroom/${classroomId}/lesson/${lessonId}/quizgame`)
          }
          }
        >
          Back
        </Button> */}