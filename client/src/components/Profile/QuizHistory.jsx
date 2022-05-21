import React from 'react'
import moment from 'moment';

import { TableContainer, Paper, Table, TableRow, TableHead, TableCell, TableBody } from '@mui/material';

function QuizHistory(props) {
    const { quizhistory } = props;
  return (
    <>
    <TableContainer component={Paper} >
      <Table sx={{ minWidth: 650, maxWidth: "95%" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell >Classroom</TableCell>
            <TableCell align="right">Lesson</TableCell>
            <TableCell align="right">Expgain</TableCell>
            <TableCell align="right">Correct Ans</TableCell>
            <TableCell align="right">Attempts</TableCell>
            <TableCell align="right">TimeTaken(s)</TableCell>
            <TableCell align="right">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {quizhistory?.map((quiz) => (
            <TableRow
              key={quiz.lesson._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
              >
                {quiz.classroom.title}
              </TableCell>
              <TableCell
                align="right"
              >
                {quiz.lesson.title}
              </TableCell>
              <TableCell
                align="right"
              >
                {quiz.expgain}
              </TableCell>
              <TableCell
                align="right"
              >
                {quiz.score}
              </TableCell>
              <TableCell
                align="right"
              >
                {quiz.attempts}
              </TableCell>
              <TableCell
                align="right"
              >
                {quiz.timeTaken}
              </TableCell>
              <TableCell
                align="right"
              >
                {moment(quiz.createdAt).format('MMMM Do YYYY')}
              </TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  )
}

export default QuizHistory