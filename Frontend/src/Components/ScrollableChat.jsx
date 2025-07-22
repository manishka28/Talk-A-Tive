import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from '../config/ChatLogics';
import { Avatar, Tooltip, Box, Text } from '@chakra-ui/react';
import { useChatContext } from '../context/ChatProvider';

function ScrollableChat({ messages }) {
  const { user, selectedChat } = useChatContext();

  const isGroupChat = selectedChat?.isGroupChat;

  return (
    <Box
      h="100%"
      maxH="calc(100vh - 250px)"
      overflowY="auto"
      px={3}
      bg="rgba(255, 255, 255, 0.05)"
      backdropFilter="blur(12px)"
      WebkitBackdropFilter="blur(12px)"
      borderRadius="lg"
      sx={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      <ScrollableFeed>
        {messages &&
          messages.map((m, i) => {
            const isReceiver = m.sender._id !== user._id;

            return (
              <div style={{ display: 'flex', flexDirection: 'column' }} key={m._id}>
  {isGroupChat && isReceiver && (
    <Text
      fontSize="xs"
      color="black"
      ml={(isSameSenderMargin(messages, m, i, user._id) || 0)} 
      fontWeight="semibold"
      mb="2px" // closer to message
    >
      {m.sender.name}
    </Text>
  )}

  <div style={{ display: 'flex', alignItems: 'center' }}>
    {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
      <Avatar
        mt="7px"
        mr={1}
        size="sm"
        cursor="pointer"
        name={m.sender.name}
        src={m.sender.pic}
      />
    )}
    <span
      style={{
        backgroundColor: m.sender._id === user._id ? '#8f7eea' : '#413c91',
        color: 'white',
        marginLeft: isSameSenderMargin(messages, m, i, user._id),
        marginTop: isSameUser(messages, m, i, user._id) ? 3 : 4,
        borderRadius: '20px',
        padding: '5px 15px',
        maxWidth: '75%',
      }}
    >
      {m.content}
    </span>
  </div>
</div>

            );
          })}
      </ScrollableFeed>
    </Box>
  );
}

export default ScrollableChat;
