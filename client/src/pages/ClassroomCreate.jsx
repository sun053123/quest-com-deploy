import React,{useState, useEffect, useContext} from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import FileBase from 'react-file-base64';

import { AuthContext } from "../store/Contexts/AuthContext";
import { AlertContext } from "../store/Contexts/AlertContext";
import { AlertShow } from "../store/Actions/AlertAction";

import { Grow, Box, Grid, Typography, TextField, ListItem,ListItemText,List,Divider, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

import LoadingButton from '@mui/lab/LoadingButton';
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";
import ListItemIcon from "@mui/material/ListItemIcon";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

const style = {
  width: '100%',
  maxWidth: 'auto',
  bgcolor: 'background.paper',
  backgroundColor: '#fafafa',
};

const validTexts = ["Title", "Description", "Content", "Category", "Level"];

function ClassroomCreate() {

  let navigate = useNavigate();

  const { userinfo } = useContext(AuthContext);
  const { AlertDispatch } = useContext(AlertContext);

  const [progress, setProgress] = useState(0);
  const [isvalidateTitle, setIsvalidateTitle] = useState(false);
  const [isvalidateDescription, setIsvalidateDescription] = useState(false);
  const [isvalidateContent, setIsvalidateContent] = useState(false);
  const [isvalidateCategory, setIsvalidateCategory] = useState(false);
  const [isvalidateLevel, setIsvalidateLevel] = useState(false);
  const [isvalidateClassroomImg, setIsvalidateClassroomImg] = useState(false);
  const [isvalidateTags, setIsvalidateTags] = useState(false);
  const [isPassValidate, setIsPassValidate] = useState(false);

  

  const [_id, setId] = useState("");
  
  //set back to top 
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [classroomForm, setClassroomForm] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    level: "",
    tags: "",
    classroomImg: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState("");

  let { classroomId } = useParams();

  useEffect(() => {
    if (classroomId) {
      setId(classroomId);
      getClassroom(classroomId);
      validateCheckbox();
    }
    else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    validateCheckbox();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroomForm]);

  useEffect(() => {
    checkPassValidate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isvalidateTitle, isvalidateDescription, isvalidateContent, isvalidateCategory, isvalidateLevel]);

  const getClassroom = async (classroomId) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/classroom/${classroomId}`);
      const { classroom } = res.data.data;
      setClassroomForm({
        title: classroom.title,
        description: classroom.description,
        content: classroom.content,
        category: classroom.category,
        level: classroom.level,
        tags: classroom.tags.toString(),
        classroomImg: classroom.classroomImg,
      })
      setLoading(false);

      //not a creator classroom
      if(classroom.creator.user !== userinfo.id) {
        navigate("/home");
      }
    
    } catch (error) {
      setId("");

      //if error from mongoose validator id
      if (typeof error.response.data.lenght !== Array) {
        toast.error(error.response.data.error);
        setId("");
        navigate("/home");
      } else {
        //if error from service
        AlertDispatch(AlertShow(error.response.data.error, "error"));
        navigate("/home");
      }
      // setLoading(false);
      // setError(true);
      // AlertDispatch(AlertShow(error.response.data.message, "error"));
    }
  }

  const updateClassroom = async () => {
    setSaving(true);
    setLoading(true);
    try {
      const res = await axios.put(`http://localhost:8000/api/classroom/${_id}`, classroomForm);
      navigate(`/classroom/${res.data.classroom._id}`);
    } catch (error) {
      console.log(error);
      AlertDispatch(AlertShow(error.response.data.error, "error"));
    }
  }

  const createClassroom = async () => {
    setSaving(true);
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/classroom", classroomForm);
      navigate(`/classroom/${res.data.data.classroom._id}`);
    } catch (error) {

      AlertDispatch(AlertShow(error.response.data.error, "error"));
    }
  }


  const { title, description, content, category, level, tags, classroomImg } = classroomForm;

  const validateCheckbox = () => {
    if (title.length >= 5) {
      setIsvalidateTitle(true);
    }else{
      setIsvalidateTitle(false);
    }
    if (description.length >= 15) {
      setIsvalidateDescription(true);
    }else{
      setIsvalidateDescription(false);
    }
    if (content.length >= 20) {
      setIsvalidateContent(true);
    }else{
      setIsvalidateContent(false);
    }
    if (category !== "" && category !== null) {
      setIsvalidateCategory(true);
    }else{
      setIsvalidateCategory(false);
    }
    if (level !== "" && level !== null) {
      setIsvalidateLevel(true);
    }else{
      setIsvalidateLevel(false);
    }
    // not in passvalidate field
    if (tags.length >= 1) {
      setIsvalidateTags(true);
    }else{
      setIsvalidateTags(false);
    }
    if (classroomImg !== "" && classroomImg !== null && classroomImg !== undefined) {
      setIsvalidateClassroomImg(true);
    }else{
      setIsvalidateClassroomImg(false);
    }
  }

  const checkPassValidate = () => {
    if (isvalidateTitle === true 
      && isvalidateDescription === true
      && isvalidateContent === true
      && isvalidateCategory === true
      && isvalidateLevel === true) {
      setIsPassValidate(true);
    }else{
      setIsPassValidate(false);
    }
  }


  const onChange = (e) => {
    setClassroomForm({
      ...classroomForm,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if(_id && _id !== "" && _id != null) {
      updateClassroom();
    }else {
      createClassroom();
    }

  };


  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline />
      <ToastContainer />
      <Grid container spacing={0}>
        {/* classroom title */}
        <Grid item xs={2} > 
          <Grow in={true}>
            <Box
              sx={{
                //column
                display: "flex",
                flexDirection: "column",
                height: "120vh",
                backgroundColor: "white",
              }}
            >
              <Box
                sx={{
                  //column
                  display: "flex",
                  flexDirection: "row",
                  width: "auto",
                  height: "12vh",

                  //if pass allvalidate change color to green from red
                  backgroundColor: !isPassValidate ? "#e57373" : "#3caf50",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">
                    Classroom Form
                </Typography>
              </Box>
              <List sx={style} component="nav" aria-label="mailbox folders">
                <ListItemText
                  sx={{
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h7">Validation Check</Typography>
                </ListItemText>
                <Divider />
                {[
                  isvalidateTitle,
                  isvalidateDescription,
                  isvalidateContent,
                  isvalidateCategory,
                  isvalidateLevel,
                ].map((item, index) => {
                  return (
                    <ListItem
                      key={index}
                      button
                      sx={{
                        backgroundColor: item ? "#3caf50" : "#e57373",
                        height: "4.5rem",
                      }}
                    >
                      <ListItemIcon>
                        {item ? (
                          <CheckCircleIcon />
                        ) : (
                          <CircleOutlinedIcon />
                        )}
                  
                      </ListItemIcon>
                      <ListItemText>
                        <Typography
                          variant="h7"
                          sx={{ display: { xs: "none", sm: "flex" } }}
                        >
                          {validTexts[index]}
                        </Typography>
                      </ListItemText>
                      <ListItemText
                        primary={item ? "pass" : "valid"}
                        sx={{ display: { xs: "none", sm: "flex" }
                        //stick at right
                        , justifyContent: "flex-end"
                       }}
                      />
                    </ListItem>
                  );
                })}
                <Divider />
                <ListItem
                  button
                  sx={{
                    backgroundColor: isvalidateTags ? "#3caf50" : "wheat",
                    height: "4.5rem",
                  }}
                >
                  <ListItemIcon>
                    {isvalidateTags ? (
                      <CheckCircleIcon />
                    ) : (
                      <CircleOutlinedIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText>
                    <Typography
                      variant="h7"
                      sx={{ display: { xs: "none", sm: "flex" } }}
                    >
                      Tags
                    </Typography>
                    
                  </ListItemText>
                </ListItem>
                <ListItem
                  button
                  sx={{
                    backgroundColor: isvalidateClassroomImg
                      ? "#3caf50"
                      : "wheat",
                    height: "4.5rem",
                  }}
                >
                  <ListItemIcon>
                  {isvalidateClassroomImg ? (
                      <CheckCircleIcon />
                    ) : (
                      <CircleOutlinedIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText>
                    <Typography
                      variant="h7"
                      sx={{ display: { xs: "none", sm: "flex" } }}
                    >
                      Classroom Image
                    </Typography>
                    
                  </ListItemText>
                </ListItem>
              </List>
            </Box>
          </Grow>
        </Grid>

        {/* ///////////////////////// classroom body ///////////////////////// */}
        <Grid item xs={10}>
          <Box
            sx={{
              //column
              display: "flex",
              flexDirection: "column",
              height: "120vh",
              backgroundColor: "#fafafa",
              
            }}
          >
            <Container
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                mt: "2vh",
                borderRadius: "5px",
                padding: "1rem",
                boxShadow: "0px 0px 2px #e0e0e0",
              }}
            >
              <Box
                sx={{
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {_id !== "" ? (
                  <Typography variant="h4" gutterBottom fontWeight={"bold"}>
                    Update classroom
                  </Typography>
                ) : (
                  <Typography variant="h4" gutterBottom fontWeight={"bold"}>
                    Create a new classroom
                  </Typography>
                )}

                <Grid container mt={8}>
                  <Grid item xs>
                    <Typography variant="h8">
                      Email : {userinfo.email}
                    </Typography>
                    <br />
                    <Typography variant="h8">
                      Username : {userinfo.username}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <h5 variant="body2">{moment().format("DD/MM/YYYY")}</h5>
                  </Grid>
                </Grid>

                {/*//////////// MAIN FORM /////////////////*/}
                <Box
                  component="form"
                  // onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1, mb: 2 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="title"
                    label="Clssroom Title"
                    name="title"
                    value={classroomForm.title}
                    multiline
                    onChange={onChange}
                    autoFocus
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="description"
                    label="Classroom Description"
                    multiline
                    maxRows={4}
                    minRows={2}
                    value={classroomForm.description}
                    name="description"
                    onChange={onChange}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="content"
                    label="Classroom Content"
                    name="content"
                    multiline
                    value={classroomForm.content}
                    onChange={onChange}
                    maxRows={12}
                    minRows={6}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="tags"
                    label="Classroom tags"
                    name="tags"
                    value={classroomForm.tags}
                    onChange={onChange}
                  />
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel id="gender" sx={{ bgcolor: "white" }}>
                          Category
                        </InputLabel>
                        <Select
                          required
                          labelId="category"
                          id="category"
                          value={classroomForm.category}
                          onChange={onChange}
                          name="category"
                        >
                          <MenuItem value="science">Science</MenuItem>
                          <MenuItem value="math">Math</MenuItem>
                          <MenuItem value="english">English</MenuItem>
                          <MenuItem value="social">Social</MenuItem>
                          <MenuItem value="computer">Computer</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel id="gender" sx={{ bgcolor: "white" }}>
                          Level
                        </InputLabel>
                        <Select
                          required
                          labelId="level"
                          id="level"
                          value={classroomForm.level}
                          onChange={onChange}
                          name="level"
                        >
                          <MenuItem value="beginner">Beginner</MenuItem>
                          <MenuItem value="advanced">Advanced</MenuItem>
                          <MenuItem value="intermediate">Intermediate</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Box mt={2}>
                <FileBase 
                    multiple={false}
                    // type="file"
                    type="image/*"
                    onDone={({base64}) => setClassroomForm({...classroomForm, classroomImg: base64})}
                    inputProps={{ accept: 'image/*, jpg, jpeg, png' }}
                    
                />
                </Box>
                  
                  < LoadingButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={!isPassValidate}
                    onClick={handleSubmit}
                    loading={loading}
                  >
                    Submit Form
                  </LoadingButton>
                </Box>
              </Box>
            </Container>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ClassroomCreate;
