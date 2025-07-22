import { Avatar, Box, Text } from '@chakra-ui/react';
import React from 'react';

function UserListItem({ user, handleFunction }) {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="purple.700"
      _hover={{
        bg: "purple.600",
        transform: "scale(1.02)",
      }}
      transition="all 0.2s"
      color="white"
      w="100%"
      display="flex"
      alignItems="center"
      px={4}
      py={3}
      mb={2}
      borderRadius="lg"
      boxShadow="md"
    >
      <Avatar
        mr={3}
        size="sm"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text fontWeight="semibold">{user.name}</Text>
        <Text fontSize="xs" color="whiteAlpha.800">
          <b>Email:</b> {user.email}
        </Text>
      </Box>
    </Box>
  );
}

export default UserListItem;
