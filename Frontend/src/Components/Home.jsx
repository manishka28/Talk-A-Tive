import React, { useEffect } from 'react';
import logo from '../assets/images/logo.png'; 

import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import LogIn from './LogIn';
import SignUp from './SignUp';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user) navigate('/chats');
  }, [navigate]);

  return (
    <Box
      minH="100vh"
      bgImage="url('https://static.vecteezy.com/system/resources/previews/009/362/398/non_2x/blue-dynamic-shape-abstract-background-suitable-for-web-and-mobile-app-backgrounds-eps-10-vector.jpg')"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={4}
      py={6}
    >
      <Container
        maxW={{ base: '95%', sm: '80%', md: '400px' }}
        p={{ base: 4, sm: 5 }}
        borderRadius="xl"
        boxShadow="2xl"
        bg="rgba(54, 54, 163, 0.6)" // matching purple tone
        backdropFilter="blur(16px)"
        border="1px solid rgba(255, 255, 255, 0.2)"
        color="white"
      >
        <Box textAlign="center" mb={3}>
  <img
    src={logo}
    alt="Talk-A-Tive Logo"
    style={{ maxHeight: '60px', objectFit: 'contain', margin: '0 auto' }}
  />
</Box>


        <Tabs variant="soft-rounded" colorScheme="purple" isFitted>
          <TabList mb={2}>
            <Tab fontSize="sm" color="white">Log In</Tab>
            <Tab fontSize="sm" color="white">Sign Up</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0} py={1}>
              <LogIn />
            </TabPanel>
            <TabPanel px={0} py={1}>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
}

export default Home;
