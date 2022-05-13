import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { useQuery } from 'react-query'
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, ContentState, convertToRaw } from 'draft-js'
import { useParams, useNavigate } from 'react-router-dom'

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { Button, Grid, Box, Container, FormGroup, TextField, InputLabel, MenyItem, Select, FormControl, MenuItem, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import FileBase from 'react-file-base64';

import Preview from '../components/LessonCreate/Preview'
import LessonChecker from '../components/LessonCreate/LessonChecker'

import { AlertContext } from '../store/Contexts/AlertContext'
import { AlertShow } from '../store/Actions/AlertAction'

function LessonCreate() {

  const { AlertDispatch } = useContext(AlertContext)

  const { classroomId, lessonId } = useParams()
  const navigate = useNavigate()

  const [lessonForm, setLessonForm] = useState({
    title: '',
    content: '',
    lessonImg: '',
    isShowLessonImg: false,
    pdfFile: ''
  });

  const [id, setId] = useState('')
  const [isPassValidate, setIsPassValidate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false);
  const [isValidateLessonTitle, setIsPassValidateLessonTitle] = useState(false);
  const [isValidateLessonContent, setIsPassValidateLessonContent] = useState(false);
  const [isValidateLessonImg, setIsPassValidateLessonImg] = useState(false);
  const [isValidatePDF, setIsPassValidatePDF] = useState(false);

  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  useEffect(() => {
    if ( lessonId ) {
      setId(lessonId)
      setIsEditMode(true)
      getLessonData()
      validateLessonForm()
      validateCheck()
    }
  }, [])

  useEffect(() => {
    validateCheck()
    }, [isValidateLessonTitle, isValidateLessonContent])

  const getLessonData = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/classroom/${classroomId}/lesson/${lessonId}`)
    const { data } = res
      //convert html to draftjs
    const contentBlock = htmlToDraft(data.data.lesson.content);
    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    const editorState = EditorState.createWithContent(contentState);

    setLessonForm({
      title: data.data.lesson.title,
      content: data.data.lesson.content,
      lessonImg: data.data.lesson.lessonImg,
      isShowLessonImg: data.data.lesson.isShowLessonImg,
      pdfFile: data.data.lesson.lessonFile,
      })
      setEditorState(editorState)

      validateLessonForm()
    } catch (error) {
      console.log(error)
      AlertDispatch(AlertShow(error.response.data.error));
    }
  }

  const handleUpdateLesson = async () => {
    setIsLoading(true)
    try {
      const res = await axios.put(`http://localhost:8000/api/classroom/${classroomId}/lesson/${lessonId}`, 
      {
        title: lessonForm.title,
        content: lessonForm.content,
        lessonImg: lessonForm.lessonImg,
        isShowLessonImg: lessonForm.isShowLessonImg,
        pdfFile: lessonForm.pdfFile
      })
      setIsLoading(false)
      const { data } = res
      toast.success("The lesson has been updated successfully")
      console.log(data)
    } catch (error) {
      AlertDispatch(AlertShow(error.response.data.error, "danger"));
    }
  }

  const handleCreateLesson = async () => {
    setIsLoading(true)
    try {
      const res = await axios.post(`http://localhost:8000/api/classroom/${classroomId}/lesson`, lessonForm)
      const { data } = res
      console.log(data.lesson)
      toast.success("Created successfully")
      setIsLoading(false)

      //set url to change mode
      setIsEditMode(true)
      return navigate(`/classroom/${classroomId}/lesson/edit/${data.lesson._id}`)

        
    } catch (error) {
      AlertDispatch(AlertShow(error.response.data.error, "danger"));
    }
  }

  const onChange = (e) => {
    validateLessonForm()
    setLessonForm({
      ...lessonForm,
      [e.target.name]: e.target.value
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (isEditMode) {
      handleUpdateLesson()
    } else {
      handleCreateLesson()
    }
  }

  const validateCheck = () => {
    if (isValidateLessonContent && isValidateLessonContent) {
      setIsPassValidate(true)
    }else {
      setIsPassValidate(false)
    }
  }

  const validateLessonForm = () => {
    if (lessonForm.title.length <= 5) {
      setIsPassValidateLessonTitle(false)
    } else {
      setIsPassValidateLessonTitle(true)
    }

    if (lessonForm.lessonImg === '') {
      setIsPassValidateLessonImg(false)
    } else {
      setIsPassValidateLessonImg(true)
    }
    
    if (lessonForm.content.length <= 400) {
      setIsPassValidateLessonContent(false)
    } else {
      setIsPassValidateLessonContent(true)
    }
  }

  return (
    <>
    <ToastContainer />
      <Grid container spacing={0} sx={{ backgroundColor: "wheat" }}>
        <Typography variant="p" component="p" fontWeight={"regular"} color={"white"} ml={5}>
          Home
        </Typography>
        <Typography variant="p" component="p" fontWeight={"regular"} color={"white"} ml={5}>
          classroom
        </Typography>
      </Grid>
      <Grid container spacing={0} >
        {/* //////////////////// sidebar //////////////////// */}
        <Grid item xs={0.5} sx={{ backgroundColor: "#f7f9fc", display: "auto" }}>
          <LessonChecker validatorTitle={isValidateLessonTitle} validatorContent={isValidateLessonContent} validatorPDF={isValidatePDF} />
        </Grid>
        {/* //////////////////// Form //////////////////// */}
        <Grid item xs={5.5} sx={{ backgroundColor: "#f7f9fc" }}>
          <Container sx={{ backgroundColor: "white", borderRadius: "8px" }} >
            <Box
              component="form"
              noValidate
              sx={{ mt: 3, mb: 1 }}
            >
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {isEditMode ? 'Edit Lesson' : 'Create Lesson'}
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Clssroom Title"
                name="title"
                multiline
                autoFocus
                onChange={onChange}
                value={lessonForm.title}
              />
              <Box >
                <FormGroup

                  sx={{
                    display: "flex",
                    mt: 2,
                    mb: 5,
                    minHeight: "15vh",
                    maxHeight: "auto",
                    backgroundColor: "white",
                    //set border color
                    borderColor: "grey.300",
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderRadius: "5px",

                  }}>
                  < Editor
                    editorState={editorState}
                    wrapperClassName="card"
                    editorClassName="card-body"
                    onEditorStateChange={newState => {
                      onChange(
                        {
                          target: {
                            name: "content",
                            value: draftToHtml(convertToRaw(newState.getCurrentContent()))
                          }

                        })
                      setEditorState(newState)
                      
                      setLessonForm({
                        ...lessonForm,
                        content: draftToHtml(convertToRaw(newState.getCurrentContent())),
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
                </FormGroup>
              </Box>


              <Grid container spacing={1}>

                <Grid item xs={6} mt={2}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Lesson Image
                  </Typography>
                  <FileBase
                    value={lessonForm.lessonImg}
                    multiple={false}
                    onDone={(img) => {
                      //check file is img
                      if (img.type.startsWith('image')) {
                        setLessonForm({
                          ...lessonForm,
                          lessonImg: img.base64
                        })
                      }
                    }
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="isShowLessonImg" sx={{ bgcolor: "white" }}>
                      Show Title Image?
                    </InputLabel>
                    <Select
                      required
                      labelId="isShowLessonImg"
                      id="isShowLessonImg"
                      name="isShowLessonImg"
                      value={lessonForm.isShowLessonImg}
                      onChange={onChange}
                    >
                      <MenuItem value={true}>Title Background</MenuItem>
                      <MenuItem value={false}>plain Background</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Box mt={4} mb={3}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                PDF upload
              </Typography>
              <FileBase
                multiple={false}
                value={lessonForm.pdfFile}
                onDone={(file) => {
                  if (file.type === 'application/pdf') {
                    setIsPassValidatePDF(true)
                    setLessonForm({
                      ...lessonForm,
                      pdfFile: file.base64
                    })
                  }
                }}
              />
            </Box>
              < LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 1, mb: 2 }}
                disabled={!isPassValidate}
                loading={isLoading}
                onClick={onSubmit}
              >
                Submit Form
              </LoadingButton>
            </Box>
          </Container>
        </Grid>
        {/* //////////////////////////////////////// Preview //////////////////////////////////////// */}
        <Grid item xs={6} sx={{ backgroundColor: "green", height: "100vh", display: "flex" }}>
          <Preview lessonForm={lessonForm} isEditMode={isEditMode} lessonId={id}/>
        </Grid>
      </Grid>
    </>
  )
}

export default LessonCreate
