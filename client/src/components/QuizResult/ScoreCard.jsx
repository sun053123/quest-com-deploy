import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';


export default function ScoreCard(props) {
  const { score, quizLength } = props;

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
            Correct Ans: {score}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            out of {quizLength} questions
          </Typography>
        </CardContent>
      </Box>
      <CardMedia
        component="div"
        sx={{ width: 151,
            //red color if score is less than quizlenght 1/3, yellow if score is between quizlenght 1/3 and 2/3, green if score is more than 2/3
            backgroundColor: `${
                score < quizLength / 3 ? '#ef5350' : score < 2 * quizLength / 3 ? '#ffee58' : '#66bb6a'
            }`,
            marginLeft: "auto",
         }}
        alt="Live from space album cover"
      /> 
    </Card>
  );
}
