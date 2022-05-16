import React, { useEffect, useContext } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { AuthContext } from "../../store/Contexts/AuthContext";

function HighScoreTable(props) {
  const { highScore } = props;
  const { userinfo } = useContext(AuthContext);

  const [highScoreArray, setHighScoreArray] = React.useState([]);

  useEffect(() => {
    //map set highScoreObject to highScore Array
    setHighScoreArray(
      highScore.map((highScoreObject) => {
        return {
          name: highScoreObject.user.username,
          attempts: highScoreObject.attempts,
          timeTaken: highScoreObject.timeTaken,
          score: highScoreObject.score,
          expgain: highScoreObject.expgain,
        };
      })
    );
  }, [highScore]);

  console.log(highScoreArray);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>User Name (Student)</TableCell>
            <TableCell align="right">Attempt</TableCell>
            <TableCell align="right">Time Taken&nbsp;(sec)</TableCell>
            <TableCell align="right">CorrectAns</TableCell>
            <TableCell align="right">ExpGain</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {highScoreArray.map((hs) => (
            <TableRow
              key={hs.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{
                  color: userinfo.username === hs.name ? "green" : "text",
                  fontWeight: userinfo.username === hs.name ? "bold" : "normal",
                }}
              >
                {hs.name}
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: userinfo.username === hs.name ? "green" : "text" }}
              >
                {hs.attempts}
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: userinfo.username === hs.name ? "green" : "text" }}
              >
                {hs.timeTaken}
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: userinfo.username === hs.name ? "green" : "text" }}
              >
                {hs.score}
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: userinfo.username === hs.name ? "green" : "text" }}
              >
                {hs.expgain}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default HighScoreTable;
