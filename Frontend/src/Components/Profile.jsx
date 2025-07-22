import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  Box,
  VStack,
} from "@chakra-ui/react";

export function Profile({ user, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen} style={{ cursor: "pointer" }}>
          {children}
        </span>
      ) : (
        <IconButton
          icon={<ViewIcon color="white" />}
          onClick={onOpen}
          variant="ghost"
          aria-label="View Profile"
        />
      )}

      <Modal isCentered onClose={onClose} isOpen={isOpen} motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent
          bg="#cce4f7"
          p={4}
          borderRadius="2xl"
          boxShadow="xl"
          border="2px solid #aaa5d1"
        >
          <ModalHeader
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            fontFamily="heading"
            textAlign="center"
            color="#4b0082"
          >
            User Profile
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={5} align="center">
              <Image
                borderRadius="full"
                boxSize="140px"
                src={user.pic}
                alt={user.name}
                objectFit="cover"
                border="3px solid #7f5dc2"
              />
              <Box textAlign="center">
                <Text fontSize="lg" fontWeight="semibold" color="#4b0082">
                  {user.name}
                </Text>
                <Text fontSize="md" color="gray.600">
                  {user.email}
                </Text>
                <Text fontSize="md" color="gray.600">
                  {user.phone}
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              w="full"
              rounded="lg"
              bgGradient="linear(to-r, purple.600, blue.400)"
              color="white"
              _hover={{ bgGradient: "linear(to-r, purple.700, blue.500)" }}
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
