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

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [show, setShow] = useState(false);
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handlePassClick = () => setShow(!show);

  const postDetails = (pics) => {
    setLoading(true);
    if (!pics) {
      toast({
        title: 'Please select an image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
      const data = new FormData();
      data.append('file', pics);
      data.append('upload_preset', 'chat-app');
      data.append('cloud_name', 'dsp2ilvtc');
      fetch('https://api.cloudinary.com/v1_1/dsp2ilvtc/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          toast({
            title: 'Image uploaded successfully!',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top',
          });
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: 'Please select a JPEG or PNG image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !phone || !password || !confirmPass) {
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

    if (password !== confirmPass) {
      toast({
        title: 'Passwords do not match!',
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
        'http://localhost:5000/api/user',
        { name, email, phone, password, pic },
        config
      );
      toast({
        title: 'Registration successful!',
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
    title: err.response?.data?.message || 'Registration failed!',
    description: err.response?.data?.error || 'Something went wrong. Please try again.',
    status: 'error',
    duration: 5000,
    isClosable: true,
    position: 'top',
  });
  setLoading(false);
}

  };

  return (
    <Box w="full" p={0} color="white">
      <VStack spacing={4} align="stretch">
        <Box textAlign="center" mb={2}>
          <Heading fontSize="xl">Create Your Account</Heading>
          <Text fontSize="sm" color="gray.300">
            Join the chat in seconds
          </Text>
        </Box>

        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            bg="whiteAlpha.200"
            _placeholder={{ color: 'gray.300' }}
            _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px purple' }}
            color="white"
            borderRadius="md"
          />
        </FormControl>

        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            bg="whiteAlpha.200"
            _placeholder={{ color: 'gray.300' }}
            _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px purple' }}
            color="white"
            borderRadius="md"
          />
        </FormControl>

        <FormControl id="phone" isRequired>
          <FormLabel>Phone</FormLabel>
          <Input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
              placeholder="Password"
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

        <FormControl id="confirmPass" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? 'text' : 'password'}
              placeholder="Confirm password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
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

        <FormControl id="pic">
          <FormLabel>Upload Picture</FormLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
            p={1}
            color="gray.200"
            borderRadius="md"
          />
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
          Sign Up
        </Button>
      </VStack>
    </Box>
  );
}

export default SignUp;
