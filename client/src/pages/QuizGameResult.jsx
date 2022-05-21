import React, {useEffect, useState, useContext} from 'react'

import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from 'react-query';
import axios from 'axios';

import { AuthContext } from '../store/Contexts/AuthContext';
import { AlertContext } from '../store/Contexts/AlertContext';
import { AlertShow } from '../store/Actions/AlertAction';
import useStateQuizContext from '../store/Contexts/QuizContext';

import { CssBaseline,Box,Card,Button, Grid, Container, Paper, Typography, Divider } from '@mui/material';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

import quizgame_bg from '../assets/img/quizgame_bg.jpg';
import LoadingPage from '../components/LoadingPage';
import ExpCard from '../components/QuizResult/ExpCard';
import ScoreCard from '../components/QuizResult/ScoreCard';
import AttemptCard from '../components/QuizResult/AttemptCard';
import TimeCard from '../components/QuizResult/TimeCard';
import IsSubmitCard from '../components/QuizResult/IsSubmitCard';
import HighScoreTable from '../components/QuizResult/HighScoreTable';
import AnswerCard from '../components/QuizResult/AnswerCard';

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
  const [stdHighScore, setStdHighScore] = useState([]);

  useEffect(() => {

    //if already clear the quizcontext but user refresh the page then redirect to lesson page
    if(quizcontext.currentQuizGame === null) {
      navigate(`/classroom/${classroomId}/lesson/${lessonId}`);
    }
    
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
    let tempSocre = questionSelectedAnswer.reduce((acc, curr) => {
      return curr.answer === curr.selected ? acc + 1 : acc;
    }, 0);

    //add isCorrect to questionSelectedAnswer if it is correct
    questionSelectedAnswer.forEach(question => {
      if (question.answer === question.selected) {
        question.isCorrect = true;
      } else {
        question.isCorrect = false;
      }
    });

    // //check is correct count and make score
    // let tempSocre = questionSelectedAnswer.reduce((acc, curr) => {
    //   return curr.isCorrect === true ? acc + 1 : acc;
    // }, 0);

    setScore(tempSocre);
    console.log("correct = ",tempSocre);
    console.log(questionSelectedAnswer)
    calculateScore(tempSocre, questionSelectedAnswer)
  }

  const calculateScore = async (tempSocre, questionSelectedAnswer) => {
    
    let tempExp = 0;
    let attempts = quizcontext.attempts;

    if (attempts > 6) {
      attempts = 6; //manimum ceil for is greater than 50%
    }

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
      setIsSubmitedScore(true);
      setStdHighScore(res.data.data.highScore);
      toast.success("Score Submitted")
    })
    .catch(err => {
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

  const { error, isLoading, isError, isSuccess, mutate } = useMutation(
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
        }))
        // console.log("questionSelectedAnswer", questionSelectedAnswer)
        setQuizAnswer(questionSelectedAnswer)
        calculateCorrect(questionSelectedAnswer)
        setTimeTaken(quizcontext.timeTaken)
        setStdHighScore(data.data.data.highScore)
        console.log("highscore = ",data.data.data.highScore)
        // ถ้าเคยทำแล้ว ก็มาเล่นได้ปกติแล้ว ไม่ต้องนับ attempts เลย
         // return quizanswer and isSubmitedScore
         if(data.data.data.isSummited === true){
          setQuizContext({
            ...quizcontext,
            attempts: 0,
            currentQuizGame: null,
          })
          //clear quiz context currentQuizGame
          setIsSubmitedScore(true);
        }
      },
    }
  );

  // console.log(score)
  if(isLoading){
    return <LoadingPage />
  }

  if(isError){
    AlertDispatch(AlertShow(error.response.data.error, "danger"))
    return navigate("/loading");
  }

   if(isSuccess){
  return (
    <>
    <CssBaseline />
    <ToastContainer />
    <Box sx={{
      // width: "100%",
      height: "90vh",
      display: "flex",
      // flexDirection: "column",
      // alignItems: "center",
      // justifyContent: "center",
      backgroundColor: "#fafafa",
      backgroundImage: `url(${quizgame_bg})`,
      padding: "2rem",
      minHeight: "130vh",
    }}>
      <Container>
        <Paper elevation={3}>
          <Box sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.5)",
          }}>
            <Grid container spacing={3} justify="center" >
              <Grid item xs={4} sm={4} sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {/* set 2 button , retry and back to lesson */}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => 
                    navigate(`/classroom/${classroomId}/lesson/${lessonId}`)
                  }
                  sx={{
                    padding: "1rem",
                    height: "50px",
                    width: "120px",
                  }}
                >
                  Back to Lesson
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    navigate(`/classroom/${classroomId}/lesson/${lessonId}/quizgame`)
                  }
                  sx={{
                    height: "50px",
                    width: "120px",
                    ml: "2rem",
                  }}
                >
                  Retry
                </Button>
              </Grid>
              <Grid item xs={4} sm={4} sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
            <Typography variant="h4" component="h1" gutterBottom mt={4} fontWeight="bold">
              Quiz Summary
            </Typography>
            <AppRegistrationIcon fontSize="large" />
            </Grid>
            <Grid item xs={4} sm={4}sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Button
                  variant="contained"
                  onClick={handleSubmitScore}
                  sx={{
                    height: "50px",
                    width: "160 px",
                    marginLeft: "2rem",
                    backgroundColor: "#00bfa5",
                    color: "white",
                  }}
                  disabled={isSubmitedScore}
                >
                  {isSubmitedScore ? "Submitted" : "Submit Score"}
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={3} justify="center" padding={2}>
              <Grid item xs={12} sm={4}>
                <AttemptCard attempts={quizcontext.attempts+1} isSubmitted={isSubmitedScore} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TimeCard TimeTaken={timeTaken} quizLength={quizAnswer.length}  />
              </Grid>
              <Grid item xs={12} sm={4}>
                <IsSubmitCard isSubmitted={isSubmitedScore} />
              </Grid>
            </Grid>
            <Grid container spacing={3} justify="center" padding={2}>
            <Grid item sm={2} />
            
              <Grid item xs={12} sm={4}>
                <ExpCard expgain={expgain} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <ScoreCard score={score} quizLength={quizAnswer.length} />
              </Grid>
              <Grid item sm={2} />
            </Grid>

            <Grid container spacing={3} justify="center" padding={2}>
              <Grid item xs={12} sm={12}>
                <Typography variant="h5" component="h2" gutterBottom mt={4} fontWeight="bold">
                  Higest Score
                </Typography>
                <HighScoreTable highScore={stdHighScore} />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography variant="h5" component="h2" gutterBottom mt={4} fontWeight="bold">
                  Quiz Answer
                </Typography>

                { isSubmitedScore && (
                <AnswerCard quizAnswer={quizAnswer} />
                )}
                </Grid>
            </Grid>

          </Box>
        </Paper>
      </Container>
    </Box>
    </>
    )
  }
}

export default QuizGameResult