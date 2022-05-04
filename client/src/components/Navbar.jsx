import React from 'react'
import { Box, Typography } from '@mui/material'

function Navbar() {
  return (
   //make mui navbar
   <div className="navbar">
        <Typography variant="h6" color="inherit">
            <Box fontWeight="fontWeightBold" m={1}>
                <a href="/">Home</a>
            </Box>
        </Typography>
        <Typography variant="h6" color="inherit">
            <Box fontWeight="fontWeightBold" m={1}>
                <a href="/classroom">Classroom</a>
            </Box>
        </Typography>
    </ div>
  )
}

export default Navbar