import { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';


import { Avatar, Button, Grid, Paper, Typography, TextField, Link, CssBaseline, Box } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'react-slideshow-image/dist/styles.css'

import { AuthContext } from '../store/Contexts/AuthContext';
import { AlertContext } from '../store/Contexts/AlertContext';
import { LoginStart, LoginSuccess, LoginFailure } from '../store/Actions/AuthAction';
import { AlertShow } from '../store/Actions/AlertAction';
// import { API_PATH } from '../utils/APIConstant';

import slide1 from '../assets/img/slide1.jpg';
import slide2 from '../assets/img/slide2.jpg';
import slide3 from '../assets/img/slide3.jpg';

import GoogleLogin from 'react-google-login';

function randomImageBanner() {
  const min = 0;
  const images = [ slide1 , slide2 , slide3 ];
  const randomIndex = Math.floor(Math.random() * ((images.length - 1) - min + 1) + min)
  return images[randomIndex];
}


function Login() {
	const location = useLocation();
  const [imageslide, setImageslide] = useState('');

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	})

  useEffect(() => {
    return setImageslide(randomImageBanner())
    
  }, [setImageslide])
  

	const { AuthDispatch, isLoading } = useContext(AuthContext);
	const { alerts, AlertDispatch } = useContext(AlertContext);

	console.log("alerts on login page", alerts);

	const { email, password } = formData;

	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async (e) => {
		e.preventDefault();

		AuthDispatch(LoginStart());

		try {
			const res = await axios.post("http://localhost:8000/api/auth", { email, password });
			console.log("login res",res.data)
			AuthDispatch(LoginSuccess(res.data.token));
		} catch (err) {
			AuthDispatch(LoginFailure());

			if (typeof err.response.data.message === 'string') {
				toast.error(err.response.data.message);
			} else {
				console.log(err)
				AlertDispatch(AlertShow(err.response.data.error, "danger"));
			}
		}
	};

	const googleSuccess = async (res) => {
		const token = res?.tokenId;
		try {
		  const res = await axios.post("http://localhost:8000/api/auth/google-login", { tokenId: token }, { headers: { 'Content-Type': 'application/json' } });
		  AuthDispatch(LoginSuccess(res.data.token));
		} catch (err) {
			console.log("error google login", err)
			AlertDispatch(AlertShow(err.response.data.error, "danger"));
		}
	  };
	
	  const googleError = () => {
		toast.error("Google login failed");
	  };


	return (
		<Grid container component="main" sx={{
      height: '100vh',
      }}>
			<ToastContainer />
			<CssBaseline />
      
			<Grid item xs={12} sm={4} md={7}
				sx={{
					backgroundImage: `url(${imageslide})`,
					backgroundRepeat: 'no-repeat',
					backgroundColor: (t) =>
						t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			/>
      
			<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
				<Box
					sx={{
						my: 8,
						mx: 4,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign in
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
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							value={password}
							onChange={onChange}
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
							color="primary"
							disabled={isLoading}
						>
							Sign In
						</Button>
						{/* <Button fullWidth variant="contained" color="secondary" disabled={isLoading}>
							Google Login
						</Button> */}
						<GoogleLogin 
							clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
							render={(renderProps) => (
								<Button
									fullWidth
									variant="contained"
									sx={{ mt: 3, mb: 2 }}
									color="primary"
									onClick={renderProps.onClick}
									disabled={renderProps.disabled}
									>
									Google Login
									</Button>
							)}
							cookiePolicy={'single_host_origin'}
							onSuccess={googleSuccess}
							onFailure={googleError}
							/>
						<Grid container>
							<Grid item xs>
								<Link href="#" variant="body2">
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link href="register" variant="body2">
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Grid>
		</Grid>
	)
}


export default Login
