import React from 'react'
// https://res.cloudinary.com/demo/image/upload/example_pdf.pdf

import { Viewer, ProgressBar } from '@react-pdf-viewer/core';

import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import { Box,Container,Grid, } from '@mui/material';

function Lesson() {

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div>
      <h1>Lesson</h1>
      <Grid container spacing={3}>
        <Grid item xs={6}>
        
        </Grid>
        <Grid item xs={6}>
      
      </Grid>
      </Grid>

      <Container >
      <Box width="100%" height="80vh" display="flex" justifyContent="center" alignItems="center" >
      <Viewer
        fileUrl='https://res.cloudinary.com/demo/image/upload/example_pdf.pdf'
        renderLoader={(percentages) => (
          <div style={{ width: '240px' }}>
              <ProgressBar progress={Math.round(percentages)} />
          </div>
          )}
        plugins={[
          // Register plugins
          defaultLayoutPluginInstance,
          
        ]}
      />
      </Box>
      </Container>
    </div>
  )
}

export default Lesson