import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import {
  FormHelperText,
  Avatar,
  Button,
  Grid,
  Paper,
  Typography,
  TextField,
  Link,
  CssBaseline,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast, ToastContainer } from "react-toastify";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { AuthContext } from "../store/Contexts/AuthContext";
import { AlertContext } from "../store/Contexts/AlertContext";
import { LoginSuccess, LoginFailure } from "../store/Actions/AuthAction";
import { AlertShow } from "../store/Actions/AlertAction";
// import { API_PATH } from '../utils/APIConstant';

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state ? location.state.from.pathname : "/";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    school: "",
    username: "",
    firstname: "",
    lastname: "",
    role: "",
    dob: "",
  });
  const [date, setDate] = useState(null);
  const [isMatchedPassword, setIsMatchedPassword] = useState(true);

  const { AuthDispatch, isLoading } = useContext(AuthContext);
  const { AlertDispatch } = useContext(AlertContext);

  const {
    email,
    password,
    passwordConfirm,
    username,
    firstname,
    lastname,
    role,
    dob,
    school,
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      if (password !== passwordConfirm) {
        setIsMatchedPassword(false);
      } else {
        setIsMatchedPassword(true);
        const res = await axios.post(
          "/auth/register",
          { email, password, username, firstname, lastname, role, dob, school }
        );
        AuthDispatch(LoginSuccess(res.data.token));
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      AlertDispatch(AlertShow(err.response.data.error));
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <ToastContainer />
      <CssBaseline />
      <Grid
        item
        xs={12}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={onChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="username"
              label="Username"
              type="username"
              id="username"
              autoComplete="username"
              value={username}
              onChange={onChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={onChange}
            />
            <FormControl error fullWidth variant="standard">
              <TextField
                margin="normal"
                required
                fullWidth
                name="passwordConfirm"
                label="Confirm Password"
                type="password"
                id="passwordConfirm"
                value={passwordConfirm}
                onChange={(e) => onChange(e)}
              />
              {!isMatchedPassword && (
                <FormHelperText
                  id="component-error-text"
                  error={!isMatchedPassword}
                >
                  Password Not Matched
                </FormHelperText>
              )}
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              name="school"
              label="School name"
              type="school"
              id="school"
              value={school}
              onChange={onChange}
            />
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="firstname"
                  label="Firstname"
                  type="name"
                  id="firstname"
                  autoComplete="name"
                  value={firstname}
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="lastname"
                  label="Lastname"
                  type="name"
                  id="lastname"
                  autoComplete="name"
                  value={lastname}
                  onChange={onChange}
                />
              </Grid>
            </Grid>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={6}>
                <Box sx={{ mt: 2 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      margin="normal"
                      required
                      value={date}
                      onChange={(newValue) => {
                        setDate(newValue);
                        setFormData({
                          ...formData,
                          dob: new Date(newValue).toLocaleDateString("en-GB"),
                        });
                      }}
                      inputFormat="dd/MM/yyyy"
                      name="dob"
                      label="Date of Birth"
                      type="dob"
                      id="dob"
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="role" sx={{ bgcolor: "white" }}>
                    Role
                  </InputLabel>
                  <Select
                    required
                    labelId="role"
                    id="role"
                    value={role}
                    onChange={(e) => onChange(e)}
                    name="role"
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="teacher">Teacher</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color="primary"
              disabled={isLoading}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <Link href="login" variant="body2">
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Register;
