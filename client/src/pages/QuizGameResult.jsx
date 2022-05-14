import React, {useEffect, useState, useContext} from 'react'

import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from 'react-query';
import axios from 'axios';

import { AuthContext } from '../store/Contexts/AuthContext';
import { AlertContext } from '../store/Contexts/AlertContext';
import { AlertShow } from '../store/Actions/AlertAction';
import useStateQuizContext from '../store/Contexts/QuizContext';

import { CssBaseline,Box,Card,Button, Grid } from '@mui/material';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import quizgame_bg from '../assets/img/quizgame_bg.jpg';
import LoadingPage from '../components/LoadingPage';

const BASE_SCORE_PER_LESSON = 50

function QuizGameResult() {

  const { classroomId, lessonId } = useParams();
  const navigate = useNavigate();
  const { userinfo } = useContext(AuthContext);
  const { AlertDispatch } = useContext(AlertContext);
  const { quizcontext, setQuizContext } = useStateQuizContext();

  const [quizAnswer, setQuizAnswer] = useState([]);
  const [score, setScore] = useState(0);
  const [expgain, setExpgain] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [isSubmitedScore, setIsSubmitedScore] = useState(false);

  useEffect(() => {
    
      const selectedArray = quizcontext.selectedOptions.map(option => option.gamequizId)
      const quizIdSelected = {
        quizIdSelected: selectedArray,
      }
      mutate(quizIdSelected)
      // console.log("data", quizIdSelected)
    
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  , [])

  const calculateCorrect = async (questionSelectedAnswer) => {
    // let tempSocre = questionSelectedAnswer.reduce((acc, curr) => {
    //   return curr.answer === curr.selected ? acc + 1 : acc;
    // }, 0);

    //check is correct count and make score
    let tempSocre = questionSelectedAnswer.reduce((acc, curr) => {
      return curr.isCorrect === true ? acc + 1 : acc;
    }, 0);
    setScore(tempSocre);
    console.log("correct = ",tempSocre);
    console.log(questionSelectedAnswer)
    calculateScore(tempSocre, questionSelectedAnswer)
  }

  const calculateScore = async (tempSocre, questionSelectedAnswer) => {
    
    let tempExp = 0;
    const attempts = quizcontext.attempts;

    //calculate ceiling exp
    let ceilingExp = ((attempts -1) / 10) * 50;

    console.log("maxceil = ",parseInt(ceilingExp))
    if(ceilingExp < 0){
      ceilingExp = 0;
    }

    tempExp = ((tempSocre / questionSelectedAnswer.length) * (BASE_SCORE_PER_LESSON - parseInt(ceilingExp)))
    if(tempExp < 0){
      tempExp = 0;
    }
    setExpgain(Math.ceil(tempExp));
    console.log("final exp = ",Math.ceil(tempExp))
  }

  const handleSubmitScore = () => {
    //clear quizcontext
    
    //axios call to submit score
    axios.put(`http://localhost:8000/api/classroom/${classroomId}/lesson/${lessonId}/quizgame/result`, {
      score: score,
      expgain: expgain,
      result: quizAnswer,
      timeTaken: quizcontext.timeTaken,
      attempts: quizcontext.attempts,
  }
    ).then(res => {
      console.log("res = ",res)
      setIsSubmitedScore(true);
      toast.success("Score Submitted")
    })
    .catch(err => {
      console.log("err = ",err)
      AlertDispatch(AlertShow(err.response.data.error, "error"))
    })
    //after submit score, clear quizcontext
    setQuizContext({
      ...quizcontext,
      selectedOptions: [],
      attempts: 0,
      currentQuizGame: null,
      timeTaken: 0,
    })
  }


  const { isLoading, isError, isSuccess, mutate } = useMutation(
    async (packSelected) => {
      return await axios.post(`http://localhost:8000/api/classroom/${classroomId}/lesson/${lessonId}/quizgame/result`, packSelected )
    }
    , {
      onSuccess: (data) => {
        console.log("data = ",data)
       
        // join user answer and quiz answer
        //await for finish calculate score
        const questionSelectedAnswer = quizcontext.selectedOptions.map(option => ({
            ...option,
            //join user answer and quiz answer
            ...(data.data.data.quizAnswer.find(answer => answer._id === option.gamequizId)),
            //add isCorrect
            ...(data.data.data.quizAnswer.find(answer => answer.answer === option.selected) ? {isCorrect: true} : {isCorrect: false})
        }))
        // console.log("questionSelectedAnswer", questionSelectedAnswer)
        setQuizAnswer(questionSelectedAnswer)
        calculateCorrect(questionSelectedAnswer)
        setTimeTaken(quizcontext.timeTaken)
        // ถ้าเคยทำแล้ว ก็มาเล่นได้ปกติแล้ว ไม่ต้องนับ attempts เลย
         // return quizanswer and isSubmitedScore
         if(data.data.data.isSummited === true){
          setQuizContext({
            ...quizcontext,
            selectedOptions: [],
            attempts: 0,
            currentQuizGame: null,
            timeTaken: 0,
          })
          //clear quiz context currentQuizGame
          setIsSubmitedScore(true);
        }
        
      },
      onError: (err) => {
        AlertDispatch(AlertShow(err.response.data.error, "danger"))
      }
    }
  );

  // console.log(score)
  if(isLoading){
    return <LoadingPage />
  }

   if(isSuccess){
  return (
    <>
    <CssBaseline />
    <ToastContainer />
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
          <h3>attempts {quizcontext.attempts}</h3>
        <h3>time taken {timeTaken} secs</h3>
        <h2>Score: {score}</h2>
        <h2>Total Question: {quizAnswer.length}</h2>
        <h2>
          {quizAnswer.filter(answer => answer.selected === answer.answer).length > 0 ?
            <>
              {/* <h2>Correct Answer:</h2>
              {quizAnswer.filter(answer => answer.selected === answer.answer).map(answer => (
                <p>{answer.question}</p>
              ))} */}
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
          </Grid>
          <Grid item xs={6} sx={{backgroundColor:"green"}}>
            <Button variant="contained" color="primary" onClick={handleSubmitScore} disabled={isSubmitedScore}>
              Submit Score
            </Button>
            <Button variant="contained" color="primary" onClick={
  () => navigate(`/classroom/${classroomId}/lesson/${lessonId}/quizgame`)
            } >
              Restart Quiz
              </Button>
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