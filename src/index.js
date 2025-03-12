import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import App from './App';

// Extend the theme to include custom colors, fonts, etc
const theme = extendTheme({
  colors: {
    brand: {
      50: '#f0f8ff',
      100: '#d1e6ff',
      200: '#a8d1ff',
      300: '#7fb9ff',
      400: '#5aa3ff',
      500: '#3182ce', // Primary blue
      600: '#2c5282',
      700: '#1e3a5f',
      800: '#162a43',
      900: '#0e1c2d',
    },
    accent: {
      500: '#e53e3e', // Red for emergency
    },
  },
  fonts: {
    heading: '"Poppins", sans-serif',
    body: '"Open Sans", sans-serif',
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
); 