import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';


export default function TimeCard(props) {
    const { TimeTaken, quizLength } = props;

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
          <Typography component="div" variant="h6">
            Time Taken: {TimeTaken} s
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            maximum time: {quizLength*20} s
          </Typography>
        </CardContent>
      </Box>
      <CardMedia
        component="div"
        sx={{ width: 151,
            // if TimeTaken > (quizLenght*10) / 3 then red color, if TimeTaken > (quizLenght*10) / 3 and TimeTaken < (quizLenght*10) / 3 then yellow color, if TimeTaken < (quizLenght*10) / 3 then green color */}
            backgroundColor: `${
                TimeTaken > (quizLength*10) / 3 ? '#ef5350' : TimeTaken > (quizLength*10) / 3 && TimeTaken < (quizLength*10) / 3 ? '#ffee58' : '#66bb6a'
            }`,
            marginLeft: "auto",
         }}
        alt="Live from space album cover"
      /> 
    </Card>
  );
}
