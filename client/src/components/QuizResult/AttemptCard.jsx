import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import useStateQuizContext from '../../store/Contexts/QuizContext';


export default function AttemptCard(props) {
    const { quizcontext, setQuizContext } = useStateQuizContext();
    const { isSubmitted } = props;

  return (
    <Card sx={{ display: 'flex', 
        //hover zoom in
        "&:hover": {
            transform: "scale(1.1)",
            transition: "all 0.5s",
            tranparent: "transparent",
            borderRadius: "5px",
        },
     }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            Attempts: {quizcontext.attempts}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
              {/* if attempts = 1 max exp = 50 if attempts = 2 max exp = 45, 3 = 40 */}
            maximum exp: {quizcontext.attempts === 0 ? 'pass' :quizcontext.attempts === 1 ? 50 : quizcontext.attempts === 2 ? 45 : quizcontext.attempts === 3 ? 40 : quizcontext.attempts === 4 ? 35 : quizcontext.attempts === 5 ? 30 : quizcontext.attempts === 6 ? 25 : 25}
          </Typography>
        </CardContent>
      </Box>
      {isSubmitted ? (
          <CardMedia
          component="div"
          sx={{ width: 151,
              //background color gray if isSubmitted is true
                backgroundColor: `#9e9e9e`,
              marginLeft: "auto",
           }}
          alt="Live from space album cover"
        /> 
       ) : (
        <CardMedia
        component="div"
        sx={{ width: 151,
            //green color if attempts is 1 - 2 , yellow if attempts is 3 - 4, red if attempts is 5 - 6
            backgroundColor: `${
              quizcontext.attempts < 3 ? '#66bb6a' : quizcontext.attempts < 5 ? '#ffee58' : '#ef5350'
            }`,
            marginLeft: "auto",
         }}
        alt="Live from space album cover"
      /> 
        )}
      </Card> 
  );
}
