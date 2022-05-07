import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import PropTypes from 'prop-types';

import {
  Toolbar,
  CardActionArea,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grow
} from "@mui/material";

function OwnClassroom(props) {
  const { ownclassrooms } = props

  let navigate = useNavigate();


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
        <Typography variant="h5" fontWeight="regular" gutterBottom color="secondary">
          My Classrooms
        </Typography>
        {/* <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ justifyContent: 'space-between', overflowX: 'auto' }} > */}
        <Toolbar
          component="nav"
          variant="dense"
          sx={{ justifyContent: "space-between", overflowX: "auto" }}
        >
          {ownclassrooms.map((ownclassroom, index) => (
            <Grid
              item
              xs={2}
              sm={4}
              md={4}
              key={index}
              sx={{
                marginRight: "20px",
              }}
            >
              <CardActionArea component="a" onClick={
                () => navigate(`/classroom/${ownclassroom._id}`)}  
              >
                <Card sx={{ display: "flex" }} >
                  <CardContent sx={{ flex: 1 }}>
                    <Typography
                      component="h2"
                      variant="h5"
                      sx={{
                        //limit text
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ownclassroom.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {ownclassroom.category}
                    </Typography>
                    <Typography variant="subtitle1" paragraph sx={{
                        //limit text
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        textTrim: 'word',
                        display: '-webkit-box',
                        WebkitLineClamp: '2',
                        WebkitBoxOrient: 'vertical',
                        
                      }}>
                      {ownclassroom.description}
                    </Typography>
                    <Typography variant="subtitle1" color={`${ownclassroom.category}`} component={Link} to={`/home?category=${ownclassroom.category}`}>
                      {ownclassroom.category}
                    </Typography>
                  </CardContent>
                  <CardMedia
                    component="img"
                    sx={{ width: 160, display: { xs: "none", sm: "block" } }}
                    image={
                      ownclassroom.classroomImg
                        ? ownclassroom.classroomImg
                        : "https://source.unsplash.com/photos/JpTY4gUviJM"
                    }
                    // alt={classes.imageLabel}
                  />
                </Card>
              </CardActionArea>
            </Grid>
          ))}
        </Toolbar>
      </Container>
    </Grow>
  );
}

// OwnClassroom.propTypes = {
//   ownclassrooms: PropTypes.arrayOf({
//     creator: PropTypes.object.isRequired,
//     _id: PropTypes.string.isRequired,
//     title: PropTypes.string.isRequired,
//     description: PropTypes.string.isRequired,
//     category: PropTypes.string.isRequired,
//     level: PropTypes.string.isRequired,
//     updatedAt: PropTypes.string.isRequired,
//     createdAt: PropTypes.string.isRequired,
//     studentCount: PropTypes.number.isRequired,
//     lessonCount: PropTypes.number.isRequired,
//     isComplete: PropTypes.bool.isRequired,
//     tags: PropTypes.arrayOf(PropTypes.string).isRequired,
//   }).isRequired,
// };

OwnClassroom.propTypes = {
  ownclassrooms: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default OwnClassroom;
