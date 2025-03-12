import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  useToast,
  VStack,
  HStack,
  Divider,
  useColorModeValue,
  Flex,
  CheckboxGroup,
  Checkbox,
  Radio,
  RadioGroup,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { generateAIReport } from '../services/api';

// Mock data for dropdowns (这些数据也可以从API获取)
const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Japan', 
  'South Korea', 'Germany', 'France', 'Italy', 'Spain', 'Singapore',
  'Malaysia', 'Thailand', 'India', 'Russia', 'Brazil'
];

const chineseCities = [
  'Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 
  'Xi\'an', 'Hangzhou', 'Nanjing', 'Chongqing', 'Xiamen'
];

const interests = [
  'Sightseeing', 'Food & Cuisine', 'Shopping', 'Culture & History', 
  'Art & Museums', 'Nature & Parks', 'Local Experiences'
];

export default function ReportPage() {
  const [formData, setFormData] = useState({
    departure_country: '',
    destination: '',
    stopover_date: '',
    stopover_duration: '',
    interests: [],
    budget: 'medium',
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [apiError, setApiError] = useState(null);
  
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleInterestsChange = (selectedInterests) => {
    setFormData({
      ...formData,
      interests: selectedInterests,
    });
  };

  const handleBudgetChange = (value) => {
    setFormData({
      ...formData,
      budget: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.departure_country) {
      newErrors.departure_country = 'Departure country is required';
    }
    
    if (!formData.destination) {
      newErrors.destination = 'Destination is required';
    }
    
    if (!formData.stopover_date) {
      newErrors.stopover_date = 'Stopover date is required';
    }
    
    if (!formData.stopover_duration) {
      newErrors.stopover_duration = 'Duration is required';
    } else if (isNaN(formData.stopover_duration) || parseInt(formData.stopover_duration) <= 0) {
      newErrors.stopover_duration = 'Duration must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    
    if (!validateForm()) {
      toast({
        title: 'Form Error',
        description: 'Please fill in all required fields correctly.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await generateAIReport(formData);
      if (response.success) {
        setReport(response.data);
      } else {
        throw new Error(response.error || 'Failed to generate report');
      }
    } catch (error) {
      console.error('Error:', error);
      setApiError(error.message);
      toast({
        title: 'Error',
        description: 'Failed to generate report. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      departure_country: '',
      destination: '',
      stopover_date: '',
      stopover_duration: '',
      interests: [],
      budget: 'medium',
    });
    setReport(null);
    setApiError(null);
  };

  return (
    <Container maxW="6xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={4}>
            Personalized Travel Report
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Enter your travel details to receive a customized report for your China stopover
          </Text>
        </Box>

        {apiError && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <AlertTitle mr={2}>Error!</AlertTitle>
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        {!report ? (
          <Box 
            as="form" 
            onSubmit={handleSubmit}
            bg={bgColor}
            p={8}
            borderRadius="lg"
            boxShadow="lg"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <VStack spacing={6}>
              <FormControl isRequired isInvalid={errors.departure_country}>
                <FormLabel>Departure Country</FormLabel>
                <Select 
                  name="departure_country"
                  placeholder="Select country"
                  value={formData.departure_country}
                  onChange={handleChange}
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.departure_country}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={errors.destination}>
                <FormLabel>Destination in China</FormLabel>
                <Select 
                  name="destination"
                  placeholder="Select city"
                  value={formData.destination}
                  onChange={handleChange}
                >
                  {chineseCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.destination}</FormErrorMessage>
              </FormControl>

              <HStack w="100%">
                <FormControl isRequired isInvalid={errors.stopover_date}>
                  <FormLabel>Stopover Date</FormLabel>
                  <Input
                    name="stopover_date"
                    type="date"
                    value={formData.stopover_date}
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors.stopover_date}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={errors.stopover_duration}>
                  <FormLabel>Duration (hours)</FormLabel>
                  <Input
                    name="stopover_duration"
                    type="number"
                    placeholder="e.g., 24"
                    value={formData.stopover_duration}
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors.stopover_duration}</FormErrorMessage>
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Interests (Optional)</FormLabel>
                <CheckboxGroup 
                  colorScheme="blue" 
                  defaultValue={[]}
                  value={formData.interests}
                  onChange={handleInterestsChange}
                >
                  <Flex flexWrap="wrap" gap={4}>
                    {interests.map((interest) => (
                      <Checkbox key={interest} value={interest}>
                        {interest}
                      </Checkbox>
                    ))}
                  </Flex>
                </CheckboxGroup>
              </FormControl>

              <FormControl>
                <FormLabel>Budget (Optional)</FormLabel>
                <RadioGroup 
                  onChange={handleBudgetChange} 
                  value={formData.budget}
                  colorScheme="blue"
                >
                  <Stack direction="row">
                    <Radio value="low">Low</Radio>
                    <Radio value="medium">Medium</Radio>
                    <Radio value="high">High</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <Button
                mt={4}
                colorScheme="blue"
                type="submit"
                size="lg"
                width="full"
                isLoading={isLoading}
                loadingText="Generating Report"
              >
                Generate Travel Report
              </Button>
            </VStack>
          </Box>
        ) : (
          <Box 
            bg={bgColor}
            p={8}
            borderRadius="lg"
            boxShadow="lg"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <VStack spacing={6} align="stretch">
              <Flex justifyContent="space-between" alignItems="center">
                <Heading as="h2" size="lg">
                  {report.title}
                </Heading>
                <Button 
                  colorScheme="blue" 
                  variant="outline" 
                  onClick={resetForm}
                >
                  Create New Report
                </Button>
              </Flex>
              
              <Text fontSize="md" color="gray.600">
                {report.introduction}
              </Text>
              
              <Divider />
              
              {report.sections.map((section, index) => (
                <Box key={index}>
                  <Heading as="h3" size="md" mb={2}>
                    {section.title}
                  </Heading>
                  <Text whiteSpace="pre-line">{section.content}</Text>
                  {index < report.sections.length - 1 && <Divider my={4} />}
                </Box>
              ))}
              
              <HStack spacing={4} mt={4}>
                <Button colorScheme="blue">
                  Download PDF
                </Button>
                <Button colorScheme="gray">
                  Print Report
                </Button>
              </HStack>
            </VStack>
          </Box>
        )}
      </VStack>
    </Container>
  );
} 