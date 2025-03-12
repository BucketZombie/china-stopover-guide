import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  useColorModeValue,
  createIcon,
  Flex,
  SimpleGrid,
  Image,
} from '@chakra-ui/react';

// Feature card component
function FeatureCard({ title, text, icon, to, buttonText, accentColor }) {
  return (
    <Box
      maxW={'330px'}
      w={'full'}
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'2xl'}
      rounded={'lg'}
      p={6}
      textAlign={'center'}
      transition="transform 0.3s"
      _hover={{ transform: 'translateY(-5px)' }}
    >
      <Icon as={icon} w={10} h={10} mb={4} color={accentColor} />
      <Heading fontSize={'2xl'} fontFamily={'body'} mb={3}>
        {title}
      </Heading>
      <Text color={'gray.500'} mb={6}>
        {text}
      </Text>
      <Button
        as={RouterLink}
        to={to}
        colorScheme={accentColor.split('.')[0]}
        bg={accentColor}
        rounded={'full'}
        px={6}
        _hover={{
          bg: `${accentColor.split('.')[0]}.600`,
        }}
      >
        {buttonText}
      </Button>
    </Box>
  );
}

// Icons
const ReportIcon = createIcon({
  displayName: 'ReportIcon',
  viewBox: '0 0 24 24',
  path: (
    <path
      fill="currentColor"
      d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,13H8V11H10V13M10,17H8V15H10V17M14,13H12V11H14V13M14,17H12V15H14V17Z"
    />
  ),
});

const GuideIcon = createIcon({
  displayName: 'GuideIcon',
  viewBox: '0 0 24 24',
  path: (
    <path
      fill="currentColor"
      d="M12,3L2,12H5V20H19V12H22L12,3M12,7.7C14.1,7.7 15.8,9.4 15.8,11.5C15.8,14.5 12,18 12,18C12,18 8.2,14.5 8.2,11.5C8.2,9.4 9.9,7.7 12,7.7M12,10A1.5,1.5 0 0,0 10.5,11.5A1.5,1.5 0 0,0 12,13A1.5,1.5 0 0,0 13.5,11.5A1.5,1.5 0 0,0 12,10Z"
    />
  ),
});

const EmergencyIcon = createIcon({
  displayName: 'EmergencyIcon',
  viewBox: '0 0 24 24',
  path: (
    <path
      fill="currentColor"
      d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16"
    />
  ),
});

export default function HomePage() {
  return (
    <Box>
      {/* Hero Section */}
      <Container maxW={'3xl'} py={{ base: 12, md: 24 }}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 10, md: 20 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}
          >
            Make your China stopover <br />
            <Text as={'span'} color={'brand.500'}>
              unforgettable
            </Text>
          </Heading>
          <Text color={'gray.500'} fontSize={{ base: 'lg', md: 'xl' }}>
            Get personalized travel reports, essential guides, and emergency resources
            for your stopover in China. We help you make the most of your limited time
            with tailored recommendations based on your interests and schedule.
          </Text>
          <Stack
            direction={'column'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}
          >
            <Button
              as={RouterLink}
              to="/report"
              colorScheme={'blue'}
              bg={'brand.500'}
              rounded={'full'}
              px={6}
              size="lg"
              _hover={{
                bg: 'brand.600',
              }}
            >
              Get Your Travel Report
            </Button>
            <Button 
              as={RouterLink}
              to="/guide" 
              variant={'link'} 
              colorScheme={'blue'} 
              size={'sm'}
            >
              Explore Travel Guides
            </Button>
          </Stack>
        </Stack>
      </Container>

      {/* Features Section */}
      <Box py={12} bg={useColorModeValue('gray.50', 'gray.700')}>
        <Container maxW={'6xl'}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} justifyItems="center">
            <FeatureCard
              title="Personalized Travel Report"
              text="Get a customized travel plan based on your stopover duration, interests, and budget."
              icon={ReportIcon}
              to="/report"
              buttonText="Create Report"
              accentColor="brand.500"
            />
            <FeatureCard
              title="Travel Guide"
              text="Explore comprehensive information about China's culture, attractions, transportation, and more."
              icon={GuideIcon}
              to="/guide"
              buttonText="View Guides"
              accentColor="teal.500"
            />
            <FeatureCard
              title="Emergency Resources"
              text="Access critical information and contacts for emergencies during your stopover in China."
              icon={EmergencyIcon}
              to="/emergency"
              buttonText="Emergency Info"
              accentColor="accent.500"
            />
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
} 