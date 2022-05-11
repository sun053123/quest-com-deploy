import React, {useState} from 'react'
import FileBase from 'react-file-base64';

import { CssBaseline, Box, Grid, Typography, MenuItem,InputAdornment, FormControlLabel,Checkbox, Button, TextField, Avatar } from '@mui/material'

import SearchIcon from '@mui/icons-material/Search';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { LoadingButton } from '@mui/lab';


import quizbg from "../assets/img/quizbg.png"
import QuizCard from '../components/QuizCreate/QuizCard'


const cards = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]

function QuizCreate() {

  //set default options array length is 2
  const [questionOptions, setQuestionOptions] = useState([{},{}]);

  const optionIndexTemp = 2;

  const [questionForm, setQuestionForm] = useState({
    question: "",
    answer: "",
    options: [],
    questionImg: "",
    explanation: "",
  })

  const handleFormOptions = (index, e) => {
    let data = [...questionOptions];
    data[index][e.target.name] = e.target.value;
    setQuestionOptions(data);

    //opject array to string array
    // let options = questionOptions.map(option => option.option);
    // setQuestionForm({...questionForm, options: options})
  }

  const onSubmit = (e) => {
    e.preventDefault();

    //set QuestionOptions to questionForm.options array
    {questionOptions.map((option) => {
      questionForm.options.push(option);
    })}

    //clear form
    setQuestionForm({
      question: "",
      answer: "",
      options: [],
      questionImg: "",
      explanation: "",
    })
    //set empty options array
    setQuestionOptions([{},{}]);

    //refresh window //clear form
    window.location.reload();

    console.log(questionForm);
  }
    

  console.log(questionOptions);

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
      mb:3,
    }}>
      <Typography variant="h2">
        Create Quiz
      </Typography>
    </Box>
    {/* //////////////////////////// QUIZ CREATE BODY //////////////////////////// */}
    <Grid container spacing={1} >
      <Grid item xs={8.5}>
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
          {cards.map((card) => (
            <QuizCard card={card} />
          ))}
          </Grid>
        </Box>
      </Grid>
      {/* //////////////////////////// QUIZ FORM //////////////////////////// */}
        <Grid item xs={3.5}>
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
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <DriveFileRenameOutlineIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create Question Form
          </Typography>
          <Box component="form"  noValidate sx={{ mt: 1 }}>
            <TextField
              multiline
              margin='normal'
              required
              fullWidth
              id="quiztitle"
              label="Quiz Title"
              name="quiztitle"
              autoFocus
              inputProps={{
                maxLength: 200,
              }}
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
                  //when submit, set empty options array
                  questionOptions[index].option
                }
                inputProps={{
                  maxLength: 200,
                }}
              />
              {/* //////////////////////////// DELETE OPTIONS //////////////////////////// */}
              { index === questionOptions.length - 1 ?(
              <Button
               fullWidth
               variant="contained"
               //max index = 8
               onClick={() => {
                 if (questionOptions.length > 2) {
                   let data = [...questionOptions];
                    data.pop();
                   setQuestionOptions(data);
                 }}
               }
               color="secondary"
               disabled= {index < 2}
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
             ): null}
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
                }}
              }
              color="primary"
              disabled= {questionOptions.length >= 8}
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
          onChange={(e) => setQuestionForm({...questionForm, answer: e.target.value})}
          helperText="Please select an Answer"
        >

          {questionOptions.map(({questionoption}, index) => (
            <MenuItem key={questionoption} value={questionoption}>
              { questionoption ? questionoption : "Please Enter Question Option"}
            </MenuItem>))}

        </TextField>
        <TextField 
          //explaination
          margin='normal'
          multiline
          required
          fullWidth
          id="quizexplaination"
          label="Quiz Explaination"
          name="quizexplaination"
          inputProps={{
            maxLength: 300,
          }}
          //line
          rows={4}

        />
          

        <Typography component="h6" variant="h6">
          Add Question Image
        </Typography>
        <FileBase
          multiple={false}
          accept="image/*"
          onDone={(file) => {
            console.log(file)
          }}/>
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
        </Grid>
    </Grid>

    </Box>
    </>
  )
}

export default QuizCreate

// setQuestionOptions(questionOptions.map((option, index) => {
//   if (index === index) {
//     return {...option, [e.target.name]: e.target.value}
//   }
//   return option
// }
// ))