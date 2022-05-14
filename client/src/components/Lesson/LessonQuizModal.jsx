import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Modal } from '@mui/material';
import useStateQuizContext from '../../store/Contexts/QuizContext';

function LessonQuizModal(props) {
    const { quizModalopen, handleQuizClose } = props;
    const { quizcontext, setQuizContext } = useStateQuizContext();
    const navigate = useNavigate();

    const handleGoBackToCurrentQuiz = () => {
        navigate(quizcontext.currentQuizGame);
    }

  return (
    <Modal
        open={quizModalopen}
        onClose={handleQuizClose}
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
            Cannot Skip a current QuizGame !
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            go back to the lesson and complete the quizgame before skipping.
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
              onClick={handleGoBackToCurrentQuiz}
            >
              Go to current QuizGame 
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "red", color: "white" }}
              onClick={handleQuizClose}
            >
              Close 
            </Button>
          </Box>
        </Box>
      </Modal>

  )
}

export default LessonQuizModal