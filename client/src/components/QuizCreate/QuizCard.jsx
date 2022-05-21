import React from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom';

import { Card, CardMedia, CardContent, CardActions, Grid, Typography, Button,Box } from '@mui/material'
import no_img from '../../assets/img/no_img.png'
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";

const options = ["tolead a beter life", "I need my love", "to be here", "tolead a beter life", "tolead a beter life", "to be there", "to be with you"]

function QuizCard(props) {
    const { quiz, setQuizId } = props;
    const { classroomId, lessonId } = useParams();


  const deleteQuiz = (quizid) => {
    //axios
    axios.delete(`/classroom/${classroomId}/lesson/${lessonId}/quizcontrol/${quizid}`)
    window.location.reload();
  }

  return (
  
  <Grid item key={quiz._id} xs={12} sm={6} md={4}>
      <Card sx={{ 
          //if height > 60vh need to collapse 
            height: "60vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
            backgroundColor: "white",
            overflow: "hidden",
            overflowY: "scroll",
            position: "relative",
            transition: "all 0.3s ease-in-out"            
            
        }}>
            
            <Box sx={{
                //on top right menu
                position: "absolute",
                top: "0",
                right: "0",
                flexDirection: "row",
                justifyContent: "space-between",
                //space between menu and card
                padding: "0.5rem",
                //between menu
            }}>
                {/* <Button variant="contained" sx={{
                    backgroundColor: "yellow",
                }}
                onClick={() => setQuizId(quiz._id)}>
                    <HistoryEduIcon />
                </Button> */}
                <Button variant="contained" sx={{
                    backgroundColor: "red",
                }}
                onClick={() => deleteQuiz(quiz._id)}>

                    <DeleteIcon />
                </Button>
            </Box>
    
          <CardMedia
              component="img"
              image={ quiz.questionImg || no_img}
              alt="quiz img" 
              sx={{
                    height: '140px',
                    width: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    //onhover show full size img
                    '&:hover': {
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',}
                    }}
              />
          <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2" sx={{
                    fontWeight: 'bold',
                    justifyContent: 'center',
                    textAlign: 'center',
              }}>
                  {quiz.question}
              </Typography>
              {quiz.options.map((option, index) => (
                  <Typography variant="body2" color="textSecondary" component="p" sx={{
                      //color is quiz.answer === option ? 'primary' : 'textSecondary',
                        color: quiz.answer === option ? 'green' : 'text',
                        
                  }}>
                      {index + 1} : {option}
                    </Typography>
                ))}
              
              <Typography variant="h6" color="textSecondary" component="h6">
                  explanation : {quiz.explanation}
              </Typography>
          </CardContent>
          <CardActions>
              <Button size="small">View</Button>
              <Button size="small">Edit</Button>
          </CardActions>
      </Card>    
    </Grid>
  )
}

export default QuizCard



{/* <Card sx={{ height: 'auto', display: 'flex', flexDirection: 'column'}}>
          <CardMedia
              component="img"
              image="https://source.unsplash.com/random"
              alt="random" 
              sx={{
                    height: '140px',
                    width: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    }}
              />
          <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2" sx={{
                    fontWeight: 'bold',
                    justifyContent: 'center',
                    textAlign: 'center',
              }}>
                  {quiz.question}
              </Typography>
              {quiz.options.map((option, index) => (
                  <Typography variant="body2" color="textSecondary" component="p" sx={{
                      //color is quiz.answer === option ? 'primary' : 'textSecondary',
                        color: quiz.answer === option ? 'green' : 'text',
                        
                  }}>
                      {index + 1} : {option}
                    </Typography>
                ))}
              
              <Typography variant="h6" color="textSecondary" component="h6">
                  explanation : {quiz.explanation}
              </Typography>
          </CardContent>
          <CardActions>
              <Button size="small">View</Button>
              <Button size="small">Edit</Button>
          </CardActions>
      </Card>    */}