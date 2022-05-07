import * as React from 'react';
import PropTypes from 'prop-types';
import { Grow, Typography, Grid, Card, CardActionArea, CardContent, CardMedia } from '@mui/material';
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
        <Card sx={{ display: 'flex', minHeight: '25vh', maxHeight:'30vh' }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5" sx={{
              //limit text
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}>
              {classroom.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {classroom.category}
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
              {classroom.description}
            </Typography>
            <Typography variant="subtitle1" color={`${classroom.category}`} >
                      {classroom.category}
              </Typography>
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