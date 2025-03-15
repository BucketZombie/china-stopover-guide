import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Spinner, 
  Center, 
  Alert, 
  AlertIcon,
  Button
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import ReactMarkdown from 'react-markdown';
import { useParams, useNavigate } from 'react-router-dom';

export default function MarkdownViewer() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { path } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/markdown/${path}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load document: ${response.statusText}`);
        }
        
        const text = await response.text();
        setContent(text);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading markdown:', err);
        setError(err.message || 'Failed to load document');
        setIsLoading(false);
      }
    };
    
    if (path) {
      fetchMarkdown();
    }
  }, [path]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  if (isLoading) {
    return (
      <Container maxW="4xl" py={10}>
        <Center h="50vh">
          <Spinner size="xl" color="blue.500" thickness="4px" />
        </Center>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxW="4xl" py={10}>
        <Button leftIcon={<ArrowBackIcon />} onClick={handleBack} mb={4}>
          Back to Guide
        </Button>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container maxW="4xl" py={10}>
      <Button leftIcon={<ArrowBackIcon />} onClick={handleBack} mb={6}>
        Back to Guide
      </Button>
      <Box 
        bg="white" 
        _dark={{ bg: 'gray.700' }} 
        p={8} 
        borderRadius="lg" 
        boxShadow="md"
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </Box>
    </Container>
  );
} 