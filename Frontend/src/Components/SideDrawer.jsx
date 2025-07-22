import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import logo from '../assets/images/logo.png'; 

import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { useChatContext } from '../context/ChatProvider';
import { Profile } from './Profile';
import { useNavigate } from 'react-router-dom';
import ChatLoading from './ChatLoading';
import UserListItem from './UserListItem';
import axios from 'axios';
import { getSender } from '../config/ChatLogics';

function SideDrawer() {
  const { user, chats, setChats, setSelectedChat, notification, setNotification } = useChatContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please Enter Something to Search',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      toast({
        title: 'Error Occurred!',
        description: 'Failed to Load the Search Results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post('http://localhost:5000/api/chats', { userId }, config);
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (err) {
      toast({
        title: 'Error fetching the chat',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgGradient="linear(to-r, purple.500, blue.400)"
        _hover={{ bgGradient: 'linear(to-r, purple.600, blue.500)' }}
        w="100%"
        p="5px 10px"
        borderBottomWidth="3px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button
  variant="ghost"
  ref={btnRef}
  onClick={onOpen}
  color="white"
  _hover={{
    bg: 'white',
    color: 'black',
    svg: { color: 'black' }, 
  }}
>
  <FontAwesomeIcon icon={faMagnifyingGlass} color="inherit" />
  <Text display={{ base: 'none', md: 'flex' }} px="4" color="inherit">
    Search Users
  </Text>
</Button>

        </Tooltip>


  <img
    src={logo}
    alt="Talk-A-Tive Logo"
    style={{ maxHeight: '60px', objectFit: 'contain', margin: '0 auto' }}
  />



        <Box display="flex" alignItems="center" gap="10px">
          <Menu>
            <MenuButton p={1}>
              <Box position="relative" display="inline-block">
                <BellIcon fontSize="2xl" color="whiteAlpha.900" />
                {notification.length > 0 && (
                  <Box
                    position="absolute"
                    top="-5px"
                    right="-5px"
                    bg="red.500"
                    color="white"
                    fontSize="xs"
                    fontWeight="bold"
                    borderRadius="full"
                    px="2"
                    py="1"
                  >
                    {notification.length}
                  </Box>
                )}
              </Box>
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && 'No new Messages'}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} bg="transparent" color="#4b2b93">
              <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList>
              <Profile user={user}>
                <MenuItem>My Profile</MenuItem>
              </Profile>
              <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      {/* DRAWER START */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent
          maxW="340px"
          bg="rgba(255, 255, 255, 0.15)"
          backdropFilter="blur(8px)"
          borderRadius="md"
          mt={{ base: "20px", md: "40px" }}
          mx="auto"
        >
          <DrawerCloseButton />
          <DrawerHeader
            textAlign="center"
            fontWeight="bold"
            fontSize="xl"
            bg="#96d2f0"
            color="#4b2b93"
            borderTopRadius="md"
          >
            Search Users
          </DrawerHeader>

          <DrawerBody px={4} pt={2}>
            <Box display="flex" gap="2" pb={4}>
              <Input
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                bg="#f0f0f0"
              />
              <Button bg="#7c4dff" color="white" _hover={{ bg: '#5b2dd8' }} onClick={handleSearch}>
                Go
              </Button>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
