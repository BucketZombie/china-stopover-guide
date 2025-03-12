import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Image,
  useColorModeValue,
  Divider,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { FaPassport, FaMoneyBillWave, FaUtensils, FaSubway, FaMobileAlt, FaLanguage } from 'react-icons/fa';

export default function GuidePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Mock guide content
  const guideContent = {
    visa: [
      {
        title: 'Stopover Visa Policy',
        content: 'China offers a 24-hour, 72-hour, or 144-hour visa-free transit policy depending on your nationality and the city you\'re visiting. This allows eligible travelers to stay in specific cities or regions without obtaining a visa in advance.',
      },
      {
        title: 'Eligibility Requirements',
        content: 'To qualify for visa-free transit, you must have a valid passport with at least 6 months validity, a confirmed onward ticket to a third country (not the country you departed from), and in some cases, proof of accommodation.',
      },
      {
        title: 'Participating Cities',
        content: 'Major cities like Beijing, Shanghai, Guangzhou, and Chengdu participate in the visa-free transit program. However, the duration of allowed stay varies by city, so check the specific policy for your destination.',
      },
    ],
    payment: [
      {
        title: 'Currency',
        content: 'The official currency is the Chinese Yuan (CNY), also known as Renminbi (RMB). It\'s advisable to have some cash on hand, especially for small vendors and transportation.',
      },
      {
        title: 'Mobile Payments',
        content: 'WeChat Pay and Alipay are ubiquitous in China, but they typically require a Chinese bank account. Some merchants in tourist areas accept international credit cards, particularly Visa and Mastercard.',
      },
      {
        title: 'ATMs',
        content: 'ATMs are widely available in cities, and many accept international cards. Look for ATMs at banks like Bank of China, ICBC, or China Construction Bank for better rates and reliability.',
      },
    ],
    food: [
      {
        title: 'Regional Cuisines',
        content: 'China has eight major culinary traditions, each with distinct flavors and cooking methods. Popular styles include Cantonese (mild, fresh), Sichuan (spicy), and Jiangsu (sweet, precise).',
      },
      {
        title: 'Must-Try Dishes',
        content: 'Depending on your location, consider trying Peking duck in Beijing, soup dumplings (xiaolongbao) in Shanghai, hot pot in Chengdu, or dim sum in Guangzhou.',
      },
      {
        title: 'Dining Etiquette',
        content: 'It\'s customary to share dishes family-style. Using chopsticks is appreciated, but forks are often available upon request. Tipping is not expected in most restaurants.',
      },
    ],
    transportation: [
      {
        title: 'Public Transit',
        content: 'Major cities have extensive, modern subway systems with English signage. Subway is often the fastest way to get around during rush hour. Single-journey tickets or reloadable cards are available.',
      },
      {
        title: 'Taxis',
        content: 'Taxis are affordable but drivers rarely speak English. Have your destination written in Chinese characters to show the driver. Official taxis use meters and provide receipts.',
      },
      {
        title: 'Ride-Sharing',
        content: 'Didi is China\'s equivalent to Uber and offers an English interface in its international app. It\'s convenient for travelers who want to avoid language barriers with taxi drivers.',
      },
    ],
    communication: [
      {
        title: 'Internet Access',
        content: 'Many Western websites and apps (Google, Facebook, Instagram, WhatsApp) are blocked in China. Consider downloading a VPN before your trip if you need access to these services.',
      },
      {
        title: 'Wi-Fi Availability',
        content: 'Free Wi-Fi is available in most hotels, cafes, and airports, though you may need a Chinese phone number to register. Some cities offer free public Wi-Fi in tourist areas.',
      },
      {
        title: 'Useful Apps',
        content: 'Download apps like Baidu Maps, Didi, and a translation app like Pleco or Baidu Translate to help navigate and communicate during your stopover.',
      },
    ],
    culture: [
      {
        title: 'Basic Phrases',
        content: 'Learning a few basic Mandarin phrases can enhance your experience: "Nǐ hǎo" (Hello), "Xièxiè" (Thank you), "Duōshao qián" (How much?), "Cèsuǒ zài nǎlǐ" (Where is the bathroom?).',
      },
      {
        title: 'Cultural Etiquette',
        content: 'Respect personal space, avoid public displays of affection, and dress modestly when visiting temples or traditional areas. Remove shoes when entering someone\'s home if you see shoes at the door.',
      },
      {
        title: 'Bargaining',
        content: 'Bargaining is expected in markets and small shops, but not in department stores or established businesses. Start at about 50% of the asking price and negotiate from there.',
      },
    ],
  };
  
  // Filter content based on search query
  const filterContent = () => {
    if (!searchQuery) return guideContent;
    
    const filtered = {};
    
    Object.entries(guideContent).forEach(([category, items]) => {
      const filteredItems = items.filter(
        item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (filteredItems.length > 0) {
        filtered[category] = filteredItems;
      }
    });
    
    return filtered;
  };
  
  const filteredContent = filterContent();
  
  // Category icons
  const categoryIcons = {
    visa: FaPassport,
    payment: FaMoneyBillWave,
    food: FaUtensils,
    transportation: FaSubway,
    communication: FaMobileAlt,
    culture: FaLanguage,
  };

  return (
    <Container maxW="6xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={4}>
            China Travel Guide
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="3xl" mx="auto">
            Essential information to help you navigate your stopover in China, from visa requirements to local customs and everything in between.
          </Text>
        </Box>
        
        {/* Search Bar */}
        <Box maxW="md" mx="auto" w="full">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search the guide..."
              value={searchQuery}
              onChange={handleSearch}
              borderRadius="full"
              boxShadow="sm"
            />
          </InputGroup>
        </Box>
        
        {/* Guide Content */}
        <Box 
          bg={bgColor}
          borderRadius="lg"
          boxShadow="lg"
          borderWidth="1px"
          borderColor={borderColor}
          overflow="hidden"
        >
          <Tabs isFitted variant="enclosed">
            <TabList>
              {Object.keys(filteredContent).map((category) => (
                <Tab key={category}>
                  <HStack>
                    <Icon as={categoryIcons[category]} />
                    <Text textTransform="capitalize">{category}</Text>
                  </HStack>
                </Tab>
              ))}
            </TabList>
            
            <TabPanels>
              {Object.entries(filteredContent).map(([category, items]) => (
                <TabPanel key={category} p={6}>
                  <VStack spacing={6} align="stretch">
                    {/* Category Header */}
                    <Flex align="center" mb={4}>
                      <Icon as={categoryIcons[category]} boxSize={8} color="brand.500" mr={3} />
                      <Heading as="h2" size="lg" textTransform="capitalize">
                        {category} Information
                      </Heading>
                    </Flex>
                    
                    {/* Category Content */}
                    <Accordion allowMultiple defaultIndex={[0]}>
                      {items.map((item, index) => (
                        <AccordionItem key={index} border="none" mb={4}>
                          <AccordionButton 
                            bg="gray.50" 
                            _dark={{ bg: 'gray.600' }}
                            borderRadius="md"
                            p={4}
                          >
                            <Box flex="1" textAlign="left" fontWeight="semibold">
                              {item.title}
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel pb={4} pt={4} px={6}>
                            <Text>{item.content}</Text>
                          </AccordionPanel>
                        </AccordionItem>
                      ))}
                    </Accordion>
                    
                    {/* Additional Resources */}
                    {category === 'visa' && (
                      <Box mt={6} p={4} bg="blue.50" _dark={{ bg: 'blue.900' }} borderRadius="md">
                        <Heading as="h3" size="sm" mb={2}>
                          Official Resources
                        </Heading>
                        <Text>
                          For the most up-to-date visa information, please visit the official website of the Chinese Embassy or Consulate in your country.
                        </Text>
                      </Box>
                    )}
                  </VStack>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>
        
        {/* Popular Destinations */}
        <Box mt={10}>
          <Heading as="h2" size="lg" mb={6} textAlign="center">
            Popular Stopover Destinations
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            {[
              {
                city: 'Shanghai',
                image: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                description: 'A global financial hub with a mix of modern skyscrapers and historic buildings along the Bund.',
              },
              {
                city: 'Beijing',
                image: 'https://images.unsplash.com/photo-1584490867455-3c7536e8d30d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80',
                description: 'China\'s capital city, home to the Forbidden City, Temple of Heaven, and access to the Great Wall.',
              },
              {
                city: 'Guangzhou',
                image: 'https://images.unsplash.com/photo-1522547902298-51566e4fb383?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                description: 'A major port city known for Cantonese cuisine, modern architecture, and cultural heritage.',
              },
            ].map((destination, index) => (
              <Box
                key={index}
                borderRadius="lg"
                overflow="hidden"
                boxShadow="lg"
                bg={bgColor}
                transition="transform 0.3s"
                _hover={{ transform: 'translateY(-5px)' }}
              >
                <Image
                  src={destination.image}
                  alt={destination.city}
                  h="200px"
                  w="100%"
                  objectFit="cover"
                />
                <Box p={6}>
                  <Heading as="h3" size="md" mb={2}>
                    {destination.city}
                  </Heading>
                  <Text color="gray.600" mb={4}>
                    {destination.description}
                  </Text>
                  <Badge colorScheme="blue">144-hour visa-free transit</Badge>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </Container>
  );
} 