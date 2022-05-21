import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
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

function UserScore(props) {
  const { userscores } = props;
  const location = useLocation();


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
          { location.pathname !== "/profile" &&(
          <Grid item xs={2}>   

              <Avatar
                alt="avatar"
                src={userinfo?.avatar ? userinfo?.avatar : UserDefaultProfile}
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
          )}
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
                  key={index}
                  xs={2}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    //on hover set zoom
                    "&:hover": {
                      transition: "all 0.5s",
                      tranparent: "transparent",
                      borderRadius: "5px",
                      //zoom
                      transform: "scale(1.1)",
                    },
                  }}>
                  <Box>
                  <Typography
                    gutterBottom
                    sx={{
                      textAlign: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      display: { xs: "none", md: "flex" },
                      //get regex to remove the first letter of the subject _
                      color: score.subject.replace(/^./, (str) => str.toLowerCase()),
                      marginBottom: "15px",
                      fontSize: "0.8rem",
                    }}
                  >
                    {score.subject.toUpperCase()} Lvl:{" "}
                    {Math.floor(score.exp / 100)}
                  </Typography>
                  <Box
                  //use unique key to avoid error
                    keys={index}
                    sx={{ position: "relative", display: "inline-flex" }}
                  >
                    <CircularProgress
                    //render from 0 - 100 range
                      variant="determinate"
                      value={parseInt(`${Math.round(score.exp % 100)}%`)}
                      size={100}
                      thickness={5}
                      sx={{
                        transform: "translate(-50%, -50%)",
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
