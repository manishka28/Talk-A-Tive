import React from 'react'
import { useChatContext } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SIngleChat from './SIngleChat';

function ChatBox({fetchAgain,setFetchAgain}) {
  const {selectedChat}=useChatContext();
  return (
    <Box
    display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
    alignItems="center"
    flexDir="column"
    p={3}
    bg="white"
    w={{ base: "100%", md: "68%" }}
    borderRadius="lg"
    borderWidth="1px">
    <SIngleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
}

export default ChatBox