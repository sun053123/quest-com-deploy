import React from 'react'

import { Card, CardMedia, CardContent, CardActions, Grid, Typography, Button } from '@mui/material'

const options = ["tolead a beter life", "I need my love", "to be here", "tolead a beter life", "tolead a beter life", "to be there", "to be with you"]

function QuizCard(props) {
    const { card } = props;
  return (
  
  <Grid item key={card} xs={12} sm={6} md={4}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column'}}>
          <CardMedia
              component="img"
              image="https://source.unsplash.com/random"
              alt="random" 
              sx={{
                    height: '140px',
                    width: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    }}
              />
          <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2">
                  Heading
              </Typography>
              {options.map((option) => (
                  <Typography variant="body2" color="textSecondary" component="p">
                      {option}
                    </Typography>
                ))}
              
              <Typography>
                  This is a media card. You can use this section to describe the
                  content.
              </Typography>
          </CardContent>
          <CardActions>
              <Button size="small">View</Button>
              <Button size="small">Edit</Button>
          </CardActions>
      </Card>   
    </Grid>
  )
}

export default QuizCard