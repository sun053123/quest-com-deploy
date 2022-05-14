import * as React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import {
  CardActions,
  Grow,
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

import no_img from "../../assets/img/no_img.png";

function FeaturedPost(props) {
  const { classroom } = props;

  //console.log(classroom)
  let navigate = useNavigate();

  const routeChange = () => {
    navigate(`/classroom/${classroom._id}`);
  };

  return (
    <Grow in={true}>
      <Grid item xs={12} md={6}>
        <CardActionArea component="a" onClick={routeChange}>
          <Card
            sx={{
              display: "flex",
              maxWidth: "auto",
              minHeight: "26vh",
              maxHeight: "35vh",
            }}
          >
            <CardContent sx={{ flex: 1 }}>
              <Typography
                component="h2"
                variant="h5"
                sx={{
                  //limit text
                  textOverflow: "ellipsis",
                  textTrim: "word",

                  //limt only 2 lines
                  overflow: "hidden",
                  maxWidth: "100%",
                  display: "-webkit-box",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {classroom.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {classroom.creator.name}
              </Typography>
              <Typography
                variant="subtitle1"
                paragraph
                sx={{
                  //limit tex
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  maxWidth: "100%",
                  minHeight: "3rem",
                  display: "-webkit-box",
                  WebkitLineClamp: "3",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {classroom.description}
              </Typography>
              {/* if time <= 3mins show New! */}
              {/* use UpdatedAt for feedback is quite bad , because when new student join a class its gonna update the classroom.updatedAt */}
              {moment(classroom.createdAt) - new Date().getTime() >=
                -500000 && (
                <CardActions
                  sx={{
                    //stick with bottom card

                    position: "absolute",
                    bottom: "0",
                    left: "1",
                    right: "0",
                    display: "flex",
                    m: 2,
                    alignItems: "center",
                    border: "none",
                    backgroundColor: "red",
                    borderRadius: "5px",
                    boxShadow: "none",
                    color: "white",
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    New!
                  </Typography>
                </CardActions>
              )}
              <CardActions
                sx={{
                  //bottom of card content
                  height: "10%",
                  position: "absolute",
                  top: "0",
                  left: "1",
                  right: "0",
                  display: {xs: "none", sm: "flex"},
                  m: 2,
                  alignItems: "center",
                  border: "none",
                  backgroundColor: (`${classroom.category}`),
                  //background color opacity
                  borderRadius: "2px",
                  boxShadow: "none",
                  color: "white",
                  textTransform: "inherit",
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  {moment(classroom.createdAt).fromNow()}
                </Typography>
              </CardActions>
              <CardActions sx={{
                //bottom of card content
                height: "10%",
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "1",
                display: "flex",
                m: 2,
                alignItems: "center",
                border: "none",                //background color opacity
                borderRadius: "2px",
                boxShadow: "none",
                color: "white",
                textTransform: "inherit",

              }}>
                <Grid container spacing={2}>
                  <Grid item >
                    <Typography variant="body2" fontWeight="bold" sx={{
                    flex: 1,
                      borderRadius: "2px",
                      padding: "0.5rem",
                    backgroundColor: (`${classroom.category}`),

                  }}>
                      {classroom.category}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" fontWeight="bold" sx={{
                      flex: 1,
                      borderRadius: "2px",
                      padding: "0.5rem",
                    backgroundColor: (`${classroom.category}`),
                    }}>
                      {classroom.lessonCount} lessons
                    </Typography>
                  </Grid>
                </Grid>
              </CardActions>
            </CardContent>
            <CardMedia
              component="img"
              sx={{ width: 160, display: { xs: "none", sm: "block" } }}
              image={classroom.classroomImg ? classroom.classroomImg : no_img}
              // alt={classes.imageLabel}
            />
          </Card>
        </CardActionArea>
      </Grid>
    </Grow>
  );
}

FeaturedPost.propTypes = {
  classroom: PropTypes.shape({
    category: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    // classroomImg: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default FeaturedPost;
