
import React, { useState } from 'react'
import { ViewIcon } from "@chakra-ui/icons"
import { Box, Button, FormControl, IconButton, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useToast } from "@chakra-ui/react"
import { useChatContext } from '../context/ChatProvider';
import axios from 'axios';
import UserListItem from './UserListItem';
import UserBadgeItem from './UserBadgeItem';

function GroupChatModal({children}) {
   const { isOpen, onOpen, onClose } = useDisclosure()
   const [groupChatName,setGroupChatName]=useState();
   const [selectedUsers,setselectedUsers]=useState([]);
   const [search,setSearch]=useState("");
   const [searchResult,setSearchResult]=useState([]);
   const [loading,setLoading]=useState();
   const toast=useToast();
   const {user,chats,setChats}=useChatContext();

   const handleSearch=async(query)=>{
    setSearch(query);
    if(!query){
      return;
    }
    try{
      setLoading(true)
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        },
      };

      const {data}=await axios.get(`http://localhost:5000/api/user?search=${search}`,config);
      console.log("data",data);
      setLoading(false);
      setSearchResult(data);

      

    }catch(err){
      toast({
        title:"Error fetching the chat",
        description:err.message,
        status:"error",
        duration:5000,
        isClosable:true,
        position:"top-left",
      });

    }

   }
   const handleSubmit=async()=>{
    if(!groupChatName || !selectedUsers){
      toast({
        title:"Please Fill out all the fields",
        description:err.message,
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"top",
      });
    }
    try {
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`,
        },
      };

      const {data}=await axios.post('http://localhost:5000/api/chats/group',{
        name:groupChatName,
        users:JSON.stringify(selectedUsers.map((u)=>u._id))
    },config);

    setChats([data,...chats]);
    onClose();
    toast({
      title:"New Group Chat Created",
      
      status:"success",
      duration:5000,
      isClosable:true,
      position:"top",
    });



      
    } catch (err) {
      toast({
        title:"Error fetching the chat",
        description:err.message,
        status:"error",
        duration:5000,
        isClosable:true,
        position:"top-left",
      });
      
    }

   }
   const handleGroup=(userToAdd)=>{
    if(selectedUsers.includes(userToAdd)){
      toast({
        title:"User Already added",
        description:err.message,
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"top",
      });
      return;
    }
    setselectedUsers([...selectedUsers,userToAdd]);

   }
   const handleDelete=(userToDelete)=>{
    setselectedUsers(selectedUsers.filter(sel=>sel._id!==userToDelete._id))

   }
   
   
  return (
      <>
        {/* <Button onClick={onOpen}>My Profile</Button> */}
       
          <span onClick={onOpen}>{children}</span>
        
        <Modal
          isCentered
          onClose={onClose}
          isOpen={isOpen}
          motionPreset='slideInBottom'
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
            fontSize={'35px'}
            fontFamily={'monospace'}
            display={'flex'}
            justifyContent={'center'}>Create Group Chat</ModalHeader>
            <ModalCloseButton />
            <ModalBody
            display={'flex'}
            flexDir={'column'}
            alignItems={'center'}
            justifyContent={'space-between'}
            >
              <FormControl>
                <Input placeholder='Chat Name' mb={3}
                onChange={(e)=>setGroupChatName(e.target.value)}/>
                <Input placeholder='Add Users' mb={1}
                onChange={(e)=>handleSearch(e.target.value)}/>
                
              </FormControl>
              <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
              {selectedUsers.map((user)=>(
                <UserBadgeItem key={user._id}
                user={user}
                handleFunction={()=>handleDelete(user)}/>
              ))}
              </Box>
              {loading?<Spinner/>:(searchResult?.slice(0,4).map((user)=>(
                <UserListItem
                key={user._id}
                user={user}
                handleFunction={()=>handleGroup(user)}/>
              )))}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                Create Chat
              </Button>
              {/* <Button variant='ghost'>Secondary Action</Button> */}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default GroupChatModal