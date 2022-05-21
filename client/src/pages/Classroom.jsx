import React, { useState, useContext } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import moment from "moment";

import {
  Paper,
  CssBaseline,
  Box,
  Grid,
  Grow,
  Typography,
  Button,
  Modal,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";

import { AlertContext } from "../store/Contexts/AlertContext";
import { AlertShow } from "../store/Actions/AlertAction";
import { AuthContext } from "../store/Contexts/AuthContext";

import ClassroomSidebar from "../components/Classroom/ClassroomSidebar";
import LoadingPage from "../components/LoadingPage";
import ErrorPage from "../components/ErrorPage";
import ClassroomBody from "../components/Classroom/ClassroomBody";
import ClassroomContent from "../components/Classroom/ClassroomContent";
import NoPage from "./NoPage";
import ClassroomPathbar from "../components/Classroom/ClassroomPathbar";

function Classroom() {
  const { userinfo } = useContext(AuthContext);
  const { AlertDispatch } = useContext(AlertContext);

  const [classroom, setClassroom] = useState({});
  const [lessons, setLessons] = useState([]);

  //search params
  let { classroomId } = useParams();
  let navigate = useNavigate();

  //modal delete classroom
  const [openmodal, setOpenmodal] = React.useState(false);
  const handleOpen = () => setOpenmodal(true);
  const handleClose = () => setOpenmodal(false);
  const handleNavigateToEditClassroom = () => {
    navigate(`/classroom/edit/${classroomId}`);
  };

  //use react-query to get data from server
  const { isLoading, isError, isSuccess } = useQuery(
    ["single_classroom", classroomId],
    async () => await axios.get(`/classroom/${classroomId}`),
    {
      retry: false,
      refetchOnWindowFocus: false,
      //retechOnmount to false when using staletime
      refetchOnMount: true,
      // initialData: {
      //   data: {
      //     classroom: {},
      //     lessons: [],
      //   },
      // },
      //initial data for query (page will not trytofetch from backend)
      // set 3 mins as the default stale time
      onSuccess: (data) => {
        setClassroom(data.data.data.classroom);
        setLessons(data.data.data.lessons);
      },
      onError: (error) => {
        AlertDispatch(AlertShow(error.response.data.error));
      },
    }
  );

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return navigate('/loading');
  }

  // delete classroom
  const handleDeleteClassroom = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/classroom/${classroomId}`);
      handleClose();
      navigate("/");
    } catch (error) {
      AlertDispatch(AlertShow(error.response.data.error));
    }
  };

  const handleFavortieClassroom = async () => {
    try {
      await axios.put(`http://localhost:8000/api/profile/favorite/${classroomId}`);
      AlertDispatch(AlertShow([{ msg: "Classroom added to favorite", type: "success" }]));
    } catch (error) {
      AlertDispatch(AlertShow(error.response.data.error));
    }
  };

  if (isSuccess && lessons && classroom) {
    return (
      <>
      <ToastContainer />
        <CssBaseline />

        {/* CLASSROOM HEADER */}
        <Box
          sx={{
            display: "flex",
            background: "wheat",
            colorText: "text",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ClassroomPathbar classroomStatus={classroom?.isComplete} />
        </Box>

        {/* CLASSROOM BODY */}
        <Grid container spacing={0}>
          {/* Left Side bar */}
          <Grid
            item
            xs={2}
            sx={{
              display: "flex",
              height: "100vh",
              //fix position of sidebar
            }}
          >
            <ClassroomSidebar
              lessons={lessons}
              classroomcreatorId={classroom?.creator?.user}
            />
          </Grid>

          {/* Main Classroom */}
          <Grid
            item
            xs={8}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              backgroundColor: "#fafafa",
            }}
          >
            <Box
              sx={{
                display: "flex",
                padding: "20px",
              }}
            >
              <ClassroomBody classroom={classroom} />
            </Box>
          </Grid>

          {/* Right Side bar */}
          <Grid
            item
            xs
            sx={{
              alignItems: "center",
              alignContent: "center",
              backgroundColor: "#fafafa",
            }}
          >
            {/* Modal Delete Classroom */}
            <Modal
              open={openmodal}
              onClose={handleClose}
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
                  This will permanently delete the whole classroom and all its
                  lessons.
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
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "red", color: "white" }}
                    onClick={handleDeleteClassroom}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Modal>

            {/* ADMIN TOOL CREATOR ONLY */}
            {classroom?.creator?.user === userinfo.id && (
              <Box marginTop={2}>
                <Typography variant="h6" gutterBottom>
                  Admin Tools
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "wheat", mr: 2 }}>
                  <Grid
                    container
                    spacing={2}
                    columns={16}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "yellow", color: "text" }}
                        onClick={handleNavigateToEditClassroom}
                      >
                        <HistoryEduIcon />
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "red", color: "white" }}
                        onClick={handleOpen}
                      >
                        <DeleteIcon />
                      </Button>
                    </Grid>
                  </Grid>
                  <Typography>{classroom?.name}</Typography>
                </Paper>
              </Box>
            )}
            {/* END ADMIN TOOL CREATOR ONLY */}
            {/* STUDENT FAVORITE ICON */}
            {classroom?.creator?.user !== userinfo.id && (
              <Box marginTop={2}>
                <Typography variant="h6" gutterBottom>
                  Favorite
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "wheat", mr: 2 }}>
                  
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "pink", color: "text", }}

                        onClick={handleFavortieClassroom}
                      >
                        <FavoriteIcon />
                      </Button>
                    </Box>
                    
                </Paper>
              </Box>
            )}
            <Grow in={true}>
              <div>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Last Update
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.200", mr: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Updated At
                  </Typography>
                  {/*get moment date now */}
                  <Typography>
                    {moment(classroom?.updatedAt).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  </Typography>
                </Paper>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Creator
                </Typography>
                <Paper
                  elevation={0}
                  sx={{ p: 2, bgcolor: "grey.200", mr: 2, mb: 2 }}
                >
                  <Typography variant="h6" gutterBottom>
                    Username
                  </Typography>
                  {classroom?.creator?.name === null ? (
                    <Typography>Not Set</Typography>
                  ) : (
                    <Typography>{classroom?.creator?.name}</Typography>
                  )}
                </Paper>

                {/* map tags and join , */}
                {classroom?.tags?.map((tag, index) => (
                <Typography key={index} variant="h7" gutterBottom >
                  {tag}
                  {index === classroom?.tags?.length - 1 ? "" : ", "}
                </Typography>
              ))}
                <Typography variant="h6" gutterBottom>
                  Report
                </Typography>
              </div>
            </Grow>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default Classroom;
