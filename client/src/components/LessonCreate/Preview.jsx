import { Box } from '@mui/material'
import React from 'react'

function Preview() {
  return (
    <Box width="100%" component={'nav'}  display="flex" sx={{
        overflowY: "auto",
        width: "100%",
        //column
        flexDirection: "column",
    }}> 

    {[1,2,3,4,5,6,7,8,0,0,0,0,0,0,0,9,123,123,2,2,2,2,2,2,2,2].map((item, index) => {
        return ( <Box key={index} width="100%" height="100px" display="flex" justifyContent="center" alignItems="center" >
            <Box width="100%"  display="flex"  sx={{backgroundColor:'pink'}}>
            <h1>sadad</h1>
        </Box>
        </Box>)
    })}
        
        
    </Box>
  )
}

export default Preview