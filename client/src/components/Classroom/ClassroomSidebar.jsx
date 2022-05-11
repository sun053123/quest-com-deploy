import React, { useContext, useEffect, useState } from "react";

import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Grow,
  Typography,
  Box,
  Divider,
  List
} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ClassIcon from '@mui/icons-material/Class';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import QuizIcon from '@mui/icons-material/Quiz';

import { useLocation, useNavigate, useParams, Link } from "react-router-dom";

import { AuthContext } from "../../store/Contexts/AuthContext";

const style = {
  width: '100%',
  maxWidth: 360,
  bgcolor: 'background.paper',
  backgroundColor: '#fafafa',
};

function ClassroomSidebar(props) {
  const { lessons } = props;
  const { classroomcreatorId } = props
  const { classroomId, lessonId } = useParams();
  const { userinfo } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [toggleLesson, setToggleLesson] = useState(-1);

  
  
  useEffect(() => {
    if(lessonId){
      mapLocationLessonIndex(lessonId)
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const mapLocationLessonIndex = (lessonId) => {

      // map location.path id to the current lesson id
      const lessonIndex = lessons.findIndex(lesson => lesson._id === lessonId)
      setToggleLesson(lessonIndex)
  }

  //onclick listitem do press

  

  // console.log(toggleLesson)
  // console.log(lessons[toggleLesson]?.quizIsReady)
  
  return (
    <Grow in={true}>
      <Box
        sx={{
          overflowY: "auto",
          width: "100%",
          //set text not out of box
          whiteSpace: "nowrap",
          overflowX: "hidden",
          textOverflow: "ellipsis",
        
          
        }}
      >

        <List sx={style} component="nav" aria-label="mailbox folders" >
          { userinfo?.role === true && userinfo?.id === classroomcreatorId && (
            <>
          <ListItemText sx={{
            textAlign: "center",
          }} >
            <Typography variant="h7" >
                Admin
            </Typography>
          </ListItemText>
          <Divider /> 

          <ListItem button sx={{
            backgroundColor: "wheat" ,
              height: "4.5rem"
            }}
            component={Link}
            to={`/classroom/${classroomId}/lesson/create`}>
              <ListItemIcon>
                 <BorderColorIcon /> 
              </ListItemIcon>
              <ListItemText primary="Create Lesson" />
            </ListItem>
            <Divider />
            
            <ListItem button sx={{
              backgroundColor: "white" ,
              height: "4.5rem"
            }}>
              <ListItemIcon>
                 <DashboardIcon /> 
              </ListItemIcon>
              <ListItemText primary="Dash Board" />
            </ListItem>
            <Divider /> 
            
            </>
            )}

            {/* ////////////////////////This component will apear on LESSON page ONLY //////////////////////// */}
            { userinfo?.role === true && userinfo?.id === lessons[0]?.creator.toString() && lessonId && (
              <>
              <ListItemText sx={{
                textAlign: "center",
              }} >
                <Typography variant="h7" >
                    Admin
                </Typography>
              </ListItemText>
              <Divider /> 
    
              <ListItem button sx={{
                backgroundColor: "wheat" ,
                  height: "4.5rem"
                }}
                component={Link}
                to={`/classroom/${classroomId}/lesson/edit/${lessonId}`}>
                  <ListItemIcon>
                     <BorderColorIcon /> 
                  </ListItemIcon>
                  <ListItemText primary="Edit Lesson" />
                </ListItem>
                <Divider />
                
                <ListItem button sx={{
                  backgroundColor: "white" ,
                  height: "4.5rem"
                }}
                onClick={() => navigate(`/classroom/${classroomId}/lesson/${lessonId}/quizcontroller`)}>
                  <ListItemIcon>
                     <DashboardIcon /> 
                  </ListItemIcon>
                  <ListItemText primary="Create Quiz" />
                </ListItem>
                <Divider /> 
                </>
            )}

          <ListItemText primary="Lesson" sx={{
            fontSize: "2rem",
            fontWeight: "bold",
            textAlign: "center",
          }} />
          <Divider /> 

          {/* ////////////////////////This component will apear on LESSON page ONLY //////////////////////// */}
          { lessonId ?  (
          <>
            <ListItem button sx={{
              backgroundColor: "white",
              height: "4.5rem"
            }}
              component={Link}
              to={`/classroom/${classroomId}`}>
              <ListItemIcon>
                <ArrowBackIosIcon />
              </ListItemIcon>
              <ListItemText primary="Go back classroom" />
            </ListItem>
            <Divider />
            <ListItem button sx={{
              backgroundColor: "white",
              height: "4.5rem"
            }}
              disabled={lessons[toggleLesson]?.quizIsReady === false}

              component={Link}
              to={`/classroom/${classroomId}/lesson/${lessonId}/quizgame`}>
              <ListItemIcon>
                <QuizIcon />
              </ListItemIcon>
              <ListItemText primary="QUIZ GAME" />
            </ListItem>
            <Divider />
            </> ) : null }

          { lessons && lessons?.map((lesson, index) => (
            <ListItem button key={lesson._id} sx={{
              backgroundColor: toggleLesson === index ? "grey.300" : "white",
              height: "4.5rem"
            }}
            onClick={
              () => {
                navigate(`/classroom/${classroomId}/lesson/${lesson._id}`)
                setToggleLesson(index)
              }}>
              <ListItemIcon>
               <ClassIcon /> 
              </ListItemIcon>
              <ListItemText primary={`${index+1}${" :"} ${lesson.title}`} />
            </ListItem >
            
          ))}
        </List>
      </Box>
    </Grow>
  );
}

export default ClassroomSidebar;
