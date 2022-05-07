import React from 'react'

import { Grid, Box, Container } from '@mui/material'
import Preview from '../components/LessonCreate/Preview'

function LessonCreate() {
  return (
    <div>
      <Grid container spacing={0} >
        <Grid item xs={0.5} sx={{backgroundColor:"red" , height:"100vh" }}>
        </Grid>
        <Grid item xs={5.5} sx={{backgroundColor:"blue" , height:"100vh", display:"flex"}}>
          <Preview />
        </Grid>
        <Grid item xs={6} sx={{backgroundColor:"green", height:"100vh"}}>
          <h1>LessonCreate</h1>
        </Grid>
      </Grid>

    </div>
  )
}

export default LessonCreate