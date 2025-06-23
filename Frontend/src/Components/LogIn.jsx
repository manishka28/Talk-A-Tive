import {
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  IconButton,
  StackDivider,
  Button,
  Toast,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LogIn() {
  
    const [email, setEmail] = useState('');
    
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate();
    const toast=useToast();
      const handlePassClick = () => setShow(!show);

      const submitHandler=async()=>{
        setLoading(true);
        if(!email || !password){
          toast({
            title:"Please fill all the fields!",
            status:"warning",
            duration:5000,
            isClosable:true,
            position:"top",
          });
          setLoading(false);
          return;
        }

        try{
          const config={
            headers:{
              "Content-type":"application/json",
            },
          };
          const {data}=await axios.post("http://localhost:5000/api/user/login",
            {email,password},
            config
          );
          toast({
            title:"Login Successful!",
            status:"success",
            duration:5000,
            isClosable:true,
            position:"top",
          });
          localStorage.setItem("userInfo",JSON.stringify(data));
          setLoading(false);
          navigate("/chats");


        }catch(err){
          console.log(err);
          
          toast({
            title:"Some Error Occurred!",
            status:"error",
            duration:5000,
            isClosable:true,
            position:"top",
          });
          setLoading(false);

        }

      }

  return (
    <VStack
          divider={<StackDivider borderColor="gray.200" />}
          spacing="5px"
          align="stretch"
        >
          
    
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="Enter Your Email"
              borderColor="black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
    
         
    
          <FormControl id="pass" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                value={password}
                type={show ? 'text' : 'password'}
                placeholder="Enter Your Password"
                borderColor="black"
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement>
                <IconButton
                  aria-label={show ? 'Hide password' : 'Show password'}
                  icon={show ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={handlePassClick}
                  size="sm"
                  variant="ghost"
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button
          colorScheme="green"
          width="100%"
          style={{marginTop:15}}
          onClick={submitHandler}
          isLoading={loading}>
            Log In
          </Button>
          <Button
          colorScheme="red"
          width="100%"
          style={{marginTop:15}}
          onClick={()=>{
            setEmail("guest@example.com");
            setPassword("123456");
          }}>
            Log In As Guest User
          </Button>
        </VStack>
  )
}

export default LogIn