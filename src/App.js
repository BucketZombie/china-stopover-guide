import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

// Import pages
import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';
import GuidePage from './pages/GuidePage';
import EmergencyPage from './pages/EmergencyPage';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Box minH="100vh" display="flex" flexDirection="column">
        <Navbar />
        <Box flex="1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App; 