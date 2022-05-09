import React, { useState } from 'react'
import axios from 'axios'
import { useQuery } from 'react-query'
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, ContentState, convertToRaw } from 'draft-js'
import { useParams } from 'react-router-dom'

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";


import { Button, Grid, Box, Container, FormGroup } from '@mui/material'
import Preview from '../components/LessonCreate/Preview'
import LessonChecker from '../components/LessonCreate/LessonChecker'

function LessonCreate() {

  const { classroomId } = useParams()
 
  const [lessonForm, setLessonForm] = useState({
    title: '',
    content: '',
    lessonImg: '',
  });

  const [pdfFile, setPdfFile] = useState(null)
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const onChangePdfFile = (e) => {
    setPdfFile(e.target.files[0])
  }

  const onChange = (e) => {
    setLessonForm({
      ...lessonForm,
      [e.target.name]: e.target.value
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    console.log()
  }

  const onSubmitPdf = (e) => {
    e.preventDefault()
    console.log(pdfFile)
  }



  return (
    <>
      <Grid container spacing={0} >
        {/* //////////////////// sidebar //////////////////// */}
        <Grid item xs={0.5} sx={{
          backgroundColor: "red",
          display: "static",
        }}>
          <LessonChecker />
        </Grid>

        {/* //////////////////// Form //////////////////// */}
        <Grid item xs={5.5} sx={{ backgroundColor: "blue" }}>
        <Box sx={{ 
              mt: 2,
              display: "flex",
              flexDirection: "column",
              
              backgroundColor: "white",
             }} >

            <FormGroup>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={lessonForm.title}
                onChange={onChange}
                placeholder="Title"
              />
              <Box sx={{ 
              mt: 2,
              display: "flex",
              flexDirection: "column",
              minHeight: "50vh",
              maxHeight: "70vh",
              overflow: "auto",
              backgroundColor: "white",
             }} >
              <Editor
                editorState={editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={newState => {
                  setEditorState(newState)
                  setLessonForm({
                    ...lessonForm,
                    content: draftToHtml(convertToRaw(newState.getCurrentContent()))
                  })
                }}
                toolbar={{
                  options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'image', 'remove', 'history'],
                  inline: { inDropdown: true },
                  list: { inDropdown: true },
                  textAlign: { inDropdown: true },
                  colorPicker: { inDropdown: true },
                  link: { inDropdown: true },
                  emoji: { inDropdown: true },
                  history: { inDropdown: true },
                }} />
                </Box>

            </FormGroup>
            
            
            
            

          </Box>
        </Grid>
        <Grid item xs={6} sx={{ backgroundColor: "green", height: "100vh", display: "flex" }}>
          <Preview previewHTML={lessonForm.content} />
        </Grid>
      </Grid>

    </>
  )
}

export default LessonCreate