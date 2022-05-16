import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';


export default function ExpCard(props) {
  const { expgain } = props;

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
            Exp Gained: {expgain}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            maximum exp: 50 
          </Typography>
        </CardContent>
      </Box>
      <CardMedia
        component="div"
        sx={{ width: 151,
            //red color if exp is less than 16 , yellow if exp is between 16 and 34, green if exp is more than 34
            backgroundColor: `${
                expgain < 16 ? '#ef5350' : expgain < 34 ? '#ffee58' : '#66bb6a'
            }`,
            marginLeft: "auto",
         }}
        alt="Live from space album cover"
      /> 
    </Card>
  );
}
