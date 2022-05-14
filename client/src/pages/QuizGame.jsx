import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";

import { AuthContext } from "../store/Contexts/AuthContext";
import useStateQuizContext from "../store/Contexts/QuizContext";
import LoadingPage from "../components/LoadingPage";
import {
  Button,
  Box,
  Card,
  CardHeader,
  Typography,
  CardActions,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress,
  Avatar,
} from "@mui/material";

import quizgame_bg from "../assets/img/quizgame_bg.jpg";
import ErrorPage from "../components/ErrorPage";

function QuizGame() {
  const { userinfo } = useContext(AuthContext);
  const { quizcontext, setQuizContext } = useStateQuizContext();
  const navigate = useNavigate();
  const location = useLocation();

  const { classroomId, lessonId } = useParams();

  const [gamequiz, setGamequiz] = useState([]);
  const [gamequizIndex, setGamequizIndex] = useState(0);

  const [startTimer, setStartTimer] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);

  let timer;

  //set timer and do not rerender

  useEffect(() => {
    //check if user (student) skip from another lesson //go homepage //this is hard navigate , so we actuall tell user to go to homepage or go to current quizgame before they try to force into :P
    if(userinfo.role === true){
      return;
    }

    if (quizcontext.currentQuizGame === null || quizcontext.currentQuizGame === undefined || quizcontext.currentQuizGame === "") {
      return;
    }

    if (quizcontext.currentQuizGame !== location.pathname) {
        navigate("/home");
    }

    if (typeof window !== "undefined") { //check if window is defined to avoid error
    const interval = setInterval(() => {
      timer = setTimeTaken((prev) => prev + 1);
    }, 1000);
    
    return () => { clearInterval(interval) };
  }}, [startTimer]);

  const setGameQuizAndShffle = (quizzes) => {
    //shuffle quiz options
    const shuffledQuizzes = quizzes.map((quiz) => {
      const shuffledOptions = quiz.options.sort(() => Math.random() - 0.5);
      return { ...quiz, options: shuffledOptions };
    });
    //set gamequiz
    setGamequiz(shuffledQuizzes);
  }

  const { isLoading, isError, isSuccess, data } = useQuery(
    "quizgame",
    () => axios.get(`http://localhost:8000/api/classroom/${classroomId}/lesson/${lessonId}/quizgame`),
    {
      retry: false,
      refetchOnWindowFocus: false,
      //retechOnmount is important to avoid empty render when navigating from another page (always true)
      refetchOnMount: true,
      //on guest mode, no need to query quizgame  
      enabled: userinfo ? true : false,
      //refresh every time when rendering
      refetchInterval: 0,
      onSuccess: (data) => {
        //shuffle options and setstate
        setGameQuizAndShffle(data.data.data);
        //trigger time when quiz is successfully fetched
        setStartTimer(true);
        //start saving attemp to localstorage and current quiz id and reset timetaken to 0
        setQuizContext({ attempts: ++quizcontext.attempts, selectedOptions: [], timeTaken: 0, currentQuizGame: location.pathname });
      },
    }
  );

  //click increase to +1 to quiz.attempts context
  const increaseAttempts = () => {
    setQuizContext({ attempts: quizcontext.attempts + 1 });
  };

  const clearContext = () => {
    setQuizContext({ attempts: 0, timeTaken: 0 });
  };

  const updateSelectedOption = (option, gamequizId) => {
    const temp = [...quizcontext.selectedOptions];
    temp.push({ selected:option, gamequizId });

    if (gamequizIndex < gamequiz.length - 1) {
      setQuizContext({ selectedOptions: [...temp] });
      setGamequizIndex(gamequizIndex + 1);
    }else {
      //last question
      setQuizContext({ selectedOptions: [...temp],
        timeTaken: timeTaken,
       });
       if(userinfo.role === false){
         //if user is student, go to result page
       return navigate(`/classroom/${classroomId}/lesson/${lessonId}/quizgame/result`);
       }else{
         //if user is teacher, go to lesson
        return navigate(`/classroom/${classroomId}/lesson/${lessonId}`);
       }
    }
    
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }


  if (isSuccess && gamequiz.length > 4) {
    // console.log(gamequiz)

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${quizgame_bg})`,
          backgroundSize: "cover",
          height: "90vh",
        }}
      >
        <h1>Quiz Game</h1>
        <Card
          sx={{
            minWidth: "480px",
            maxWidth: "640px",
            margin: "auto",
            padding: "1rem",
            backgroundColor: "wheat",
            "& .MuiCardHeader-action": { margin: "0", alignSelf: "center" },
          }}
        >
          <CardHeader
            title={
              "Quiz Game - " + (gamequizIndex+1) + " / " + gamequiz.length + " questions"
            }
            subheader={
              "Attempts: " +
              quizcontext.attempts +
              " - Time Taken: " +
              timeTaken +
              " seconds"
            }
            action={
              <Button onClick={increaseAttempts}>Increase Attempts</Button>
            }
            sx={{
              "& .MuiCardHeader-title": {
                fontSize: "1.3rem",
                fontWeight: "regular",
                color: "black",
              },
            }}
          />
          <LinearProgress variant="determinate" color="secondary" value={(gamequizIndex+1)*100/gamequiz.length} />
          <CardContent>
            <Typography variant="h5" component="h5" fontWeight={"bold"}>
              {gamequiz[gamequizIndex]?.question}
            </Typography>
          </CardContent>
          {gamequiz[gamequizIndex]?.questionImg && (
          <CardContent //img
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Avatar
              variant="square"
              src={gamequiz[gamequizIndex]?.questionImg}
              alt="quizgame"
              sx={{
                width: "auto",
                height: "200px",
                margin: "1rem",
              }}
            />
          </CardContent>)}
          <Divider />
          <List dense>
            {gamequiz[gamequizIndex]?.options.map((option, index) => (
              <ListItem key={index} 
                onClick={() => updateSelectedOption(option, gamequiz[gamequizIndex]._id)}
                sx={{
                  //onhover color change and click
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "lightblue",
                    "& .MuiListItemText-primary": {
                      color: "black",
                    },
                  },
              }}>
                <ListItemText >
                <Typography variant="body1" component="p" >
                  {/* Alphabet before the option */}
                  {String.fromCharCode(65 + index)} . {option}
                </Typography>
                </ListItemText>
              </ListItem>
            ))}
          </List>
          <CardActions>
            <Button onClick={clearContext}>Clear Context</Button>
          </CardActions>
        </Card>
      </Box>
    );
  }
}

export default QuizGame;

