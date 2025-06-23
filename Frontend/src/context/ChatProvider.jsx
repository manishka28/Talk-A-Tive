import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo) {
        setUser(userInfo);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error("Error retrieving userInfo:", error);
      navigate('/');
    }
  }, [navigate]);

  return (
    <ChatContext.Provider value={{ user, setUser,selectedChat,setSelectedChat,chats,setChats,notification, setNotification }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
