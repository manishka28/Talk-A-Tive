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
  StackDivider,
  Button,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [show, setShow] = useState(false);
  const [pic, setPic] = useState();
  const toast=useToast();
  const[loading,setLoading]=useState(false)
  const navigate = useNavigate();



  const handlePassClick = () => setShow(!show);
  const postDetails=(pics)=>{
    setLoading(true);
    if(pics==undefined){
      toast({
        title:"Please Select an Image!",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"top",
      });
      return;
    }
    if(pics.type==="image/jpeg" || pics.type==="image/png"){
      const data=new FormData();
      data.append("file",pics);
      data.append("upload_preset","chat-app")
      data.append("cloud_name","dsp2ilvtc");
      fetch("https://api.cloudinary.com/v1_1/dsp2ilvtc/image/upload",{
        method:'post',
        body:data,
      }).then((res)=>res.json())
      .then(data=>{
        setPic(data.url.toString());
        console.log(data.url.toString());
        toast({
          title:"Image Uploaded Successfully!",
          status:"success",
          duration:5000,
          isClosable:true,
          position:"top",
        });
        setLoading(false);
      })
      .catch((err)=>{
        console.log(err);
        setLoading(false);
      });
    }else{
      toast({
        title:"Please Select an Image!",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"top",
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler=async ()=>{
    setLoading(true);
    if(!name || !email || !phone ||!password || !confirmPass){
      toast({
        title:"Please Fill all the Fields!",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"top",
      });
      setLoading(false);
      return;
    }
    if(password!==confirmPass){
      toast({
        title:"Passwords Do Not Match!",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"top",
      });
      return;
    }

    try{
      const config={
        headers:{
          "Content-type":"application/json",
        },
      };
      const {data}=await axios.post("http://localhost:5000/api/user",
        {name,email,phone,password,pic},
        config
      );
      toast({
        title:"Registration Successful",
        status:"success",
        duration:5000,
        isClosable:true,
        position:"top",
      });

      localStorage.setItem('userInfo',JSON.stringify(data));
      setLoading(false);
      navigate('/chats');

    }catch(err){
      console.log(err);
      

      toast({
        title:"Some Error Occurred",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"top",
      });
      setLoading(false);

    }

  };

  return (
    
    <VStack
      divider={<StackDivider borderColor="gray.200" />}
      spacing="5px"
      align="stretch"
    >
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          borderColor="black"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          borderColor="black"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="phone" isRequired>
        <FormLabel>Phone Number</FormLabel>
        <Input
          placeholder="Enter Your Phone Number"
          borderColor="black"
          onChange={(e) => setPhone(e.target.value)}
        />
      </FormControl>

      <FormControl id="pass" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
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

      <FormControl id="confirm-pass" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder="Enter Your Password"
            borderColor="black"
            onChange={(e) => setConfirmPass(e.target.value)}
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
      <FormControl id="pic">
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
        type="file"
        p={1.5}
        accept='"image/*'
        onChange={(e)=>postDetails(e.target.files[0])}/>
      </FormControl>
      <Button
      colorScheme="green"
      width="100%"
      style={{marginTop:15}}
      onClick={submitHandler}
      isLoading={loading}>
        Sign Up
      </Button>
    </VStack>
  );
}

export default SignUp;
