import React, { useContext } from 'react'
import DOMPurify from 'dompurify'
import moment from 'moment'
import { useNavigate, useParams } from 'react-router-dom'

import { Viewer, ProgressBar } from '@react-pdf-viewer/core';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import { Box, Paper, Typography, Grid, Button, Container } from '@mui/material'
import { AuthContext } from '../../store/Contexts/AuthContext'
import no_img from '../../assets/img/no_img.png'

function Preview(props) {
    const { lessonForm, isEditMode } = props
    const { userinfo } = useContext(AuthContext)

    const { classroomId, lessonId } = useParams()
    const navigate = useNavigate()
    
    const [expanded, setExpanded] = React.useState('panel1');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
      };

    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <Grid container spacing={0} >
            <Grid item xs={12} sx={{ backgroundColor: "white", }}>
                <Box sx={{ m: 3, display: "flex", flexDirection: "column", backgroundColor: "white", height: "50vh" }} >

                    <Grid container spacing={0} >
                        <Typography variant="h4" component="h4" fontWeight={"bold"}>
                            Preview
                        </Typography>

                        {isEditMode &&
                            <Button variant="contained" color="secondary"
                                onClick={() => {navigate(`/classroom/${classroomId}/lesson/${lessonId}`)}}
                                sx={{
                                    //on left side
                                    marginLeft: "auto"
                                }}>
                                Go to Lesson
                            </Button>}
                    </Grid>
                    <Box sx={{
                        mt: 5,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        justifyItems: "center",
                        alignItems: "center",
                    }} >

                        {lessonForm?.isShowLessonImg ? (
                            <Paper
                                sx={{
                                    position: 'relative',
                                    backgroundColor: 'grey.800',
                                    backgroundImage: `url(${lessonForm?.lessonImg})` || {no_img},
                                    backgroundSize: 'cover',
                                    color: 'white',
                                    mb: 4,
                                    width: '100%',
                                    minHeight: '25vh',
                                    maxHeight: '40vh',
                                }}
                            >
                                <Typography component="h1" variant="h3" color="text" gutterBottom sx={{
                                    backgroundColor: 'rgba(0,0,0,.6)',
                                    borderRadius: '8px',
                                    //onbottom
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    ml: 2
                                }}>
                                    {lessonForm?.title ? lessonForm?.title : "No Title"}
                                </Typography>
                            </Paper>
                        ) : (
                            <Typography variant="h5" component="h5" fontWeight={"bold"} color="gray">
                                {lessonForm?.title ? lessonForm?.title : "No Title"}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{
                        mt: 5,
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "wheat",
                        borderRadius: "8px",
                        p: 2
                    }} >
                        <Typography variant="h6" component="h6" fontWeight={"bold"} ml={2}>
                            Teacher : {userinfo.username}
                        </Typography>
                        <Typography variant="p" component="p" fontWeight={"bold"} ml={2}>
                            {userinfo.email}
                        </Typography>
                        <Typography variant="p" component="p" fontWeight={"regular"} ml={2} mt={3}>
                            {moment().format('MMMM Do YYYY, h:mm:ss a')}
                        </Typography>
                    </Box>
                    <Box dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(lessonForm.content) }}
                        sx={{
                            m: 3,
                            height: "auto",
                            backgroundColor: "#f7f9fc",
                            borderRadius: "8px",
                            p: 3,
                        }}
                    />
                    {/* ///////////// PDF SECTION ///////////// */}
                    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                            <Typography>PDF Preview</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                    <Container >
                        <Box width="100%" height="50vh" display="flex" justifyContent="center" alignItems="center" mb={5} >
                            {lessonForm.pdfFile &&
                                <Viewer
                                    fileUrl={lessonForm.pdfFile ? lessonForm.pdfFile : "https://react-pdf-viewer.dev/assets/pdfs/sample.pdf"}
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
                        </Box>
                    </Container>
                    </AccordionDetails>
                    </Accordion>
                </Box>
            </Grid>
        </Grid>
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

export default Preview