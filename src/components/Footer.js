import React from 'react';
import { Box, Container, Stack, Text, Link, HStack, Divider, useColorModeValue } from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      mt="auto"
      py={6}
    >
      <Container
        maxW={'6xl'}
        py={4}
        textAlign="center"
      >
        <Stack spacing={4} align="center">
          <Text fontSize="sm">© {new Date().getFullYear()} China Stopover Guide. All rights reserved</Text>
          
          <Divider maxW="300px" />
          
          <HStack spacing={4} justify="center" fontSize="sm">
            <Text fontWeight="medium">Feedback:</Text>
            <HStack>
              <EmailIcon color="blue.500" />
              <Link href="mailto:2219172569@qq.com" color="blue.500">2219172569@qq.com</Link>
            </HStack>
            <HStack>
              <EmailIcon color="blue.500" />
              <Link href="mailto:llleemail@163.com" color="blue.500">llleemail@163.com</Link>
            </HStack>
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
} 