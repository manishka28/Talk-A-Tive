import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  IconButton,
  Button,
  useToast,
  Heading,
  Text,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handlePassClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: 'Please fill all the fields!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { 'Content-type': 'application/json' },
      };
      const { data } = await axios.post(
        'http://localhost:5000/api/user/login',
        { email, password },
        config
      );
      toast({
        title: 'Login Successful!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      navigate('/chats');
    } catch (err) {
      toast({
        title: 'Some Error Occurred!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
    }
  };

  return (
    <Box
      w="full"
      p={0}
      color="white"
    >
      <VStack spacing={4} align="stretch">
        <Box textAlign="center" mb={2}>
          <Heading fontSize="xl">Welcome Back</Heading>
          <Text fontSize="sm" color="gray.300">
            Log in to access your chats
          </Text>
        </Box>

        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            bg="whiteAlpha.200"
            _placeholder={{ color: 'gray.300' }}
            _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px purple' }}
            color="white"
            borderRadius="md"
          />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              bg="whiteAlpha.200"
              _placeholder={{ color: 'gray.300' }}
              _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px purple' }}
              color="white"
              borderRadius="md"
            />
            <InputRightElement>
              <IconButton
                variant="ghost"
                aria-label="Toggle password visibility"
                icon={show ? <ViewOffIcon /> : <ViewIcon />}
                onClick={handlePassClick}
                size="sm"
                color="whiteAlpha.700"
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          bgGradient="linear(to-r, purple.500, blue.400)"
          _hover={{ bgGradient: 'linear(to-r, purple.600, blue.500)' }}
          width="full"
          mt={1}
          onClick={submitHandler}
          isLoading={loading}
          borderRadius="md"
          color="white"
        >
          Log In
        </Button>

        <Button
          variant="outline"
          borderColor="whiteAlpha.400"
          color="whiteAlpha.900"
          _hover={{ bg: 'whiteAlpha.200' }}
          width="full"
          onClick={() => {
            setEmail('guest@example.com');
            setPassword('123456');
          }}
          borderRadius="md"
        >
          Log In as Guest
        </Button>
      </VStack>
    </Box>
  );
}

export default LogIn;
