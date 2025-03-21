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
  Progress,
  Badge,
  Image,
  Icon,
  Grid,
  GridItem,
  Tag,
  Tooltip,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { generateAIReport, saveParamsDirectly } from '../services/api';
import { runDifyWorkflow } from '../services/difyApi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  ArrowBackIcon, 
  DownloadIcon, 
  ViewIcon, 
  CalendarIcon, 
  TimeIcon
} from '@chakra-ui/icons';

// Mock data for dropdowns (这些数据也可以从API获取)
const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
  'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados',
  'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China',
  'Colombia', 'Comoros', 'Democratic Republic of the Congo','Republic of the Congo',
  'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti',
  'Dominica', 'Dominican Republic', 'East Timor (Timor-Leste)', 'Ecuador', 'Egypt', 'El Salvador',
  'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon',
  'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras',
  'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast ', 'Jamaica',
  'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, North', 'Korea, South', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia',
  'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 
  'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco',
  'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands',
  'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama',
  'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'São Tomé and Príncipe', 
  'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 
  'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 
  'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 
  'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 
  'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

const chineseCities = [
  'Anhui-Hefei', 'Anhui-Huangshan', 'Beijing', 'Chongqing', 'Fujian-Fuzhou', 'Fujian-Nanping', 'Fujian-Quanzhou', 'Fujian-Xiamen',
  'Guangdong-Guangzhou', 'Guangdong-Jieyang', 'Guangdong-Shenzhen', 'Guangxi -Beihai', 'Guilin-Nanning', 'Guizhou-Guiyang', 
  'Hainan-Haikou', 'Hainan-Sanya', 'Hebei-Qinhuangdao', 'Hebei-Shijiazhuang', 'Heilongjiang-Harbin', 
  'Henan-Zhengzhou', 'Hubei-Wuhan', 'Hunan-Changsha', 'Hunan-Zhangjiajie', 'Jiangsu-Lianyungang', 'Jiangsu-Nanjing', 
  'Jiangsu-Wuxi', 'Jiangsu-Yangzhou', 'Jiangxi-Nanchang', 'Liaoning-Dalian', 'Liaoning-Shenyang', 'Shandong-Jinan', 
  'Shandong-Qingdao', 'Shandong-Weihai', 'Shandong-Yantai', "Shaanxi-Xi'an",'Shanghai',
  'Shanxi-Taiyuan', 'Sichuan-Chengdu','Tianjin', 'Yunnan-Kunming', 'Yunnan-Lijiang', 'Zhejiang-Hangzhou', 'Zhejiang-Jinhua', 
  'Zhejiang-Ningbo', 'Zhejiang-Wenzhou', 'Zhejiang-Zhoushan'
];

export default function ReportPage() {
  const [formData, setFormData] = useState({
    departure_country: '',
    destination: '',
    stopover_date: '',
    stopover_duration: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [processingStep, setProcessingStep] = useState(0); // 0: 未开始, 1: 保存参数, 2: 生成报告
  
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const sectionBgColor = useColorModeValue('gray.50', 'gray.800');
  const titleColor = useColorModeValue('red.600', 'red.300');
  const reportDate = new Date().toLocaleDateString();
  const currentYear = new Date().getFullYear();

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
    setProcessingStep(0);
    
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
      // 第一步：先保存参数到API服务器
      setProcessingStep(1);
      console.log('第1步：正在保存参数到API服务器...', formData);
      let saveResponse;
      
      try {
        // 等待参数保存完成，确保API服务器已收到参数
        saveResponse = await saveParamsDirectly(formData);
        console.log('参数保存成功:', saveResponse);
        
        if (!saveResponse.success) {
          throw new Error(saveResponse.error || '参数保存失败');
        }
        
        toast({
          title: 'Parameters Saved',
          description: 'Your travel parameters have been saved to API server.',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (saveError) {
        console.error('参数保存失败:', saveError);
        throw new Error(`Failed to save parameters: ${saveError.message}`);
      }
      
      // 第二步：等待一小段时间确保参数已经在API服务器中可用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 第三步：调用Dify工作流生成报告
      setProcessingStep(2);
      console.log('第3步：开始生成报告...');
      
      // 直接调用Dify工作流
      toast({
        title: 'Generating Report',
        description: 'Calling Dify workflow with saved parameters. This may take a minute...',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
      
      // 使用workflowRunId作为用户ID，确保Dify可以关联到正确的参数
      const userId = saveResponse.workflowRunId || `user-${Date.now()}`;
      const difyResult = await runDifyWorkflow(formData, userId);
      const reportData = difyResult.data;
      
      // 第四步：设置报告并显示
      console.log('第4步：报告生成完成，更新UI');
      setReport(reportData);
      
      toast({
        title: 'Report Generated',
        description: 'Your travel report has been successfully generated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error:', error);
      setApiError(error.message);
      toast({
        title: 'Error',
        description: `${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      setProcessingStep(0);
    }
  };

  const resetForm = () => {
    setFormData({
      departure_country: '',
      destination: '',
      stopover_date: '',
      stopover_duration: '',
    });
    setReport(null);
    setApiError(null);
  };

  // 获取用户友好的目的地城市名称（用于展示）
  const getFriendlyCityName = (code) => {
    // 从城市代码中提取城市名称，去掉省份前缀
    if (code.includes('-')) {
      return code.split('-')[1];
    }
    return code;
  };

  // 获取城市对应的背景图片URL
  const getCityImageUrl = (city) => {
    // 从城市代码中提取城市名称，用于查找图片
    const cityName = getFriendlyCityName(city);
    
    const cityImages = {
      'Beijing': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80',
      'Shanghai': 'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?auto=format&fit=crop&q=80',
      'Guangzhou': 'https://images.unsplash.com/photo-1573876375992-6fcf11e5e2e8?auto=format&fit=crop&q=80',
      'Shenzhen': 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?auto=format&fit=crop&q=80',
      'Chengdu': 'https://images.unsplash.com/photo-1568301856220-8d0dc08a6d48?auto=format&fit=crop&q=80',
      'Xi\'an': 'https://images.unsplash.com/photo-1566618501523-c7ecc157bfac?auto=format&fit=crop&q=80',
      'Hangzhou': 'https://images.unsplash.com/photo-1583049108928-5dc3a9024e41?auto=format&fit=crop&q=80',
      'Nanjing': 'https://images.unsplash.com/photo-1584450150050-4b9bdbd51f68?auto=format&fit=crop&q=80',
      'Chongqing': 'https://images.unsplash.com/photo-1591709177980-c9a4e11e9ba6?auto=format&fit=crop&q=80',
      'Xiamen': 'https://images.unsplash.com/photo-1568872380067-c8582e38a476?auto=format&fit=crop&q=80',
      'Huangshan': 'https://images.unsplash.com/photo-1528742242457-3cea5e5f6887?auto=format&fit=crop&q=80',
      'Guilin': 'https://images.unsplash.com/photo-1537706544195-29e96ed30be9?auto=format&fit=crop&q=80',
      'Kunming': 'https://images.unsplash.com/photo-1609484295469-8edb677e751d?auto=format&fit=crop&q=80',
    };
    
    return cityImages[cityName] || 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&q=80'; // 默认中国风景图
  };

  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
              
              {isLoading && (
                <Box mt={4}>
                  <Progress 
                    value={processingStep === 1 ? 30 : processingStep === 2 ? 70 : 0} 
                    size="sm" 
                    colorScheme="blue" 
                    hasStripe
                    isAnimated
                  />
                  <Text fontSize="sm" textAlign="center" mt={2} color="gray.600">
                    {processingStep === 1 
                      ? "Step 1: Saving parameters to API server..." 
                      : processingStep === 2 
                        ? "Step 2: Generating report via Dify Workflow..."
                        : "Processing..."}
                  </Text>
                </Box>
              )}
            </VStack>
          </Box>
        ) : (
          <Box>
            {/* 报告标题卡片，带有城市背景图 */}
            <Box 
              position="relative"
              height="240px"
              mb={6}
              borderRadius="xl"
              overflow="hidden"
              boxShadow="xl"
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bgImage={`url(${getCityImageUrl(formData.destination)})`}
                bgSize="cover"
                bgPosition="center"
                filter="brightness(0.7)"
                zIndex={0}
              />
              
              <Flex
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="rgba(0,0,0,0.4)"
                zIndex={1}
                direction="column"
                justify="center"
                align="center"
                p={6}
                color="white"
                textAlign="center"
              >
                <Heading size="2xl" mb={4} fontWeight="bold">
                  {getFriendlyCityName(formData.destination)} Travel Guide
                </Heading>
                <Text fontSize="xl" fontWeight="medium" mb={3}>
                  {formatDate(formData.stopover_date)} · {formData.stopover_duration} Hours
                </Text>
                <HStack mt={2}>
                  <Tag size="lg" colorScheme="red" borderRadius="full" px={3}>
                    <HStack>
                      <CalendarIcon />
                      <Text>{formatDate(formData.stopover_date)}</Text>
                    </HStack>
                  </Tag>
                  <Tag size="lg" colorScheme="purple" borderRadius="full" px={3}>
                    <HStack>
                      <TimeIcon />
                      <Text>{formData.stopover_duration} hours</Text>
                    </HStack>
                  </Tag>
                </HStack>
              </Flex>
            </Box>
            
            {/* 报告内容和操作按钮 */}
            <Box 
              bg={cardBgColor}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              borderWidth="1px"
              borderColor={borderColor}
              mb={6}
            >
              <VStack align="stretch" spacing={4}>
                <Flex justify="space-between" align="center" wrap="wrap">
                  <HStack spacing={6} mb={{ base: 4, md: 0 }}>
                    <Box>
                      <Text fontWeight="bold" color="gray.500" fontSize="sm">From</Text>
                      <Text fontWeight="medium">{formData.departure_country}</Text>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="bold" color="gray.500" fontSize="sm">To</Text>
                      <Text fontWeight="medium">{getFriendlyCityName(formData.destination)}, China</Text>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="bold" color="gray.500" fontSize="sm">Date</Text>
                      <Text fontWeight="medium">{formatDate(formData.stopover_date)}</Text>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="bold" color="gray.500" fontSize="sm">Duration</Text>
                      <Text fontWeight="medium">{formData.stopover_duration} hours</Text>
                    </Box>
                  </HStack>
                  
                  <HStack spacing={2}>
                    <Button 
                      leftIcon={<ArrowBackIcon />}
                      colorScheme="blue" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setReport(null)}
                    >
                      Back to Form
                    </Button>
                    <Button 
                      colorScheme="green" 
                      variant="outline" 
                      size="sm"
                      onClick={resetForm}
                    >
                      New Report
                    </Button>
                  </HStack>
                </Flex>
                
                <Divider />
                
                <Box>
                  <HStack justifyContent="space-between" mb={4}>
                    <Heading size="lg" color={titleColor}>
                      {report.title || `${getFriendlyCityName(formData.destination)} Stopover Guide`}
                    </Heading>
                    
                    <HStack spacing={2}>
                      <Tooltip label="Download as PDF">
                        <Button leftIcon={<DownloadIcon />} colorScheme="blue" size="sm">
                          Download
                        </Button>
                      </Tooltip>
                      <Tooltip label="Print report">
                        <Button leftIcon={<ViewIcon />} colorScheme="gray" size="sm">
                          Print
                        </Button>
                      </Tooltip>
                    </HStack>
                  </HStack>
                  
                  <Divider borderColor="red.200" borderWidth="2px" mb={6} />
                  
                  {report.markdown ? (
                    <Box className="markdown-content" 
                      p={4} 
                      bg={sectionBgColor} 
                      borderRadius="md"
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {report.markdown}
                      </ReactMarkdown>
                    </Box>
                  ) : (
                    <>
                      <Text fontSize="lg" color="gray.700" fontStyle="italic">
                        {report.introduction}
                      </Text>
                      
                      {report.sections.map((section, index) => (
                        <Box key={index} pt={4}>
                          <Heading as="h3" size="md" mb={3} color="blue.600">
                            {section.title}
                          </Heading>
                          <Box 
                            p={4} 
                            bg={sectionBgColor} 
                            borderRadius="md"
                            borderLeft="4px solid" 
                            borderLeftColor="blue.400"
                          >
                            <Text whiteSpace="pre-line">{section.content}</Text>
                          </Box>
                          {index < report.sections.length - 1 && <Divider my={6} />}
                        </Box>
                      ))}
                    </>
                  )}
                </Box>
              </VStack>
            </Box>
            
            {/* 页脚信息 */}
            <Box textAlign="center" pt={2} pb={6} color="gray.500">
              <Text fontSize="sm">
                Report generated for {formData.departure_country} to {getFriendlyCityName(formData.destination)} on {reportDate}
              </Text>
              <Text fontSize="xs" mt={1}>
                © {currentYear} China Stopover Guide
              </Text>
            </Box>
          </Box>
        )}
      </VStack>
    </Container>
  );
} 