import React, { useEffect, useState } from "react";
import { useChatContext } from "../context/ChatProvider";
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { Profile } from "./Profile";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import io from "socket.io-client";
import animationData from "../animations/typing.json";
const ENDPOINT="http://localhost:5000";
let socket,selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const [message,setMessage]=useState([]);
  const [loading,setLoading]=useState(false);
  const [newMessage,setnewMessage]=useState();
  const [socketConnected,setSocketConnected]=useState(false);
  const { user, selectedChat, setSelectedChat,notification, setNotification } = useChatContext();
  const [typing,setTyping]=useState(false);
  const [isTyping,setIsTyping]=useState(false);
  const toast=useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages=async()=>{
    if(!selectedChat) return;
    try {
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`,
        },
    }
    setLoading(true);

    const {data}=await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`,
      config
    );
    setMessage(data);
    setLoading(false);
    console.log(message);
    socket.emit("joinRoom",selectedChat._id);
    
    
   } catch (error) {
    toast({
      title:"Error Occurred !",
      description:"Failed to load  messages",
      status:"error",
      duration:5000,
      isClosable:true,
      position:"bottom",
    });
    }
  };
  const sendMessage=async(event)=>{
    if(event.key==="Enter" && newMessage){
      socket.emit("stopTyping",selectedChat._id);
      try {
        const config={
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${user.token}`,
          },
        };
        setnewMessage("");

        const {data}=await axios.post("http://localhost:5000/api/message",{
          content:newMessage,
          chatId:selectedChat._id,
        },
      config
    );
    console.log(data);
    
        socket.emit("sendMessage",data);
        setMessage([...message,data]);
      } catch (error) {
        toast({
          title:"Error Occurred !",
          description:"Failed to send the message",
          status:"error",
          duration:5000,
          isClosable:true,
          position:"bottom",
        });
      }
    }

  }
  useEffect(() => {
    if (!socket) {
      socket = io(ENDPOINT);
      socket.emit("setup", user);
      socket.on("connected", () => setSocketConnected(true));
    }
  
    // Cleanup previous listeners before adding new ones
    socket.off("Typing");
    socket.off("StopTyping");
  
    socket.on("Typing", () => setIsTyping(true));
    socket.on("StopTyping", () => setIsTyping(false));
  
    return () => {
      socket.off("Typing");
      socket.off("StopTyping");
    };
  }, []);
  

  useEffect(()=>{
    fetchMessages();

    selectedChatCompare=selectedChat;
  },[selectedChat]);

  useEffect(() => {
    socket.on("sendMessage", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }

      } else {
        setMessage([...message, newMessageRecieved]);
      }
    });
  }); 
  

 



  let typingTimeout;

  const typingHandler = (e) => {
    setnewMessage(e.target.value);
    if (!socketConnected) return;
  
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
  
    // Clear previous timeout
    if (typingTimeout) clearTimeout(typingTimeout);
  
    // Set new timeout
    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", selectedChat._id);
      setTyping(false);
    }, 3000);
  };
  

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat?(
              <>
              {getSender(user,selectedChat.users)}
              <Profile user= {getSenderFull(user,selectedChat.users)}/>

              </>
            ):(
              <>
              {selectedChat.chatName}
              <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}
              fetchMessages={fetchMessages}/>

              </>

            )}
          </Text>
          <Box
          display={"flex"}
          flexDir={"column"}
          justifyContent={"flex-end"}
          p={3}
          bg={"#E8E8E8"}
          w={"100%"}
          h={"100%"}
          borderRadius={"lg"}
          overflowY={"hidden"}>
            {loading ? (
              <Spinner
              size={"xl"}
              w={20}
              h={20}
              alignSelf={"center"}
              margin={"auto"}/>
            ):(
              <>
              <Box>
                <ScrollableChat messages={message}/>
              </Box>
              </>
            )}
            <FormControl
            onKeyDown={sendMessage}
            isRequired mt={3}>
              {isTyping?  <Lottie options={defaultOptions} height={50} width={70}
              style={{ marginBottom: 15, marginLeft: 0 }}
              />:<></>}
              <Input
              placeholder="Enter a message ..."
              variant={"filled"}
              bg={"E0E0E0"}
              onChange={typingHandler}
              value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h={"100%"} w={"100%"}>
          <Text fontSize="3xl" pb={3} fontFamily="monospace">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
