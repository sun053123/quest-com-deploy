import { Accordion, Box, AccordionSummary, Typography,AccordionDetails, Divider, Avatar } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import React from 'react'

function AnswerCard(props) {
    const { quizAnswer } = props
    console.log(quizAnswer)
  return (
    <>
        <Box sx={{mt: 5, width: '100%', maxWidth: 640, mx: 'auto'}}>
            {
                quizAnswer.map((answer, index) => {return(
                    <Accordion disableGutters key={index}>
                        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                            <Typography variant="h6">{answer.question}</Typography>
                        </AccordionSummary>
                        { answer.questionImg && (
                            <Avatar alt="question img" variant='square' src={answer.questionImg} sx={{
                                width: '280px',
                                height: '100%',
                                //center
                                margin: 'auto',
                                display: 'block',
                                marginTop: '10px',
                                marginBottom: '10px',
                            }} />
                        )}
                        
                        <AccordionDetails>
                            <Typography variant="body1" sx={{
                                //if correct color green else red
                                color: answer.isCorrect ? 'green' : 'red'
                            }}> Ans : {answer.answer}</Typography>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Typography variant="body1" sx={{
                                color: '#9e9e9e'
                            }}> {answer.explanation
                            }</Typography>
                    </AccordionDetails>
                </Accordion>
                )
            })
        }
        </Box>
    </>
  )
}

export default AnswerCard