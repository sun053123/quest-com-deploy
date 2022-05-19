import React from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom'
import { Box, Button, Grid  } from '@mui/material'


function CreateClassroomPathbar(props) {
    const navigate = useNavigate()

  return (
    <Box sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: 'secondary.main',
        textAlign: 'center',
        padding: '0.5rem',
    }}>
        <Grid container spacing={0}>
            <Grid item xs={4} sx={{
                display: 'flex',
                marginRight: 'auto',
            }}>
                <Button variant="outlined" size='small' color="primary" onClick={() => navigate(`/`)}>
                    <ArrowBackIosIcon sx={{ height:"15px", p:"2"}} /> Home
                </Button>
                
            </Grid>
            <Grid item xs={4}>
            Create Classroom
            </Grid>
            <Grid item xs={4}>
                
            </Grid>
        </Grid>
    </Box>
  )
}

export default CreateClassroomPathbar