import React from 'react'

import { Paper, Box, Typography } from '@mui/material'

function ClassroomContent(props) {
    const { classroom } = props
  return (
    <Paper sx={{
        //simple paper
        position: 'relative',
        backgroundColor: 'grey.800',
    }}>
        <Box >
            <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                {classroom?.title}
            </Typography>
            <Typography variant="h5" color="inherit" paragraph>
                {classroom?.description}
            </Typography>

        </Box>
    </Paper>
  )
}

export default ClassroomContent