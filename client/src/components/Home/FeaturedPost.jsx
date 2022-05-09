import * as React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
import { CardActions,Grow,Box, Typography, Grid, Card, CardActionArea, CardContent, CardMedia } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

import no_img from '../../assets/img/no_img.png'

function FeaturedPost(props) {
  const { classroom } = props;

  //console.log(classroom)
  let navigate = useNavigate();

  const routeChange = () => {
    navigate(`/classroom/${classroom._id}`)
  }

  return (
    <Grow in={true}>
    <Grid item xs={12} md={6}>
      <CardActionArea component="a" onClick={routeChange} >
        <Card sx={{ display: 'flex', maxWidth: 'auto', minHeight:'26vh'
        //on hover linear gredient blackground classroom.category 100% to transparent
        
        }
       }>
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5" sx={{
              //limit text

            }}>
              {classroom.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {classroom.creator.name}
            </Typography>
            <Typography variant="subtitle1" paragraph sx={{
              //limit tex
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              maxWidth: '100%',
              minHeight: '3rem',
              display: '-webkit-box',
              WebkitLineClamp: '4',
              WebkitBoxOrient: 'vertical',
              
            }}>
              {classroom.description}
            </Typography>
            <Typography variant="subtitle1" color={`${classroom.category}`} >
                      {classroom.category}
              </Typography>
                      {/* if time <= 3mins show New! */}
                      { moment(classroom.updatedAt) - new Date().getTime() >= -500000 && (
                    <CardActions sx={{
                      //stick with bottom card

                      position: "absolute",
                      bottom: "0",
                      left: "1",
                      right: "0",
                      display: "flex",
                      m:2,
                      alignItems: "center",
                      border: "none",
                      backgroundColor: `${classroom.category}`,
                      borderRadius: "5px",
                      boxShadow: "none",
                      color: "white",
                    }}>
                    <Typography
                    variant="body2"
                    fontWeight="bold"
                  >
                    New!
                  </Typography>

                  </CardActions>)}
                <CardActions>
                <Grid container>
                  <Grid item xs={6}>
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                      m:2,
                      mb:0,
      
                      borderRadius: "5px",
                      backgroundColor: `${classroom.category}`,
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "0.8rem",
                      fontFamily: "Roboto",
                      textTransform: "inherit",
                      textAlign: "center",
                      boxShadow: "none",
                      border: "none",
                      borderRadius: "5px",
                      p:1,

                    }}>
                      {classroom.category}
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      {moment(classroom.updatedAt).format("MMM Do YYYY")}
                    </Typography>
                  </Grid>
                </Grid>
                </CardActions>

          </CardContent>
          <CardMedia
            component="img"
            sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
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