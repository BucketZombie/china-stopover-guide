import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import HomePage from './pages/HomePage';
import GuidePage from './pages/GuidePage';
import MarkdownViewer from './components/MarkdownViewer';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import pages
import ReportPage from './pages/ReportPage';
import EmergencyPage from './pages/EmergencyPage';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Box minH="100vh" display="flex" flexDirection="column">
          <Navbar />
          <Box flex="1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/guide" element={<GuidePage />} />
              <Route path="/emergency" element={<EmergencyPage />} />
              <Route path="/markdown/:category/:file" element={<MarkdownViewer />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App; 