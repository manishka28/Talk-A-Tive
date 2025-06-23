import React, { useEffect, useState } from 'react'
import { useChatContext } from '../context/ChatProvider'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './GroupChatModal';

function MyChats({fetchAgain}) {
  const [loggedUser,setLoggedUser]=useState();
  const {selectedChat,setSelectedChat,user,chats,setChats}=useChatContext();
  const toast=useToast();
  const fetchChats=async()=>{
  try{
    // setLoadingChat(true);
    const config={

      headers:{
        Authorization:`Bearer ${user.token}`,
      },
    };
    const {data}=await axios.get("http://localhost:5000/api/chats",config);
    console.log("data",data);
    
    setChats(data);
    console.log("chats",chats);
    
    // setLoadingChat(false);
    // onClose();
  }catch(err){
    console.log(err);
    
    toast({
      title:"Error fetching the chat",
      description:err.message,
      status:"error",
      duration:5000,
      isClosable:true,
      position:"top-left",
    });

  }
};
useEffect(()=>{
  setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
  fetchChats();
},[fetchAgain]);
  
  return (
    <Box
    display={{base:selectedChat?"none":"flex",md:"flex"}}
    flexDir={"column"}
    alignItems={"center"}
    p={3}
    bg="white"
    w={{base:"100%",md:"31%"}}
    borderRadius={"lg"}
    borderWidth={"1px"}>
      <Box
      pb={3}
      px={3}
      fontSize={{base:"28px",md:"30px"}}
      fontFamily={"monospace"}
      display={"flex"}
      w={"100%"}
      justifyContent={"space-between"}
      alignItems={"center"}>
        My Chats
        <GroupChatModal>
        <Button
        display={"flex"}
        fontSize={{base:"17px",md:"10px",lg:"17px"}}
        rightIcon={<AddIcon/>}>
          New Group Chat

        </Button>
        </GroupChatModal>

      </Box>
      <Box
      display={"flex"}
      flexDir={"column"}
      p={3}
      bg="#F8F9F8"
      w={"100%"}
      h={"100%"}
      borderRadius={"lg"}
      overflow={"hidden"}>
        {chats?(
          <Stack overflowY={"scroll"}>
            {chats.map((chat)=>(
              <Box
              onClick={()=>setSelectedChat(chat)}
              cursor={"pointer"}
              bg={selectedChat===chat? "#38B2AC":"#E8E8E8"}
              color={selectedChat===chat?"white":"black"}
              px={3}
              py={2}
              borderRadius={"lg"}
              key={chat._id}>
                <Text>
                  {!chat.isGroupChat ?(getSender(loggedUser,chat.users)):(chat.chatName)}
                </Text>
              </Box>
            ))}

          </Stack>
        ):(
          <ChatLoading/>
        )}

      </Box>

    </Box>
  )
}

export default MyChats