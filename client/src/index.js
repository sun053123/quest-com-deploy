import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import { theme } from './assets/theme';
import { ThemeProvider } from '@mui/material/styles';

import { AuthProvider } from './store/Contexts/AuthContext';
import { AlertProvider } from './store/Contexts/AlertContext';
import { BrowserRouter } from 'react-router-dom';


const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider >
    <AlertProvider>
      <QueryClientProvider client={queryClient}>

        <ReactQueryDevtools />
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>

      </QueryClientProvider>
    </AlertProvider>
  </AuthProvider>


);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
