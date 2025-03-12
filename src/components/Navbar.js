import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
  Image,
  Text,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

const Links = [
  { name: 'Home', path: '/' },
  { name: 'Travel Report', path: '/report' },
  { name: 'Travel Guide', path: '/guide' },
  { name: 'Emergency', path: '/emergency', isEmergency: true },
];

const NavLink = ({ children, path, isEmergency = false }) => (
  <Link
    as={RouterLink}
    to={path}
    px={2}
    py={1}
    rounded={'md'}
    fontWeight={'medium'}
    color={isEmergency ? 'white' : 'gray.800'}
    bg={isEmergency ? 'accent.500' : 'transparent'}
    _hover={{
      textDecoration: 'none',
      bg: isEmergency ? 'red.600' : 'gray.100',
    }}
  >
    {children}
  </Link>
);

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box 
      bg={useColorModeValue('white', 'gray.900')} 
      px={4} 
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={'center'}>
          <Box>
            <RouterLink to="/">
              <Flex alignItems="center">
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  bgGradient="linear(to-r, brand.500, brand.700)"
                  bgClip="text"
                >
                  China Stopover Guide
                </Text>
              </Flex>
            </RouterLink>
          </Box>
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            {Links.map((link) => (
              <NavLink key={link.name} path={link.path} isEmergency={link.isEmergency}>
                {link.name}
              </NavLink>
            ))}
          </HStack>
        </HStack>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            {Links.map((link) => (
              <NavLink key={link.name} path={link.path} isEmergency={link.isEmergency}>
                {link.name}
              </NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
} 