
import React, { useState} from 'react';
import moment from 'moment';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import TodayIcon from '@mui/icons-material/Today';

export default function JoinTodayClass(props) {
  const { studentsCheckin } = props;

  const [studentJoinTodayClass, setStudentJoinTodayClass] = useState([]);

  React.useEffect(() => {

    //find student join today with create date and moment
    const studentsJoinToday = studentsCheckin?.filter(student => {
        const today = moment().format('YYYY-MM-DD');
        const createDate = moment(student.createdAt).format('YYYY-MM-DD');
        return today === createDate;
    });
    console.log(studentsJoinToday);
    setStudentJoinTodayClass(studentsJoinToday);

    }, [studentsCheckin]);



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
            Joined Today: {studentJoinTodayClass?.length}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            Students who joined today
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
        <TodayIcon sx={{
            fontSize: "100px",
            color: 'white',
            margin: "auto",
        }} />
        </CardMedia>
    </Card>
  );
}
