import { Avatar, Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Icon, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
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
  const {user,chats,setChats,setSelectedChat,notification, setNotification}=useChatContext();
  // console.log(user);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  
  const [search,setSearch]=useState('')
  const [searchResult,setSearchResult]=useState([])
  const [loading,setLoading]=useState(false)
  const [loadingChat,setLoadingChat]=useState(false)
  const navigate=useNavigate();
  const toast=useToast();
  const logoutHandler
=()=>{
  localStorage.removeItem('userInfo');
  navigate('/');
  
}  

const handleSearch=async()=>{
  if(!search){
    toast({
      title:"Please Enter Something to Search",
      status:"warning",
      duration:5000,
      isClosable:true,
      position:"top-left",

    });
    return;
  }
  try{
    setLoading(true);
    const config={
      headers:{
        Authorization:`Bearer ${user.token}`,
      },
    };
    // console.log(config);
    
    const {data}=await axios.get(`http://localhost:5000/api/user?search=${search}`,config);
    console.log("data",data);
    
    setLoading(false);
    setSearchResult(data);
    
  }catch(err){
    toast({
      title:"Error Occured!",
      description:"Failed to Load the Search Results",
      status:"error",
      duration:5000,
      isClosable:true,
      position:"top-left",
    });
    
  }
};
const accessChat=async(userId)=>{
  try{
    setLoadingChat(true);
    const config={

      headers:{
        "Content-type":"application/json",
        Authorization:`Bearer ${user.token}`,
      },
    };
    const {data}=await axios.post("http://localhost:5000/api/chats",{userId},config);
    if(!chats.find((c)=> c._id===data._id)) {
     setChats([data,...chats])
    }
    setSelectedChat(data);
    setLoadingChat(false);
    onClose();
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
};
return (
    <>
    <Box 
    display={"flex"}
    justifyContent={"space-between"}
    alignItems={"center"}
    bg={"white"}
    w={"100%"}
    p={"5px 10px 5px 10px"}
    borderWidth={"5px"}
    >
      <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>
        <Button variant={"ghost"} ref={btnRef}
        onClick={onOpen}>
        <FontAwesomeIcon icon={faMagnifyingGlass}  />
        <Text display={{base:"none",md:'flex'}} px={'4'}>
          Search Users
        </Text>

        </Button>

      </Tooltip>
      <Text fontSize={"2xl"}
      fontFamily={"cursive"}>
        Chat-Room
      </Text>
      <Box display={"flex"} alignItems={"center"} gap={"10px"}>
      <Menu>
      <MenuButton p={1}>
        <Box position="relative" display="inline-block">
          <i className="fas fa-bell text-2xl"></i>
          <BellIcon fontSize="2xl" m={1} />
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
        {!notification.length && "No new Messages"}
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

    {/* Profile Menu */}
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
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
    <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
        
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users..</DrawerHeader>

          <DrawerBody>
            <Box display={'flex'}
            pb={2}>
              <Input
            placeholder='Search by name or email'
            mr={2}
            value={search}
            onChange={(e)=>setSearch(e.target.value)} />
             <Button colorScheme='green'
             onClick={handleSearch}>Search</Button>

            </Box>

            {loading?(
              <ChatLoading/>
            ):(
              searchResult?.map((user)=>(
                <UserListItem
                key={user.id}
                user={user}
                handleFunction={()=>accessChat(user._id)}/>
              ))
            )}
            {loadingChat && <Spinner ml={"auto"} display={"flex"}/>}
            {loadingChat && <Spinner ml="auto" d="flex"/>}
          </DrawerBody>

          {/* <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Save</Button>
          </DrawerFooter> */}
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer