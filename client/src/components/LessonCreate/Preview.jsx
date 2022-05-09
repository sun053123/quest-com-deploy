import { Box, FormGroup } from '@mui/material'
import React from 'react'

function Preview(props) {
  const { previewHTML } = props
  return (
    <Box width="100%" component={'nav'}  display="flex" sx={{
        overflowY: "auto",
        width: "100%",
        //column
        flexDirection: "column",
    }}> 

<FormGroup>
                        <h1>Preview</h1>
                        <div className="border ql-container p-2">
                            <div 
                                dangerouslySetInnerHTML={{ 
                                    __html: previewHTML
                                }} 
                            />
                        </div>
                    </FormGroup>
        
        
    </Box>
  )
}

export default Preview