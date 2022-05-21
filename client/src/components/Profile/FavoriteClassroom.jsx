import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import moment from "moment";
import CircleIcon from '@mui/icons-material/Circle';
import no_img from "../../assets/img/no_img.png";

import {
  Toolbar,
  CardActionArea,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grow,
  CardActions,
} from "@mui/material";

function FavoriteClassroom(props) {
  const { favoriteClassroom } = props

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
        <Typography variant="h5" fontWeight="bold" gutterBottom color="text" ml={3}>
          Favorite Classroom
        </Typography>
        {/* <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ justifyContent: 'space-between', overflowX: 'auto' }} > */}
        <Toolbar
          component="nav"
          variant="dense"
          sx={{ justifyContent: "space-between", overflowX: "auto" }}
        >
          {favoriteClassroom.map((fav, index) => (
            <Grid
              item
              key={fav._id}
              sx={{
                marginRight: "20px",
              }}
            >
              <CardActionArea component="a" onClick={
                () => navigate(`/classroom/${fav._id}`)}  
              >
                <Card sx={{ display: "flex", minWidth:"50vh", maxWidth:"80vh", minHeight:"24vh", maxHeight:"24vh", mt:2, mb:2 }} >
                  <CardContent sx={{ flex: 1 }}>
                 
                    <Typography
                      component="h2"
                      variant="h5"
                      sx={{
                        //limit text
                        textOverflow: 'ellipsis',
                        textTrim: 'word',
                        
                        //limt only 2 lines
                        overflow: 'hidden',
                        maxWidth: '100%',
                        display: '-webkit-box',
                        WebkitLineClamp: '2',
                        WebkitBoxOrient: 'vertical',
                        
                      }}
                    >
                      {fav.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {fav.category}
                    </Typography>
                    <Typography variant="subtitle1" paragraph sx={{
                        //limit text
                        textOverflow: 'ellipsis',
                        textTrim: 'word',
                        display: '-webkit-box',
                        WebkitLineClamp: '2',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                      {fav.description}
                    </Typography>
                    <Typography variant="subtitle1" color={`${fav.category}`} >
                      {fav.category}
                    </Typography>
                    
                    {/* if time <= 5mins show New! */}
                    { moment(fav.updatedAt) - new Date().getTime() >= -500000 && (
                    <CardActions sx={{
                      //stick with bottom card

                      position: "absolute",
                      bottom: "0",
                      left: "1",
                      right: "0",
                      display: "flex",
                      m:2,
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "none",
                      backgroundColor: `${fav.category}`,
                      borderRadius: "5px",
                      boxShadow: "none",
                      color: "white",
                      textTransform: "inherit",
                    }}>
                    <Typography
                    variant="body2"
                    fontWeight="bold"
                  >
                    New!
                  </Typography>

                  </CardActions>)}
                  </CardContent>
                  <CardMedia
                    component="img"
                    label="Image"
                    sx={{ width: 160, display: { xs: "none", sm: "block" }, maxHeight: '20vh', maxWidth: '25vh' }}
                    image={
                      fav.classroomImg
                        ? fav.classroomImg
                        : no_img
                    }
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




export default FavoriteClassroom;
