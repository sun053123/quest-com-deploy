import { createTheme } from '@mui/material/styles';
import { lightGreen, green, orange } from '@mui/material/colors';

export const theme = createTheme({
	palette: {
		primary: {
			main: orange[500],
		},
		secondary: lightGreen,
	},
	typography: {
		fontFamily: 'Roboto',
		fontWeightLight: 300,
		fontWeightRegular: 400,
		fontWeightMedium: 500,
		fontWeightBold: 600,
	},
});
