import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

function ClassroomBody(props) {
  const { classroom } = props;

  return (
    <>
    <Paper
      sx={{
        position: 'relative',
        backgroundColor: 'grey.800',
        //set background transparent
        color: 'white',
        mb: 4,
        backgroundPosition: 'center',
        backgroundImage: `url(${classroom?.classroomImg})` || 'url(/no_img.png)',
        width: '100%',
        minHeight: '50vh',
        maxHeight: 'auto',
      }}
    >
      {/* Increase the priority of the hero background image */}
      {<img style={{ display: 'none' }} src={classroom?.classroomImg} alt={classroom?.classroomImg} />}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: 'rgba(0,0,0,.6)',
        }}
      />
      <Grid container>
        <Grid item md={6}>
          <Box sx={{
              position: 'relative',
              p: { xs: 3, md: 6 },
              pr: { md: 0 },
            }}>
            <Typography component="h1" variant="h3" color="inherit" gutterBottom sx={{
              backgroundColor: 'rgba(255,255,255,.1)',
              borderRadius: '8px',
            }}>
              {classroom?.title}
            </Typography>
            <Typography variant="h5" color="inherit" paragraph>
              {classroom?.description}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={6}>
          <Box sx={{
              position: 'relative',
              p: { xs: 3, md: 6 },
              pl: { md: 0 },
            }}>
            <Typography variant="h5" color="inherit" gutterBottom >              
              {classroom?.content}
            </Typography>
          </Box>
        </ Grid>
      </Grid>
    </Paper>
    </>
  );
}


export default ClassroomBody;