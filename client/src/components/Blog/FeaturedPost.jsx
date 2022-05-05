import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

// import NOIMG from '../../assets/img/no-image.png'

function FeaturedPost(props) {
  const { classroom } = props;

//   console.log(classroom)

  const HandleOnClick = () => {
    window.location.href = `/classroom/${classroom.id}`
    }

  return (
    <Grid item xs={12} md={6}>
      <CardActionArea component="a" href="#">
        <Card sx={{ display: 'flex' }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5">
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
            image={classroom.classroomImg? classroom.classroomImg : 'https://source.unsplash.com/photos/JpTY4gUviJM'}
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