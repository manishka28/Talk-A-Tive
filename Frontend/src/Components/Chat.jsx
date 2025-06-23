import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useChatContext } from '../context/ChatProvider';
import SideDrawer from './SideDrawer';
import MyChats from './MyChats';
import ChatBox from './ChatBox';
import { Box } from '@chakra-ui/react';

function Chat() {
  const{user}=useChatContext();
  const [fetchAgain,setFetchAgain]=useState(false);

  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer/> }
      <Box
      display={'flex'}
      justifyContent='space-between'
      w='100%'
      h='91.5vh'
      p='10px'>
        {user && <MyChats fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
    )
}

export default Chat