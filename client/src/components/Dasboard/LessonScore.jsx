import React, { useEffect, useState } from 'react'
import Apexchart from 'react-apexcharts';
import moment from 'moment';

import { Box, TableContainer, Paper, Table, TableRow, TableHead, TableCell, TableBody } from '@mui/material';


function LessonScore(props) {
    const { lessonScore } = props
    const [expRange, setExpRange] = useState({})

    console.log(lessonScore)

    useEffect(() => {
        filterExp(lessonScore)
    }, [lessonScore])

    const filterExp = (lessonScore) => {
        // filter exp to array
        const exp = lessonScore.map(item => item.expgain)
        // count exp range 0-5, 6-10, 11-15, 16-20, 21-25, 26-30, 31-35, 36-40, 41-45, 46-50
        const expRange = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        exp.forEach(item => {
            if (item < 6) {
                expRange[0]++
            } else if (item < 11) {
                expRange[1]++
            } else if (item < 16) {
                expRange[2]++
            } else if (item < 21) {
                expRange[3]++
            } else if (item < 26) {
                expRange[4]++
            } else if (item < 31) {
                expRange[5]++
            } else if (item < 36) {
                expRange[6]++
            } else if (item < 41) {
                expRange[7]++
            } else if (item < 46) {
                expRange[8]++
            } else if (item < 51) {
                expRange[9]++
            } else {
                expRange[10]++
            }
        });

        setExpRange(expRange)
    }

    const series = [
        {
            name: 'Lesson Score',
            data: expRange
        }
    ];

    const chartConfig = {
        chart: {
            type: 'bar',
            height: 350,
          },

          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '35%',
              endingShape: 'rounded'
            },
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          xaxis: {
            title:{
                text: 'Range of Exp',
            },
            categories: ['0-5','6-10', '11-15','16-20', '21-25','26-30', '31-35','36-40', '41-45', '46-50'],
          },
          yaxis: {
            title: {
              text: 'Number of Student'
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return  val + " students";
              }
            }
         }
    }



  return (
    <>

        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '1vh',
        }}>
        <Apexchart  options={chartConfig} type="bar" series={series} width={800} />


    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>User Name (Student)</TableCell>
            <TableCell align="right">Attempt</TableCell>
            <TableCell align="right">Time Taken&nbsp;(sec)</TableCell>
            <TableCell align="right">CorrectAns</TableCell>
            <TableCell align="right">ExpGain</TableCell>
            <TableCell align="right">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lessonScore.map((user) => (
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
                {user.attempts}
              </TableCell>
              <TableCell
                align="right"
              >
                {user.timeTaken}
              </TableCell>
              <TableCell
                align="right"
              >
                {user.score}
              </TableCell>
              <TableCell
                align="right"
              >
                {user.expgain}
              </TableCell>
              <TableCell
                align="right"
              >
                {moment(user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

        </Box>
    </>
  )
}

export default LessonScore