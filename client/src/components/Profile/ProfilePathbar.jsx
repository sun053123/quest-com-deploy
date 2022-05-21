import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid, Typography, Box, Button } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

function ProfilePathbar() {
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
            Profile User
            </Grid>
            <Grid item xs={4}>
                
            </Grid>
        </Grid>
    </Box>
  )
}

export default ProfilePathbar