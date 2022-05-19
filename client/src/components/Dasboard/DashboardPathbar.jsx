import { Box, Button, Grid, Typography } from '@mui/material'
import React from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate, useParams } from 'react-router-dom'

function DashboardPathbar(props) {
    const { classroomStatus } = props
    const navigate = useNavigate()
    const { classroomId } = useParams()

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
                //stick on left
                display: 'flex',
                marginRight: 'auto',
            }}>
                <Button variant="outlined" size='small' color="primary" onClick={() => navigate("/")}>
                    <ArrowBackIosIcon sx={{ height:"15px", p:"2"}} /> Home
                </Button>

                <Button variant="outlined" size='small' color="primary" onClick={() => navigate(`/classroom/${classroomId}`)}>
                    <ArrowBackIosIcon sx={{ height:"15px", p:"2"}} /> Classroom
                </Button>
            </Grid>
            <Grid item xs={4}>
            Dashboard
            </Grid>
            <Grid item xs={4}>
                <Typography variant="h6" sx={{
                    //classroomStatus === ture color green
                    color: classroomStatus === true ? 'white' : 'red',
                }}>
                    Status : {classroomStatus === true ? 'Public' : 'Private'}
                </Typography>
            </Grid>
        </Grid>
    </Box>
  )
}

export default DashboardPathbar