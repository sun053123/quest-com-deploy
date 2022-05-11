import { Typography, Box, Grid, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'

import TitleIcon from '@mui/icons-material/Title';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

function LessonChecker(props) {
    const { validatorTitle, validatorContent, validatorPDF } = props

  return (
    <Grid sx={{ mt: 2, display: "flex", flexDirection: "column", backgroundColor: "#f7f9fc", height: "50vh", justifyContent: "center" }} >
      <List>
        <ListItem>
          <ListItemIcon sx={{ 
            borderRadius: "8px",
            width: "40px",
            height: "40px",
            alignItems: "center",
            display: "flex",
            }}>
            <TitleIcon sx={{
              color: "gray",
              opacity: validatorTitle ? 1 : 0.3,
            }} />
          </ListItemIcon>
        </ListItem>
        <ListItem>
          <ListItemIcon sx={{ 
            borderRadius: "8px",
            width: "40px",
            height: "40px",
            alignItems: "center",
            display: "flex",
            }}>
            <FormatAlignJustifyIcon sx={{
              color: "gray",
              opacity: validatorContent ? 1 : 0.3,
            }} />
          </ListItemIcon>
        </ListItem>
        <ListItem>
          <ListItemIcon sx={{ 
            borderRadius: "8px",
            width: "40px",
            height: "40px",
            alignItems: "center",
            display: "flex",
            }}>
            <PictureAsPdfIcon sx={{
              color: "gray",
              opacity: validatorPDF ? 1 : 0.3,
            }} />
          </ListItemIcon>
        </ListItem>
      </List>

    </Grid>

  )
}

export default LessonChecker