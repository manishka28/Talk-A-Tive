import { CloseIcon } from '@chakra-ui/icons';
import { Box, Text } from '@chakra-ui/react';
import React from 'react';

function UserBadgeItem({ user, handleFunction }) {
  return (
    <Box
      px={3}
      py={1}
      borderRadius="xl"
      m={1}
      mb={2}
      bgGradient="linear(to-r, purple.600, purple.800)"
      color="white"
      fontWeight="medium"
      fontSize="sm"
      display="flex"
      alignItems="center"
      cursor="pointer"
      onClick={handleFunction}
      _hover={{ opacity: 0.9 }}
    >
      <Text mr={2}>{user.name}</Text>
      <CloseIcon fontSize="xs" />
    </Box>
  );
}

export default UserBadgeItem;
