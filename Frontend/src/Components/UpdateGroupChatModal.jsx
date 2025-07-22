import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, chakra, FormControl, IconButton, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useChatContext } from '../context/ChatProvider';
import UserBadgeItem from './UserBadgeItem';
import axios from 'axios';
import UserListItem from './UserListItem';

function UpdateGroupChatModal({fetchAgain,setFetchAgain,fetchMessages}) {
  const {isOpen,onOpen,onClose}=useDisclosure();
  const {selectedChat,setSelectedChat,user}=useChatContext();
  const [groupChatName,setGroupChatName]=useState();
  const [search,setSearch]=useState("");
  const [searchResult,setSearchResult]=useState([]);
  const [loading,setLoading]=useState(false);
  const [renameLoading,setRenameLoading]=useState(false);
  const toast=useToast();
  const handleRemove=async(user1)=>{
    
    if(selectedChat.groupAdmin._id!==user._id && user1._id !== user._id){
      toast({
        title:"Only admins can remove someone !",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`,
        },
      };

      const {data}=await axios.put("http://localhost:5000/api/chats/groupremove",{
        chatId:selectedChat._id,
        userId:user1._id,
      },
    config);
    user1._id === user._id ? setSelectedChat():setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title:"Error Occurred",
        status:"error.response.data.message",
        duration:5000,
        isClosable:true,
        position:"bottom",
      });
      setLoading(false);
    }

   };
  const handleRename=async()=>{
    if(!groupChatName) return 

    try {
      setRenameLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      console.log(user.token);
      

      const {data}=await axios.put(`http://localhost:5000/api/chats/rename`,{
        chatId:selectedChat._id,
        chatName:groupChatName,
      },
    config
  );
  setSelectedChat(data);
  setFetchAgain(!fetchAgain);
  setRenameLoading(false);
    } catch (error) {
      toast({
        title:"Error Occured !",
        description:error.response.data.message,
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom",
      }

      );
      setRenameLoading(false);
      
    }
    setGroupChatName("");


  }
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
   const handleAddUser=async(user1)=>{
    if(selectedChat.users.find((u)=>u._id===user1._id)){
      toast({
        title:"User Already in Group !",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom"
      });
      return;
    }
    if(selectedChat.groupAdmin._id!==user._id){
      toast({
        title:"Only admins can add someone !",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`,
        },
      };

      const {data}=await axios.put("http://localhost:5000/api/chats/groupadd",{
        chatId:selectedChat._id,
        userId:user1._id,
      },
    config);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title:"Error Occurred",
        status:"error.response.data.message",
        duration:5000,
        isClosable:true,
        position:"bottom",
      });
      setLoading(false);
    }

   };
  return (
    <>
    <IconButton onClick={onOpen} display={{base:"flex"}} icon={<ViewIcon/>}></IconButton>
    <Modal
            
            onClose={onClose}
            isOpen={isOpen}
            
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
              fontSize={'35px'}
              fontFamily={'monospace'}
              display={'flex'}
              justifyContent={'center'}>{selectedChat.chatName}</ModalHeader>
              <ModalCloseButton />
              <ModalBody
              display={'flex'}
              flexDir={'column'}
              alignItems={'center'}
              justifyContent={'space-between'}
              >
                <Box w={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
                  {selectedChat.users.map((user)=>(
                    <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleFunction={()=>handleRemove(user)}
                    />
                  ))}

                </Box>
                <FormControl>
                  <Input 
                  placeholder='Chat Name'
                  mt={3}
                  value={groupChatName}
                  onChange={(e)=> setGroupChatName(e.target.value)}/>
                  <Button 
                  variant={"solid"}
                  color='teal'
                  ml={1}
                  isLoading={renameLoading}
                  onClick={handleRename}>Update</Button>
                </FormControl>
                <FormControl>
                  <Input 
                  placeholder='Add User to Group '
                  mb={1}
                  
                  onChange={(e)=> handleSearch(e.target.value)}
                  />
                  
                </FormControl>
                {loading?(
                  <Spinner size={"lg"}/>
                ):(
                  searchResult?.map((user)=>(
                    <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={()=>handleAddUser(user)}/>
                  ))

                )}
              </ModalBody>
              <ModalFooter>
                <Button onClick={()=>handleRemove(user)} color='red'>
                  Leave Group
                </Button>
                {/* <Button variant='ghost'>Secondary Action</Button> */}
              </ModalFooter>
            </ModalContent>
          </Modal>
    </>
  )
}

export default UpdateGroupChatModal