import * as React from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, Card, CardActionArea, CardContent, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// import NOIMG from '../../assets/img/no-image.png'

function FeaturedPost(props) {
  const { classroom } = props;

  //console.log(classroom)
  let navigate = useNavigate();

  const routeChange = () => {
    navigate(`/classroom/${classroom._id}`)
  }

  return (
    <Grid item xs={12} md={6}>
      <CardActionArea component="a" onClick={routeChange}>
        <Card sx={{ display: 'flex' }}>
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
            <Typography variant="subtitle1" paragraph>
              {classroom.description}
            </Typography>
            <Typography variant="subtitle1" color="primary">
              Continue reading...
            </Typography>
          </CardContent>
          <CardMedia
            component="img"
            sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
            image={classroom.classroomImg ? classroom.classroomImg : 'https://source.unsplash.com/photos/JpTY4gUviJM'}
          // alt={classes.imageLabel}
          />
        </Card>
      </CardActionArea>
    </Grid>
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