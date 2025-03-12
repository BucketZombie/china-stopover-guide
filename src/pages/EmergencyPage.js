import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  Button,
  List,
  ListItem,
  ListIcon,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Flex,
  Link,
} from '@chakra-ui/react';
import { 
  FaPhone, 
  FaHospital, 
  FaPassport, 
  FaExclamationTriangle, 
  FaMapMarkerAlt, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaArrowRight,
  FaEnvelope,
  FaGlobe,
} from 'react-icons/fa';

export default function EmergencyPage() {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColor = 'accent.500';
  
  // Emergency contacts
  const emergencyContacts = [
    { name: 'Police', number: '110', icon: FaPhone },
    { name: 'Ambulance', number: '120', icon: FaPhone },
    { name: 'Fire', number: '119', icon: FaPhone },
    { name: 'Tourist Police', number: '12345', icon: FaPhone },
  ];
  
  // Common embassies
  const embassies = [
    {
      country: 'United States',
      address: '55 Anjialou Road, Chaoyang District, Beijing',
      phone: '+86 10 8531 3000',
      email: 'BeijingACS@state.gov',
      website: 'https://china.usembassy-china.org.cn/',
    },
    {
      country: 'United Kingdom',
      address: '11 Guang Hua Lu, Chaoyang District, Beijing',
      phone: '+86 10 5192 4000',
      email: 'consular.beijing@fcdo.gov.uk',
      website: 'https://www.gov.uk/world/organisations/british-embassy-beijing',
    },
    {
      country: 'Australia',
      address: '21 Dongzhimenwai Dajie, Chaoyang District, Beijing',
      phone: '+86 10 5140 4111',
      email: 'consular.beijing@dfat.gov.au',
      website: 'https://china.embassy.gov.au/',
    },
    {
      country: 'Canada',
      address: '19 Dongzhimenwai Dajie, Chaoyang District, Beijing',
      phone: '+86 10 5139 4000',
      email: 'beijing-cs@international.gc.ca',
      website: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/embassies-consulates.html',
    },
  ];
  
  // Major hospitals with English service
  const hospitals = [
    {
      name: 'Beijing United Family Hospital',
      address: '2 Jiangtai Road, Chaoyang District, Beijing',
      phone: '+86 10 5927 7000',
      hasEnglish: true,
    },
    {
      name: 'Shanghai United Family Hospital',
      address: '1139 Xianxia Road, Changning District, Shanghai',
      phone: '+86 21 2216 3900',
      hasEnglish: true,
    },
    {
      name: 'Guangzhou United Family Hospital',
      address: 'No. 28 Fangyuan Road, Haizhu District, Guangzhou',
      phone: '+86 20 8710 6000',
      hasEnglish: true,
    },
  ];
  
  // Emergency scenarios
  const emergencyScenarios = [
    {
      title: 'Lost Passport',
      steps: [
        'Report the loss to local police and get a police report',
        'Contact your embassy or consulate immediately',
        'Bring identification (copies of passport, driver\'s license) to your embassy',
        'Apply for an emergency travel document or temporary passport',
        'Update your airline about your situation',
      ],
      icon: FaPassport,
    },
    {
      title: 'Medical Emergency',
      steps: [
        'Call 120 for an ambulance if needed',
        'For less urgent care, take a taxi to an international hospital',
        'Contact your travel insurance provider',
        'Keep all medical receipts for insurance claims',
        'Ask for medical reports in English if possible',
      ],
      icon: FaHospital,
    },
    {
      title: 'Theft or Robbery',
      steps: [
        'Report to the nearest police station (110)',
        'Get a police report for insurance purposes',
        'Contact your embassy if you need assistance',
        'Cancel any stolen credit cards immediately',
        'Avoid carrying large amounts of cash or valuables',
      ],
      icon: FaExclamationTriangle,
    },
  ];

  return (
    <Container maxW="6xl" py={10}>
      <VStack spacing={10} align="stretch">
        {/* Emergency Header */}
        <Box textAlign="center">
          <Badge 
            colorScheme="red" 
            fontSize="md" 
            p={2} 
            borderRadius="full" 
            mb={4}
          >
            Emergency Resources
          </Badge>
          <Heading as="h1" size="xl" mb={4}>
            Emergency Assistance in China
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="3xl" mx="auto">
            Quick access to emergency contacts, embassy information, and step-by-step guidance for common emergency situations during your stopover in China.
          </Text>
        </Box>
        
        {/* Emergency Alert */}
        <Alert
          status="error"
          variant="solid"
          borderRadius="lg"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          py={4}
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Emergency Numbers in China
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            Save these numbers to your phone before your trip.
          </AlertDescription>
          
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} mt={6} w="full" maxW="2xl">
            {emergencyContacts.map((contact, index) => (
              <VStack key={index} p={3} bg="white" color="red.500" borderRadius="md">
                <Icon as={contact.icon} boxSize={8} />
                <Text fontWeight="bold">{contact.name}</Text>
                <Text fontSize="xl">{contact.number}</Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Alert>
        
        {/* Emergency Scenarios */}
        <Box>
          <Heading as="h2" size="lg" mb={6}>
            Common Emergency Situations
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {emergencyScenarios.map((scenario, index) => (
              <Box
                key={index}
                bg={bgColor}
                p={6}
                borderRadius="lg"
                boxShadow="md"
                borderWidth="1px"
                borderColor={borderColor}
                borderLeftWidth="4px"
                borderLeftColor={accentColor}
              >
                <HStack mb={4}>
                  <Icon as={scenario.icon} color={accentColor} boxSize={6} />
                  <Heading as="h3" size="md">
                    {scenario.title}
                  </Heading>
                </HStack>
                
                <List spacing={3}>
                  {scenario.steps.map((step, stepIndex) => (
                    <ListItem key={stepIndex}>
                      <HStack align="flex-start">
                        <ListIcon as={FaArrowRight} color={accentColor} mt={1} />
                        <Text>{step}</Text>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
        
        {/* Embassy Information */}
        <Box>
          <Heading as="h2" size="lg" mb={6}>
            Embassy & Consulate Information
          </Heading>
          
          <Accordion allowMultiple>
            {embassies.map((embassy, index) => (
              <AccordionItem 
                key={index} 
                bg={bgColor}
                mb={4}
                borderRadius="lg"
                overflow="hidden"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <AccordionButton py={4} px={6}>
                  <HStack flex="1" textAlign="left">
                    <Icon as={FaGlobe} color="brand.500" />
                    <Text fontWeight="bold">{embassy.country} Embassy</Text>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} pt={2} px={6}>
                  <VStack align="stretch" spacing={3}>
                    <HStack>
                      <Icon as={FaMapMarkerAlt} color="gray.500" />
                      <Text>{embassy.address}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaPhone} color="gray.500" />
                      <Text>{embassy.phone}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaEnvelope} color="gray.500" />
                      <Text>{embassy.email}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaGlobe} color="gray.500" />
                      <Link color="blue.500" href={embassy.website} isExternal>
                        Official Website
                      </Link>
                    </HStack>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
          
          <Text mt={4} fontSize="sm" color="gray.600">
            Note: This is not a complete list. Please check your country's official government website for the most accurate embassy information.
          </Text>
        </Box>
        
        {/* Hospitals with English Service */}
        <Box>
          <Heading as="h2" size="lg" mb={6}>
            International Hospitals
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {hospitals.map((hospital, index) => (
              <Box
                key={index}
                bg={bgColor}
                p={6}
                borderRadius="lg"
                boxShadow="md"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Flex justify="space-between" align="flex-start" mb={3}>
                  <Heading as="h3" size="md">
                    {hospital.name}
                  </Heading>
                  {hospital.hasEnglish && (
                    <Badge colorScheme="green">English Speaking</Badge>
                  )}
                </Flex>
                
                <VStack align="stretch" spacing={3} mt={4}>
                  <HStack>
                    <Icon as={FaMapMarkerAlt} color="gray.500" />
                    <Text fontSize="sm">{hospital.address}</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaPhone} color="gray.500" />
                    <Text fontSize="sm">{hospital.phone}</Text>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
        
        {/* Travel Insurance Reminder */}
        <Alert
          status="info"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          borderRadius="lg"
          p={6}
          bg="blue.50"
          _dark={{ bg: 'blue.900' }}
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Travel Insurance is Essential
          </AlertTitle>
          <AlertDescription maxWidth="2xl">
            Medical costs in international hospitals can be high. Always ensure you have comprehensive travel insurance that covers medical emergencies, evacuation, and trip disruptions before traveling to China.
          </AlertDescription>
          
          <HStack mt={6} spacing={4}>
            <Button colorScheme="blue" leftIcon={<FaCheckCircle />}>
              Check Your Coverage
            </Button>
            <Button variant="outline" colorScheme="blue" leftIcon={<FaExclamationCircle />}>
              Insurance Tips
            </Button>
          </HStack>
        </Alert>
      </VStack>
    </Container>
  );
} 