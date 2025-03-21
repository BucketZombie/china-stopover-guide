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
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { FaPassport, FaMoneyBillWave, FaUtensils, FaSubway, FaMobileAlt, FaLanguage } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

// Markdown paths configuration
const markdownPaths = {
  visa: [
    { title: 'Stopover Visa Policy', path: 'https://sozovgqwftswrgcrvtff.supabase.co/storage/v1/object/public/test//Stopover%20Vise%20Policy.md' },
    { title: 'Eligibility Requirements', path: 'https://sozovgqwftswrgcrvtff.supabase.co/storage/v1/object/public/test//requirement.md' },
    { title: 'Participating Cities', path: 'https://sozovgqwftswrgcrvtff.supabase.co/storage/v1/object/public/test//participating%20cities.md' },
  ],
  payment: [
    { title: 'Currency', path: 'https://sozovgqwftswrgcrvtff.supabase.co/storage/v1/object/public/test//cash.md' },
    { title: 'Mobile Payments', path: 'https://sozovgqwftswrgcrvtff.supabase.co/storage/v1/object/public/test//mobile%20pay.md' },
    { title: 'ATMs', path: 'https://sozovgqwftswrgcrvtff.supabase.co/storage/v1/object/public/test//atms.md' },
  ],
  food: [
    { title: 'Regional Cuisines', path: 'https://sozovgqwftswrgcrvtff.supabase.co/storage/v1/object/public/test//transportation.md' },
    { title: 'Ordering Food', path: 'https://sozovgqwftswrgcrvtff.supabase.co/storage/v1/object/public/test//Ordering-food.md' },
    { title: 'Dining Etiquette', path: 'https://sozovgqwftswrgcrvtff.supabase.co/storage/v1/object/public/test//dining-etiquette.md' },
  ],
  transportation: [
    { title: 'Public Transit', path: 'https://sozovgqwftswrgcrvtff.supabase.co/storage/v1/object/public/test//transportation.md' },
    { title: 'Taxis', path: 'https://sozovgqwftswrgcrvtff.supabase.co/storage/v1/object/public/test//taxis.md' },
    { title: 'Ride-Sharing', path: 'https://sozovgqwftswrgcrvtff.supabase.co/storage/v1/object/public/test//ride-sharing.md' },
  ],
  communication: [
    { title: 'Network', path: 'https://sozovgqwftswrgcrvtff.supabase.co/storage/v1/object/public/test//network.md' },
    { title: 'Wi-Fi Availability', path: 'https://sozovgqwftswrgcrvtff.supabase.co/storage/v1/object/public/test//wifi-availability.md' },
    { title: 'Useful Apps', path: 'https://sozovgqwftswrgcrvtff.supabase.co/storage/v1/object/public/test//useful-apps.md' },
  ],
  culture: [
    { title: 'Basic Phrases', path: 'https://sozovgqwftswrgcrvtff.supabase.co/storage/v1/object/public/test//culture.md' },
    { title: 'Cultural Etiquette', path: 'https://sozovgqwftswrgcrvtff.supabase.co/storage/v1/object/public/test//cultural-etiquette.md' },
    { title: 'Bargaining', path: 'https://sozovgqwftswrgcrvtff.supabase.co/storage/v1/object/public/test//bargaining.md' },
  ],
};

// 备用示例内容
const fallbackContent = {
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

export default function GuidePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [guideContent, setGuideContent] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Fetch markdown content
  useEffect(() => {
    const fetchMarkdownContent = async () => {
      setIsLoading(true);
      const content = {};
      
      for (const [category, items] of Object.entries(markdownPaths)) {
        content[category] = [];
        
        for (const item of items) {
          try {
            const response = await fetch(item.path);
            if (response.ok) {
              const markdownContent = await response.text();
              // 检查内容是否为空或太短，这可能表示无效内容
              if (markdownContent && markdownContent.length > 20) {
                content[category].push({
                  title: item.title,
                  content: markdownContent,
                  isMarkdown: true
                });
              } else {
                // 如果内容为空或太短，使用备用内容
                console.warn(`Markdown content for ${item.title} is too short or empty, using fallback`);
                const fallbackItem = fallbackContent[category]?.find(fb => fb.title === item.title);
                content[category].push({
                  title: item.title,
                  content: fallbackItem ? fallbackItem.content : `Information about ${item.title} will be available soon.`,
                  isMarkdown: false
                });
              }
            } else {
              console.error(`Failed to fetch ${item.path}: ${response.status}`);
              // 使用备用内容
              const fallbackItem = fallbackContent[category]?.find(fb => fb.title === item.title);
              content[category].push({
                title: item.title,
                content: fallbackItem ? fallbackItem.content : `Information about ${item.title} will be available soon.`,
                isMarkdown: false
              });
            }
          } catch (error) {
            console.error(`Error fetching ${item.path}:`, error);
            // 使用备用内容
            const fallbackItem = fallbackContent[category]?.find(fb => fb.title === item.title);
            content[category].push({
              title: item.title,
              content: fallbackItem ? fallbackItem.content : `Information about ${item.title} will be available soon.`,
              isMarkdown: false
            });
          }
        }
      }
      
      setGuideContent(content);
      setIsLoading(false);
    };
    
    fetchMarkdownContent();
  }, []);
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
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

  if (isLoading) {
    return (
      <Container maxW="6xl" py={10}>
        <VStack spacing={8} align="center" justify="center" minH="50vh">
          <Spinner size="xl" color="blue.500" />
          <Text>Loading guide content...</Text>
        </VStack>
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
                            {item.isMarkdown ? (
                              <Box className="markdown-content">
                                <ReactMarkdown>{item.content}</ReactMarkdown>
                              </Box>
                            ) : (
                              <Text>{item.content}</Text>
                            )}
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
                        <Text fontSize="sm">
                          For the most up-to-date information, visit the official Chinese Embassy or Consulate website in your country.
                        </Text>
                      </Box>
                    )}
                  </VStack>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>
      </VStack>
    </Container>
  );
}