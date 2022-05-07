import React from "react";

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

import { useLocation, useNavigate } from "react-router-dom";


// const lessons = [
//   {
//     _id: "string",
//     title: "string",
//     description: "string",
//   },
//   {
//     _id: "string",
//     title: "string",
//     description: "string",
//   },
//   {
//     _id: "string",
//     title: "string",
//     description: "string",
//   },
//   {
//     _id: "string",
//     title: "string",
//     description: "string",
//   },
//   {
//     _id: "string",
//     title: "string",
//     description: "string",
//   },
//   {
//     _id: "string",
//     title: "string",
//     description: "string",
//   },
//   {
//     _id: "string",
//     title: "string",
//     description: "string",
//   },
//   {
//     _id: "string",
//     title: "string",
//     description: "string",
//   },
//   {
//     _id: "string",
//     title: "string",
//     description: "string",
//   },
//   {
//     _id: "string",
//     title: "string",
//     description: "string",
//   },
//   {
//     _id: "string",
//     title: "string",
//     description: "string",
//   },
//   {
//     _id: "string",
//     title: "string",
//     description: "string",
//   },
//   {
//     _id: "string",
//     title: "string",
//     description: "string",
//   },
//   {
//     _id: "string",
//     title: "string",
//     description: "string",
//   },
//   {
//     _id: "string",
//     title: "string",
//     description: "string",
//   },
// ];


const style = {
  width: '100%',
  maxWidth: 360,
  bgcolor: 'background.paper',
  backgroundColor: '#fafafa',
};

function ClassroomSidebar(props) {
  const { lessons } = props;
  const location = useLocation();
  const navigate = useNavigate();

  console.log(lessons)

  return (
    <Grow in={true}>
      <Box
        sx={{
          overflowY: "auto",
          width: "100%",
        }}
      >
        <List sx={style} component="nav" aria-label="mailbox folders" >
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
            }}>
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
          <ListItemText primary="Lesson" sx={{
            fontSize: "2rem",
            fontWeight: "bold",
            textAlign: "center",
          }} />
          <Divider />
          { lessons && lessons?.map((lesson, index) => (
            <ListItem button key={lesson._id} sx={{
              backgroundColor: "white",
              height: "4.5rem"
            }}>
              <ListItemIcon>
               <ClassIcon /> 
              </ListItemIcon>
              <ListItemText primary={`${index+1} ${lesson.title}`} />
            </ListItem >
            
          ))}
        </List>
      </Box>
    </Grow>
  );
}

export default ClassroomSidebar;
