import React, { useEffect, useState } from 'react';
import { useChatContext } from '../context/ChatProvider';
import {
  Box,
  Button,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './GroupChatModal';

function MyChats({ fetchAgain }) {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = useChatContext();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("http://localhost:5000/api/chats", config);
      setChats(data);
    } catch (err) {
      toast({
        title: "Error fetching the chat",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="#cce8ff" // Light blue background to match Ghibli theme
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      height="100%"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="monospace"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        color="#4B2B93"
        fontWeight="bold"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "14px", md: "12px", lg: "14px" }}
            rightIcon={<AddIcon />}
            bg="#6B46C1"
            color="white"
            _hover={{ bg: "#553C9A" }}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#e6f3ff"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflow="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#4B2B93" : "#A18AF7"} // selected: dark purple, unselected: light purple
                color={selectedChat === chat ? "white" : "white"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                _hover={{
                  bg: selectedChat === chat ? "#4B2B93" : "#8E7FE0",
                  color: "white",
                }}
              >
                <Text fontWeight="bold">
                  {!chat.isGroupChat && chat.users?.length >= 2
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName || "Unknown"}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}

export default MyChats;
