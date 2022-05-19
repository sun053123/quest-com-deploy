
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export default function LessonCount(props) {
  const { lessonCount } = props;

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
            Lessons : {lessonCount}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
          All of Lessons in Classroom 
          </Typography>
        </CardContent>
      </Box>
      <CardMedia
        component="div"
        sx={{ width: 151,
            //red color if exp is less than 16 , yellow if exp is between 16 and 34, green if exp is more than 34
            backgroundColor:'#33bfff',
            marginLeft: "auto",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
         }}
        alt="Live from space album cover"
      > 
        <MenuBookIcon sx={{
            fontSize: "100px",
            color: 'white',
            margin: "auto",
        }} />
        </CardMedia>
    </Card>
  );
}
