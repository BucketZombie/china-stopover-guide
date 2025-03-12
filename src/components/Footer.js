import React from 'react';
import { Box, Container, Stack, Text, Link, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      mt="auto"
      py={6}
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Stack direction={'row'} spacing={6}>
          <Link as={RouterLink} to={'/'}>Home</Link>
          <Link as={RouterLink} to={'/report'}>Travel Report</Link>
          <Link as={RouterLink} to={'/guide'}>Travel Guide</Link>
          <Link as={RouterLink} to={'/emergency'}>Emergency</Link>
        </Stack>
        <Text>© {new Date().getFullYear()} China Stopover Guide. All rights reserved</Text>
      </Container>
    </Box>
  );
} 