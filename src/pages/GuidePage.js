import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
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
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  Icon,
  useColorModeValue,
  HStack,
  Badge,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Link,
  Button,
} from '@chakra-ui/react';
import { SearchIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { FaPassport, FaMoneyBillWave, FaUtensils, FaSubway, FaMobileAlt, FaLanguage } from 'react-icons/fa';

export default function GuidePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // 定义每个类别的 Markdown 文档链接
  const categoryDocuments = {
    visa: [
      { 
        title: 'Stopover Visa Policy', 
        url: 'https://sozovgqwftswrgcrvtff.supabase.co/storage/v1/object/public/test//payment.md' 
      },
      { 
        title: 'Eligibility Requirements', 
        url: '/markdown/visa/eligibility-requirements.md' 
      },
      { 
        title: 'Participating Cities', 
        url: '/markdown/visa/participating-cities.md' 
      }
    ],
    payment: [
      { 
        title: 'Currency Information', 
        url: 'https://sozovgqwftswrgcrvtff.supabase.co/storage/v1/object/public/test//payment.md' 
      },
      { 
        title: 'Mobile Payments', 
        url: '/markdown/payment/mobile-payments.md' 
      },
      { 
        title: 'ATMs and Banking', 
        url: '/markdown/payment/atms-banking.md' 
      }
    ],
    food: [
      { 
        title: 'Regional Cuisines', 
        url: '/markdown/food/regional-cuisines.md' 
      },
      { 
        title: 'Must-Try Dishes', 
        url: '/markdown/food/must-try-dishes.md' 
      },
      { 
        title: 'Dining Etiquette', 
        url: '/markdown/food/dining-etiquette.md' 
      }
    ],
    transportation: [
      { 
        title: 'Public Transit', 
        url: '/markdown/transportation/public-transit.md' 
      },
      { 
        title: 'Taxis and Ride-Sharing', 
        url: '/markdown/transportation/taxis-ride-sharing.md' 
      },
      { 
        title: 'Intercity Travel', 
        url: '/markdown/transportation/intercity-travel.md' 
      }
    ],
    communication: [
      { 
        title: 'Internet Access', 
        url: '/markdown/communication/internet-access.md' 
      },
      { 
        title: 'Useful Apps', 
        url: '/markdown/communication/useful-apps.md' 
      },
      { 
        title: 'Phone and SIM Cards', 
        url: '/markdown/communication/phone-sim-cards.md' 
      }
    ],
    culture: [
      { 
        title: 'Basic Phrases', 
        url: '/markdown/culture/basic-phrases.md' 
      },
      { 
        title: 'Cultural Etiquette', 
        url: '/markdown/culture/cultural-etiquette.md' 
      },
      { 
        title: 'Local Customs', 
        url: '/markdown/culture/local-customs.md' 
      }
    ]
  };
  
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        
        // 使用预定义的分类
        setCategories(Object.keys(categoryDocuments));
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load guide categories. Please try again later.');
        setIsLoading(false);
      }
    };
    
    loadCategories();
  }, [categoryDocuments]);
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleCategoryChange = (index) => {
    setSelectedCategory(categories[index]);
  };
  
  // 过滤文档基于搜索查询
  const getFilteredDocuments = (category) => {
    if (!searchQuery) return categoryDocuments[category] || [];
    
    return (categoryDocuments[category] || []).filter(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  // 分类图标映射
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
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={10}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            China Stopover Guide
          </Heading>
          <Text fontSize="xl" color="gray.600" _dark={{ color: 'gray.400' }}>
            Essential information for making the most of your time in China
          </Text>
        </Box>
        
        {/* Search Bar */}
        <InputGroup size="lg" mx="auto" maxW="600px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search for information..."
            value={searchQuery}
            onChange={handleSearch}
            borderRadius="full"
            bg={bgColor}
            borderColor={borderColor}
          />
        </InputGroup>
        
        {/* Main Content */}
        <Box
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow="md"
          overflow="hidden"
        >
          <Tabs isFitted variant="enclosed" onChange={handleCategoryChange}>
            <TabList>
              {categories.map((category) => (
                <Tab key={category}>
                  <HStack>
                    <Icon as={categoryIcons[category] || FaPassport} />
                    <Text textTransform="capitalize">{category}</Text>
                  </HStack>
                </Tab>
              ))}
            </TabList>
            
            <TabPanels>
              {categories.map((category) => (
                <TabPanel key={category} p={6}>
                  <VStack spacing={6} align="stretch">
                    {/* Category Header */}
                    <Flex align="center" mb={4}>
                      <Icon as={categoryIcons[category] || FaPassport} boxSize={8} color="brand.500" mr={3} />
                      <Heading as="h2" size="lg" textTransform="capitalize">
                        {category} Information
                      </Heading>
                    </Flex>
                    
                    {/* Category Content */}
                    <Accordion allowMultiple defaultIndex={[0]}>
                      {getFilteredDocuments(category).map((doc, index) => (
                        <AccordionItem key={index} border="none" mb={4}>
                          <AccordionButton 
                            bg="gray.50" 
                            _dark={{ bg: 'gray.600' }} 
                            borderRadius="md"
                            _hover={{ bg: 'gray.100', _dark: { bg: 'gray.500' } }}
                          >
                            <Box flex="1" textAlign="left" fontWeight="semibold">
                              {doc.title}
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel pb={4} pt={4} px={6}>
                            <VStack align="start" spacing={4}>
                              <Text>Click the button below to view the full document:</Text>
                              <Link href={doc.url} isExternal>
                                <Button rightIcon={<ExternalLinkIcon />} colorScheme="blue">
                                  View Markdown Document
                                </Button>
                              </Link>
                            </VStack>
                          </AccordionPanel>
                        </AccordionItem>
                      ))}
                    </Accordion>
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