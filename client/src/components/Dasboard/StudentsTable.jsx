import React from 'react'
import moment from 'moment';

import { TableContainer, Paper, Table, TableRow, TableHead, TableCell, TableBody } from '@mui/material';

function StudentsTable(props) {
    const { studentsCheckin } = props;
  return (
    <>
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>User Name (Student)</TableCell>
            <TableCell align="right">User Email</TableCell>
            <TableCell align="right">Joined(date)</TableCell>
            <TableCell align="right">Last Joined(date)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {studentsCheckin?.map((user) => (
            <TableRow
              key={user.user._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                
              >
                {user.user.username}
              </TableCell>
              <TableCell
                align="right"
              >
                {user.user.email}
              </TableCell>
              <TableCell
                align="right"
              >
                {moment(user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
              </TableCell>
              <TableCell
                align="right"
              >
                {
                    //moment from now
                    moment(user.updatedAt).fromNow()
                }
              </TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  )
}

export default StudentsTable