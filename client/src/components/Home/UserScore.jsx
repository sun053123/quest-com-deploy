import React, { useContext } from "react";
import {
  Grow,
  Avatar,
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import UserDefaultProfile from "../../assets/img/user-default-profile.png";

import { AuthContext } from "../../store/Contexts/AuthContext";

// const userscores = [
//   {
//     subject: "math",
//     exp: 456,
//   },
//   {
//     subject: "science",
//     exp: 23,
//   },
//   {
//     subject: "english",
//     exp: 462,
//   },
//   {
//     subject: "social",
//     exp: 112,
//   },
//   {
//     subject: "computer",
//     exp: 89,
//   },
// ];

function UserScore(props) {
  const { userscores } = props;
  console.log(userscores);
  //useContext auth
  const { userinfo } = useContext(AuthContext);

  return (
    <Grow in={true}>
      <Container
        maxWidth="lg"
        style={{
          marginTop: "20px",
          marginBottom: "5rem",
          padding: "20px",
          backgroundColor: "#fafafa",
          borderRadius: "5px",
          boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.2)",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={2}>
            {userinfo?.avatar ? (
              <Avatar
                alt="avatar"
                src={userinfo.avatar}
                variant={"square"}
                sx={{
                  marginTop: "20px",
                  marginBottom: "20px",
                  width: "100%",
                  height: "auto",
                  //fit content
                  objectFit: "cover",
                  objectPosition: "center",
                  borderRadius: "8px",
                  boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.2)",
                }}
              />
            ) : (
              <Avatar
                alt="avatar"
                src={UserDefaultProfile}
                variant={"square"}
                sx={{
                  marginTop: "20px",
                  marginBottom: "20px",
                  width: "100%",
                  height: "auto",
                  //fit content
                  objectFit: "cover",
                  objectPosition: "center",
                  borderRadius: "8px",
                  boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.2)",
                }}
              />
            )}

            {userinfo?.username ? (
              <Typography
                variant="h5"
                gutterBottom
                style={{
                  textAlign: "center",
                  justifyContent: "center",
                  marginTop: "20px",
                  marginBottom: "20px",
                  fontWeight: "bold",
                  display: { xs: "none", md: "flex" },
                }}
              >
                {userinfo.username}
              </Typography>
            ) : (
              <Typography
                variant="h5"
                gutterBottom
                style={{
                  textAlign: "center",
                  justifyContent: "center",
                  marginTop: "20px",
                  marginBottom: "20px",
                  fontWeight: "bold",
                  display: { xs: "none", md: "flex" },
                }}
              >
                username
              </Typography>
            )}
          </Grid>
          <Grid
            item
            container
            xs={10}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* make it responsive */}
            {userscores.map((score, index) => {
              return (
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    gutterBottom
                    sx={{
                      textAlign: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      display: { xs: "none", md: "flex" },
                      //get regex to remove the first letter of the subject _
                      color: score.subject.replace(/^./, (str) =>
                        str.toLowerCase()
                      ),

                      marginBottom: "15px",
                      fontSize: "0.8rem",
                    }}
                  >
                    {score.subject.toUpperCase()} Lvl:{" "}
                    {Math.floor(score.exp / 100)}
                  </Typography>
                  <Box
                    keys={index}
                    sx={{ position: "relative", display: "inline-flex" }}
                  >
                    <CircularProgress
                      variant="determinate"
                      value={parseInt(`${Math.round(score.exp % 100)}%`)}
                      size={100}
                      thickness={5}
                      sx={{
                        color: score.subject.replace(/^./, (str) =>
                        str.toLowerCase()
                      )
                      }}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: "absolute",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        color="text.secondary"
                        sx={{
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          textAlign: "center",
                          justifyContent: "center",
                        }}
                      >
                        {`${Math.round(score.exp % 100)}%`}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
}

export default UserScore;