import React, { useEffect } from 'react';
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import LogIn from './LogIn';
import SignUp from './SignUp';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate=useNavigate();
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("userInfo"));
    if(!user){
      navigate('/');

    }
  },[navigate]);
  return (
    <div className='h-screen bg-[url("https://img.freepik.com/premium-vector/hand-drawn-comic-book-speech-bubble-speak-calling-callout-seamless-pattern-background_8580-927.jpg?semt=ais_hybrid")] bg-cover bg-center bg-repeat-y'>
      <Container maxW="xl" centerContent>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          p={3}
          bg="#FFFDD0"
          w="100%"
          m="40px 0 15px 0"
          borderRadius="lg"
          borderWidth="1px"
          boxShadow="lg"
        >
          <Text fontSize="2xl" fontWeight="bold">
            Chat-Room
          </Text>
        </Box>
        <Box 
        bg="#FFFDD0"
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        color="black"
        >
        
          <Tabs 
          variant='soft-rounded' colorScheme='green'>
  <TabList mb="1em">
    <Tab width="50%">Log In</Tab>
    <Tab width="50%">Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <LogIn/>
   </TabPanel>
    <TabPanel>
      <SignUp/>
    </TabPanel>
  </TabPanels>
</Tabs>
        
          
        </Box>
      </Container>
    </div>
  );
}

export default Home;
