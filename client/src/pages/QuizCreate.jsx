import React, { useState, useContext, useEffect } from 'react'
import FileBase from 'react-file-base64';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { CssBaseline, Box, Grid, Typography, MenuItem, InputAdornment, Checkbox, Button, TextField, Avatar } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import SearchIcon from '@mui/icons-material/Search';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { LoadingButton } from '@mui/lab';
import ClearIcon from '@mui/icons-material/Clear';

import quizbg from "../assets/img/quizbg.png"
import QuizCard from '../components/QuizCreate/QuizCard'
import { useMutation, useQuery } from 'react-query';

import { AuthContext } from "../store/Contexts/AuthContext";
import LoadingPage from '../components/LoadingPage';
import ErrorPage from '../components/ErrorPage';

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const maxlimit = 46;

function QuizCreate() {
  const { userinfo } = useContext(AuthContext);
  const { classroomId, lessonId } = useParams()
  //set default options array length is 2
  const [questionOptions, setQuestionOptions] = useState([{}, {}]);
  const [quizId, setQuizId] = useState();

  const [quizzes, setQuizzes] = useState([]);

  const [questionForm, setQuestionForm] = useState({
    question: "",
    answer: "",
    options: [],
    questionImg: "",
    explanation: "",
  })
  
  const [quizcontroller, setQuizcontroller] = useState({
    quizCount: 0,
    quizIsRandom: false,
    quizLimit: 0,
    quizReady: false,
  })


  const onChange = (e) => {
    setQuestionForm({
      ...questionForm,
      [e.target.name]: e.target.value
    })
  }

  const handleFormOptions = (index, e) => {
    let data = [...questionOptions];
    data[index][e.target.name] = e.target.value;
    setQuestionOptions(data);

    //opject array to string array
    // let options = questionOptions.map(option => option.option);
    // setQuestionForm({...questionForm, options: options})
  }

  const clearEdit = () => {
    setQuestionForm({
      question: "",
      answer: "",
      options: [],
      questionImg: "",
      explanation: "",
    })
    setQuestionOptions([{}, {}]);
    setQuizId(null);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    //set QuestionOptions to questionForm.options array
    {
      questionOptions.map((option) => {
        questionForm.options.push(option);
      })
    }

    //post to server
    mutation.mutate(questionForm);

    //clear form
    setQuestionForm({
      question: "",
      answer: "",
      options: [],
      questionImg: "",
      explanation: "",
    })
    setQuestionOptions([{}, {}]);
    //refresh window //clear form
    window.location.reload();
  }


  const mutation = useMutation((questionForm) => {
    axios.post(`http://localhost:8000/api/classroom/${classroomId}/lesson/${lessonId}/quizcontrol`, questionForm)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  })

  const {
    isLoading: isLoadingQuiz,
    isError: isErrorQuiz,
    ifSuccess: ifSuccessQuiz,
  } = useQuery(
    "quizzes",
    async () => await axios.get(`http://localhost:8000/api/classroom/${classroomId}/lesson/${lessonId}/quizcontrol`),
    {
      retry: false,
      refetchOnWindowFocus: false,
      //retechOnmount is important to avoid empty render when navigating from another page (always true)
      refetchOnMount: true,
      //on guest mode, no need to query scores
      enabled: userinfo?.role === true ? true : false,
      onSuccess: (data) => {
        // console.log(data);
        setQuizzes(data.data.quiz);
        setQuizcontroller(data.data.quizcontroller);
      },
    }
  );

  const {
    isLoading: isLoadingSingleQuiz,
    isError: isErrorSingleQuiz,
    ifSuccess: ifSuccessSingleQuiz,
  } = useQuery(
    ["singleQuiz", quizId],
    () => axios.get(`http://localhost:8000/api/classroom/${classroomId}/lesson/${lessonId}/quizcontrol/${quizId}`),
    {
      retry: false,
      refetchOnWindowFocus: false,
      //retechOnmount is important to avoid empty render when navigating from another page (always true)
      refetchOnMount: true,
      enabled: quizId ? true : false,
      onSuccess: (data) => {
        setQuestionForm(data.data.quiz);
        setQuestionOptions(data.data.quiz.options);
      }
    }
  );

  const onChangeController = (e) => {
    setQuizcontroller({
      ...quizcontroller,
      [e.target.name]: e.target.value
    })

    console.log(quizcontroller);
  }

  const handleQuizControllerSubmit = () => {
    //set values to quizcontroller by passing event
   
      
    axios.put(`http://localhost:8000/api/classroom/${classroomId}/lesson/${lessonId}/quizcontrol`, quizcontroller)
      .then(res => {
        //set quizcontroller to new values
        setQuizcontroller(res.data.quizcontroller);
      }).catch(err => {
        console.log(err)
        toast.error(err.data.message)
      })
  }
      



  // if (isLoadingQuiz) {
  //   return <LoadingPage />
  // }

  if (isErrorQuiz) {
    return <ErrorPage />
  }

  return (
    <>
      <CssBaseline />
      <Box p={2} sx={{
        backgroundImage: `url(${quizbg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        //fit window
        width: "100%",
        height: "100%",
        minHeight: "100vh",

      }}>
        <Box sx={{
          //center
          justifyContent: "center",
          display: "flex",
          color: "white",
          fontSize: "2rem",
          fontWeight: "bold",
          textShadow: "2px 2px 2px black",
          backgroundColor: "rgba(0,0,0,0.5)",
          borderRadius: "8px",
          mb: 3,
        }}>
          <Typography variant="h2">
            Quiz Controller
          </Typography>
        </Box>
        {/* //////////////////////////// QUIZ CREATE BODY //////////////////////////// */}

        <Grid container spacing={1} >
          <Grid item xs={8.5}>
            {isLoadingQuiz ? <LoadingPage /> :
              <Box sx={{
                //center
                justifyContent: "center",
                display: "flex",
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: "8px",
                minHeight: "100vh",
              }}>

                {/* //////////////////////////// QUIZ CARD //////////////////////////// */}
                <Grid container spacing={2}>

                  {quizzes.map((quiz) => (
                    <QuizCard quiz={quiz} setQuizId={setQuizId} />
                  ))}

                </Grid>
              </Box>}
          </Grid>
          {/* //////////////////////////// QUIZ FORM //////////////////////////// */}
          <Grid item xs={3.5}>
            {isLoadingSingleQuiz ? <LoadingPage /> :
              <Box sx={{
                //center
                justifyContent: "center",
                display: "flex",
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: "8px",
                minHeight: "100vh",
                padding: "1rem",
              }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '2rem',
                  }}>
                  <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <DriveFileRenameOutlineIcon />
                  </Avatar>
                  {quizId ? (
                    <>
                      <Button variant="outlined" color="primary" onClick={() => clearEdit()}>
                        create quiz
                      </Button>
                      <Typography component="h1" variant="h5">
                        Edit Quiz
                      </Typography>
                    </>
                  ) : (
                    <Typography component="h1" variant="h5">
                      Create Quiz
                    </Typography>
                  )}
                  <Box component="form" noValidate sx={{ mt: 1 }}>
                    <TextField
                      multiline
                      margin='normal'
                      required
                      fullWidth
                      id="question"
                      label="Quiz Title"
                      name="question"
                      autoFocus
                      inputProps={{
                        maxLength: 200,
                      }}
                      onChange={onChange}
                      value={questionForm.question}
                    />
                    {/* //////////////////////////// QUIZ OPTIONS //////////////////////////// */}
                    {questionOptions.map((option, index) => (
                      <Box key={index}>
                        <TextField
                          margin='normal'
                          multiline
                          required
                          fullWidth
                          id="questionoption"
                          label={"Quiz Option " + (index + 1)}
                          name="questionoption"
                          autoComplete="questionoption"
                          onChange={(e) =>
                            handleFormOptions(index, e)
                          }
                          value={
                            //when submit, set empty options array and when edit, set old options
                            questionOptions[index].option
                            // quizId ? questionForm.options[index].option : ""
                          }
                          inputProps={{
                            maxLength: 200,
                          }}
                        />
                        {/* //////////////////////////// DELETE OPTIONS //////////////////////////// */}
                        {index === questionOptions.length - 1 ? (
                          <Button
                            fullWidth
                            variant="contained"
                            //max index = 8
                            onClick={() => {
                              if (questionOptions.length > 2) {
                                let data = [...questionOptions];
                                data.pop();
                                setQuestionOptions(data);
                              }
                            }
                            }
                            color="secondary"
                            disabled={index < 2}
                            sx={{
                              mb: 2,
                              //set disable color
                              '&:disabled': {
                                backgroundColor: 'gray[300]',
                                color: 'white',
                              }
                            }}
                          >
                            Delete Question Option
                          </Button>
                        ) : null}
                      </Box>
                    ))}

                    {/* //////////////////////////// ADD OPTIONS //////////////////////////// */}
                    <Button
                      fullWidth
                      variant="contained"
                      //max index = 8
                      onClick={() => {
                        if (questionOptions.length < 8) {
                          setQuestionOptions([...questionOptions, {}])
                        }
                      }
                      }
                      color="primary"
                      disabled={questionOptions.length >= 8}
                      sx={{
                        mb: 2,
                        //set disable color
                        '&:disabled': {
                          backgroundColor: 'gray[300]',
                          color: 'white',
                        }
                      }}
                    >
                      Add More Question Option
                    </Button>

                    {/* //////////////////////////// QUIZ SELECT ANSWER //////////////////////////// */}
                    <TextField
                      margin='normal'
                      id="outlined-select-answer"
                      select
                      label="Select"
                      fullWidth
                      value={questionForm.answer}
                      onChange={(e) => setQuestionForm({ ...questionForm, answer: e.target.value })}
                      helperText="Please select an Answer"
                      sx={{
                        maxWidth: '40vh',
                      }}
                    >

                      {questionOptions.map(({ questionoption }, index) => (
                        <MenuItem key={questionoption} value={questionoption}>
                          {questionoption ? questionoption : "Please Enter Question Option"}
                        </MenuItem>))}

                    </TextField>
                    <TextField
                      //explaination
                      margin='normal'
                      multiline
                      required
                      fullWidth
                      id="explanation"
                      label="Quiz Explaination"
                      name="explanation"
                      inputProps={{
                        maxLength: 300,
                      }}
                      //line
                      rows={4}
                      onChange={onChange}

                    />


                    <Typography component="h6" variant="h6">
                      Add Question Image
                    </Typography>
                    <FileBase
                      multiple={false}
                      accept="image/*"
                      onDone={(file) => {
                        if (file.type.startsWith("image")) {
                          // console.log("imgage file", file);
                          setQuestionForm({ ...questionForm, questionImg: file.base64 })
                        }
                      }} />
                    <Button
                      type='submit'
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      onClick={onSubmit}
                    >
                      Submit Question
                    </Button>
                  </Box>
                </Box>
              </Box>
            }
            {/* //////////////////////////// QUIZ CONTROLLER //////////////////////////// */}
            <Box sx={{
              //center
              justifyContent: "center",
              display: "flex",
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: "8px",
              minHeight: "50vh",
              padding: "1rem",
              mt:2,
            }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '2rem',
                }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <DriveFileRenameOutlineIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Quiz Game Controller
                </Typography>
                {/* select quizlimit */}
                <TextField
                  margin='normal'
                  id="outlined-select-quiz"
                  select
                  label="Max Quiz Limit"
                  fullWidth
                  helperText="Please select a max Quiz game"
                  name="quizLimit"
                  value={quizcontroller.quizLimit}
                  onChange={onChangeController}
                  sx={{
                    maxWidth: '40vh',
                  }}>
                  {/*select 50 - 5*/}
                  {[...Array(maxlimit).keys()].map((item, index) => (
                    <MenuItem key={index} value={index + 5}>
                      {index + 5}
                    </MenuItem>
                  ))}
                  </TextField>
                  {/* switch quizisrandom true/false */}
                  <Checkbox checked={quizcontroller.quizIsRandom} onChange={
                    (e) => {
                      if (e.target.checked) {
                        setQuizcontroller({ ...quizcontroller, quizIsRandom: true })
                      }
                      else {
                        setQuizcontroller({ ...quizcontroller, quizIsRandom: false })
                      }
                    }
                  } name="quizIsRandom" />
                  <Typography component="h6" variant="h6">
                    Randomize Quiz
                  </Typography>
                  {/* switch quizisrandom true/false */}
                  <Button
                    type='submit'
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleQuizControllerSubmit}
                  >
                    Submit Quiz Controller
                  </Button>
                  <Typography component="h6" variant="h6" mt={5}>
                    Quiz Status {quizcontroller.quizIsReady ? "Ready" : "Not Ready"}
                  </Typography>
                  <Typography component="h6" variant="h6" mt={1}>
                    Quiz Game Score 20 exp
                  </Typography>
                  <Typography component="h6" variant="h6" mt={1}>
                    Question Current is {quizcontroller.quizCount}
                  </Typography>
                  <Typography component="h6" variant="h6" mt={1}>
                    Question Max Limit is {quizcontroller.quizLimit}
                  </Typography>
                  <Typography component="h6" variant="h6" mt={1}>
                    Quiz {quizcontroller.quizIsRandom ? "Random" : "Sequential"}
                  </Typography>        
              </Box>
            </Box>
          </Grid>
        </Grid>

      </Box>
    </>
  )
}


export default QuizCreate
