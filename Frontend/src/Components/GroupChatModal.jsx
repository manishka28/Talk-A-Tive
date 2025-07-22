import React, { useState } from "react";
import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useChatContext } from "../context/ChatProvider";
import axios from "axios";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";

function GroupChatModal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user, chats, setChats } = useChatContext();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      toast({
        title: "Error fetching users",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      toast({
        title: "Please fill in all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/chats/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New group chat created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      toast({
        title: "Error creating group chat",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.find((u) => u._id === userToAdd._id)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (userToDelete) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== userToDelete._id));
  };

  return (
    <>
      <span onClick={onOpen} style={{ cursor: "pointer" }}>
        {children}
      </span>

      <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent
          bg="#cce4f7"
          borderRadius="2xl"
          border="2px solid #aaa5d1"
          p={4}
        >
          <ModalHeader
            fontSize="2xl"
            textAlign="center"
            fontFamily="heading"
            color="#4b0082"
            mt={2}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton color="black" />

          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <Input
                  placeholder="Group Chat Name"
                  onChange={(e) => setGroupChatName(e.target.value)}
                  bg="#edf2fa"
                  borderRadius="md"
                  border="1px solid #b5a6d3"
                  _focus={{ borderColor: "#8f6cd4", boxShadow: "0 0 0 1px #8f6cd4" }}
                />
              </FormControl>

              <FormControl>
                <Input
                  placeholder="Add users by name or email"
                  onChange={(e) => handleSearch(e.target.value)}
                  bg="#edf2fa"
                  borderRadius="md"
                  border="1px solid #b5a6d3"
                  _focus={{ borderColor: "#8f6cd4", boxShadow: "0 0 0 1px #8f6cd4" }}
                />
              </FormControl>

              <Box display="flex" flexWrap="wrap" gap={2}>
                {selectedUsers.map((user) => (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleDelete(user)}
                  />
                ))}
              </Box>

              {loading ? (
                <Spinner alignSelf="center" />
              ) : (
                searchResult?.slice(0, 4).map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              w="full"
              borderRadius="lg"
              bgGradient="linear(to-r, purple.600, blue.400)"
              _hover={{ bgGradient: "linear(to-r, purple.700, blue.500)" }}
              color="white"
              fontWeight="semibold"
              onClick={handleSubmit}
            >
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupChatModal;
