import React, { useContext, useEffect, useState } from 'react'
import DOMPurify from 'dompurify';
import moment from 'moment';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

import { Box, Typography, Paper, Grid, Button, Modal, TextField } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

import { Viewer, ProgressBar } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import { AuthContext } from '../../store/Contexts/AuthContext'

import LessonComment from './LessonComment';

function LessonBody(props) {
    const { userinfo } = useContext(AuthContext);
    const [expanded, setExpanded] = React.useState('panel1');
    const { classroomId, lessonId } = useParams();
    let navigate = useNavigate();
    const { lesson } = props;
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState([]);
    const [comment, setComment] = useState('');

    const [deleteModalopen, setDeleteModalopen] = useState(false);
    const handleDeleteOpen = () => setDeleteModalopen(true);
    const handleDeleteClose = () => setDeleteModalopen(false);


    useEffect(() => {
        //every expanded bring user to top
        // smooth scroll up
        scrollToTop()

    }, [expanded])

    const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      };

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const handleLikeLesson = async () => {
        setLiked(!liked)
        
        const { data } = await axios.put(`http://localhost:8000/api/classroom/${classroomId}/lesson/${lessonId}/like`, {
            userId: userinfo.id
        })
        setLikes(data.likes)
        // console.log(likes)
    }

    //chheck if user liked it
    useEffect(
      () => {
        if (lesson?.likes?.length > 0) {
          if(userinfo.id && lesson.likes.find((like) => like.user)){
              setLiked(true)
          } else {
                setLiked(false)
          }
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const handleDeleteLesson = async () => {
        await axios.delete(`http://localhost:8000/api/classroom/${classroomId}/lesson/${lessonId}`)
        navigate(`/classroom/${classroomId}`)
    }



    return (
        <>
            {/* ////////////////////////////// LESSON MODAL DELETE LESSON ////////////////////////////// */}
            <Modal
              open={deleteModalopen}
              onClose={handleDeleteClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Permanat Delete! Are you sure?
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  This will permanently delete the lesson and all its content.
                </Typography>
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleDeleteClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "red", color: "white" }}
                    onClick={handleDeleteLesson}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Modal>
            
            {/* ////////////////////////////// LESSON HEADER ////////////////////////////// */}
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                backgroundColor:  `${lesson.classroom?.category}` || "primary",
            }}>
                <Paper
                    sx={{
                        position: 'relative',
                        backgroundColor: 'grey.800',
                        //set background transparent
                        color: 'white',
                        mb: 4,
                        backgroundPosition: 'center',
                        backgroundRepeat: 'repeat',
                        backgroundImage: `url(${lesson?.lessonImg})` || 'url(https://source.unsplash.com/random/800x600)',
                        width: '100%',
                        minHeight: '30vh',
                        maxHeight: '400vh',
                    }}>
                    {/* Increase the priority of the hero background image */}
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
                    {/* Add a title to the hero */}
                    <Typography component="h1" variant="h3" color="text" gutterBottom sx={{
                        backgroundColor: 'rgba(0,0,0,.6)',
                        borderRadius: '8px',
                        //onbottom
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        ml: 2
                    }}>
                        {lesson.title}
                    </Typography>
                    {/* Add admin box top right */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            backgroundColor: 'rgba(0,0,0,.6)',
                            borderRadius: '8px',
                            p: 2
                        }}>
                        <Typography variant="h6" component="h6" fontWeight={"bold"} ml={2}>
                            Teacher : {lesson?.creator?.username}
                        </Typography>
                        <Typography variant="p" component="p" fontWeight={"regular"} ml={2}>
                            {lesson?.creator?.email}
                        </Typography>
                        <Typography variant="p" component="p" fontWeight={"regular"} ml={2}>
                            {moment(lesson?.createdAt).format('DD/MM/YYYY')}
                        </Typography>
                    </Box>
                    {/* add delete icon top right */}
                    {userinfo?.id === lesson?.creator?._id &&
                        <Box
                            onClick={handleDeleteOpen} 
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                backgroundColor: 'rgba(0,0,0,.6)',
                                borderRadius: '8px',
                                p: 2,
                                '&:hover': {
                                    cursor: 'pointer',
                                    backgroundColor: 'rgba(0,0,0,.8)',
                                }
                                
                            }}>
                            <DeleteIcon sx={{ color: "red" }} />
                        </Box>
                    }
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
                                </Typography>
                                <Typography variant="h5" color="inherit" paragraph>
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
                {/* ////////////////////////////// LESSON BODY ////////////////////////////// */}
                <Box sx={{ mb: 4, }}>
                    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                            <Typography>Main Lesson {lesson.title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                                backgroundColor: "white",
                            }} >
                                <Box dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(lesson.content) }}
                                    sx={{
                                        m: 3,
                                        height: "auto",
                                        backgroundColor: "#f7f9fc",
                                        borderRadius: "8px",
                                        p: 3,
                                    }}
                                />
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                            <Typography>PDF SECTION {lesson.title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                maxHeight: "auto",
                                backgroundColor: "white",
                            }} >
                                {lesson.lessonFile &&
                                    <Viewer
                                        fileUrl={lesson.lessonFile ? lesson.lessonFile : "https://react-pdf-viewer.dev/assets/pdfs/sample.pdf"}
                                        renderLoader={(percentages) => (
                                            <div style={{ width: '240px' }}>
                                                <ProgressBar progress={Math.round(percentages)} />
                                            </div>
                                        )}
                                        plugins={[
                                            // Register plugins
                                            defaultLayoutPluginInstance,
                                        ]}
                                    />}
                            </ Box>
                        </AccordionDetails>
                    </Accordion>
                </Box>
                {/* ////////////////////////////// LESSON FOOTER ////////////////////////////// */}
                <Grid container spacing={0} sx={{backgroundColor: `${lesson.classroom?.category}`}}>
                    <Grid item md={6} >
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            height: "20vh",
                            alignItems: "center",
                            alignContent: "center",
                            backgroundColor: 'white',
                            m: 3,
                        }} >
                            <Typography variant="h5" component="h5" fontWeight={"bold"} ml={2} color={"text"} m={2}>
                                Do you like this lesson ?
                            </Typography>
                            {!liked ? (
                            <><ThumbUpAltOutlinedIcon sx={{
                                    color: "gray",
                                    height: "5vh",
                                    width: "5vh",
                                    mt: "2vh",
                                    //onhover pointer and color
                                    '&:hover': {
                                        cursor: 'pointer',
                                        color: '#ffc107',
                                    }
                                }}
                                    onClick={handleLikeLesson} /><Typography variant="h5" component="h5" fontWeight={"bold"} ml={2} color={"text"} m={2}>
                                        like it!
                                    </Typography></>) : (
                            <><ThumbUpIcon sx={{
                                        color: "primary",
                                        height: "5vh",
                                        width: "5vh",
                                        mt: "2vh",
                                        //onhover pointer and color
                                        '&:hover': {
                                            cursor: 'pointer',
                                            color: '#ffc107',
                                        }
                                    }}
                                        onClick={handleLikeLesson} />
                                        <Typography variant="h5" component="h5" fontWeight={"bold"} ml={2} color={"text"} m={2}>
                                            you and { lesson?.likeCount } others like it!
                                        </Typography></>
                            )}
                        </Box>
                        
                    </Grid>
                    <Grid item md={6} >
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            height: "20vh",
                            alignItems: "center",
                            alignContent: "center",
                            backgroundColor: 'white',
                            m: 3,
                        }} >
                            <Typography variant="h5" component="h5" fontWeight={"bold"} ml={2} color={"text"} m={2}>
                                {lesson.quizIsReady ? `There are ${lesson.quizCount} in this lesson`  : "Quiz is not ready"}
                            </Typography>
                            <Button variant="contained" color="primary" disabled= {!lesson.quizIsReady} sx={{
    
                                borderRadius: "8px",
                                m: 2,
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "1.5rem",
                                textTransform: "none",
                                
                                
                                ":disabled": {
                                    backgroundColor: "rgba(0,0,0,.6)",
                                    color: "white",
                                    cursor: "not-allowed",
                                },
                                '&:hover': {
                                    backgroundColor: 'rgb(0,0,0,.1)',
                                    color: "black",
                                }
                            }}>
                                <Typography variant="h5" component="h5" fontWeight={"bold"} ml={2} color={"black"} m={2}>
                                    Take a Quiz
                                </Typography>
                            </Button>
                            </Box>
                    </Grid>
                    {/* /////////////////////////// Comment Section /////////////////////////// */}
                    
                </Grid>
            </Box>
        </>
    )
}

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default LessonBody