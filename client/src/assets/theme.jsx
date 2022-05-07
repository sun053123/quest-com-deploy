import { createTheme } from '@mui/material/styles';
import { cyan, green, indigo, orange, pink, deepOrange } from '@mui/material/colors';

export const theme = createTheme({
	palette: {
		primary: {
			main: orange[500],
		},
		secondary:{
			main: '#3f51b5',
			sub: cyan[800]
		} ,
		math: cyan[400],
		science: green[400],
		english: pink[400],
		social: indigo[400],
		computer: deepOrange[400],
	},
	typography: {
		fontFamily: 'Roboto',
		fontWeightLight: 300,
		fontWeightRegular: 400,
		fontWeightMedium: 500,
		fontWeightBold: 600,
	},
});
