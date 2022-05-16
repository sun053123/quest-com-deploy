import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';


export default function IsSubmitCard(props) {
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
            {isSubmitted ? 'Submitted' : 'Not Submitted'}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {isSubmitted ? 'You can see your result' : 'You can submit your answer and see your result'}
          </Typography>
        </CardContent>
      </Box>
      <CardMedia
        component="div"
        sx={{ width: 151,
            // if isSubmitted is true, gray color, else blue color
            backgroundColor: `${
                isSubmitted ? '#9e9e9e' : '#2196f3'
            }`,
            marginLeft: "auto",
         }}
        alt="Live from space album cover"
      /> 
    </Card>
  );
}
