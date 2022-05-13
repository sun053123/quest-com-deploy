import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

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
} from "@mui/material";

import quizgame_bg from "../assets/img/quizgame_bg.jpg";
import ErrorPage from "../components/ErrorPage";

function QuizGame() {
  const { userinfo } = useContext(AuthContext);
  const { quizcontext, setQuizContext } = useStateQuizContext();
  const navigate = useNavigate();

  const { classroomId, lessonId } = useParams();

  const [gamequiz, setGamequiz] = useState([]);
  const [gamequizIndex, setGamequizIndex] = useState(0);

  const [timeTaken, setTimeTaken] = useState(0);

  let timer;

  // const startTimer = () => {
  //   timer = setInterval(() => {
  //     setTimeTaken((prev) => prev + 1);
  //   }, [1000]);
  // };

  //set timer and do not rerender

  useEffect(() => {
    const interval = setInterval(() => {
      timer = setTimeTaken((prev) => prev + 1);
    }, 1000);

    return () => { clearInterval(interval) };
  }, [setTimeTaken]);

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
      //on guest mode, no need to query scores
      enabled: userinfo ? true : false,
      onSuccess: (data) => {
        // console.log(data);
        setGameQuizAndShffle(data.data.data);
     
        setQuizContext({ attempts: ++quizcontext.attempts, selectedOptions: [], timeTaken: 0 });
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
      setQuizContext({ selectedOptions: [...temp],
        timeTaken: timeTaken,
       });
       return navigate(`/classroom/${classroomId}/lesson/${lessonId}/quizgame/result`);
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

