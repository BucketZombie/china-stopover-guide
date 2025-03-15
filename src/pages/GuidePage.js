import React, { useState, useEffect } from 'react';
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
  Spinner,
  Center,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { FaPassport, FaMoneyBillWave, FaUtensils, FaSubway, FaMobileAlt, FaLanguage } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

export default function GuidePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [markdownContent, setMarkdownContent] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // 定义每个类别的 Markdown 文档路径
  const markdownPaths = {
    visa: [
      { title: 'Stopover Visa Policy', path: 'https://sozovgqwftswrgcrvtff.supabase.co/storage/v1/object/public/test//Stopover%20Vise%20Policy.md' },
      { title: 'Eligibility Requirements', path: 'https://sozovgqwftswrgcrvtff.supabase.co/storage/v1/object/public/test//requirement.md' },
      { title: 'Participating Cities', path: '/markdown/visa/participating-cities.md' },
    ],
    payment: [
      { title: 'Currency', path: '/markdown/payment/currency.md' },
      { title: 'Mobile Payments', path: 'https://sozovgqwftswrgcrvtff.supabase.co/storage/v1/object/public/test//t1.md' },
      { title: 'ATMs', path: '/markdown/payment/atms.md' },
    ],
    food: [
      { title: 'Regional Cuisines', path: '/markdown/food/regional-cuisines.md' },
      { title: 'Must-Try Dishes', path: '/markdown/food/must-try-dishes.md' },
      { title: 'Dining Etiquette', path: '/markdown/food/dining-etiquette.md' },
    ],
    transportation: [
      { title: 'Public Transit', path: '/markdown/transportation/public-transit.md' },
      { title: 'Taxis', path: '/markdown/transportation/taxis.md' },
      { title: 'Ride-Sharing', path: '/markdown/transportation/ride-sharing.md' },
    ],
    communication: [
      { title: 'Internet Access', path: '/markdown/communication/internet-access.md' },
      { title: 'Wi-Fi Availability', path: '/markdown/communication/wifi-availability.md' },
      { title: 'Useful Apps', path: '/markdown/communication/useful-apps.md' },
    ],
    culture: [
      { title: 'Basic Phrases', path: '/markdown/culture/basic-phrases.md' },
      { title: 'Cultural Etiquette', path: '/markdown/culture/cultural-etiquette.md' },
      { title: 'Bargaining', path: '/markdown/culture/bargaining.md' },
    ],
  };
  
  // 加载 Markdown 文件
  useEffect(() => {
    const loadMarkdownFiles = async () => {
      setIsLoading(true);
      const content = {};
      
      try {
        // 对每个类别和每个文档加载 Markdown 内容
        for (const [category, documents] of Object.entries(markdownPaths)) {
          content[category] = [];
          
          for (const doc of documents) {
            try {
              const response = await fetch(doc.path);
              
              if (!response.ok) {
                // 如果无法加载 Markdown 文件，使用备用内容
                content[category].push({
                  ...doc,
                  content: `# ${doc.title}\n\nContent is being prepared. Please check back later.`,
                });
                console.warn(`Failed to load ${doc.path}: ${response.statusText}`);
                continue;
              }
              
              const text = await response.text();
              content[category].push({
                ...doc,
                content: text,
              });
            } catch (err) {
              console.error(`Error loading ${doc.path}:`, err);
              content[category].push({
                ...doc,
                content: `# ${doc.title}\n\nContent is temporarily unavailable.`,
              });
            }
          }
        }
        
        setMarkdownContent(content);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading markdown files:', err);
        setError('Failed to load guide content. Please try again later.');
        setIsLoading(false);
      }
    };
    
    loadMarkdownFiles();
  }, []);
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // 过滤内容基于搜索查询
  const filterContent = () => {
    if (!searchQuery || Object.keys(markdownContent).length === 0) return markdownContent;
    
    const filtered = {};
    
    Object.entries(markdownContent).forEach(([category, items]) => {
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
  
  // 类别图标
  const categoryIcons = {
    visa: FaPassport,
    payment: FaMoneyBillWave,
    food: FaUtensils,
    transportation: FaSubway,
    communication: FaMobileAlt,
    culture: FaLanguage,
  };

  // 加载状态
  if (isLoading) {
    return (
      <Container maxW="6xl" py={10}>
        <Center h="50vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
            <Text>Loading guide content...</Text>
          </VStack>
        </Center>
      </Container>
    );
  }

  // 错误状态
  if (error) {
    return (
      <Container maxW="6xl" py={10}>
        <Box textAlign="center" p={8} bg="red.50" borderRadius="md">
          <Heading as="h2" size="lg" color="red.500" mb={4}>
            Error Loading Content
          </Heading>
          <Text>{error}</Text>
        </Box>
      </Container>
    );
  }

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
                            <Box className="markdown-content">
                              <ReactMarkdown>{item.content}</ReactMarkdown>
                            </Box>
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