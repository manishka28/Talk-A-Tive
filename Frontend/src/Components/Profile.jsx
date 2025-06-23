import { ViewIcon } from "@chakra-ui/icons"
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react"

export function Profile({user,children}) {
  // console.log(user);
  
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      {/* <Button onClick={onOpen}>My Profile</Button> */}
      {children ?(
        <span onClick={onOpen}>{children}</span>
      ):(
        <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>
      )}
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset='slideInBottom'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize={'40px'}
          fontFamily={'monospace'}
          display={'flex'}
          justifyContent={'center'}>Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display={'flex'}
          flexDir={'column'}
          alignItems={'center'}
          justifyContent={'space-between'}
          >
            <Image 
            borderRadius={"full"}
            boxSize={"150px"}
            src={user.pic}
            alt={user.name} 
            />
            <Text
            fontSize={{base:"28px",md:"30px"}}
            fontFamily={'mono'}>
              Name:{user.name}

            </Text>
            <Text
            fontSize={{base:"28px",md:"30px"}}
            fontFamily={'mono'}>
              Email:{user.email}

            </Text>
            <Text
            fontSize={{base:"28px",md:"30px"}}
            fontFamily={'mono'}>
              Phone:{user.phone}

            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            {/* <Button variant='ghost'>Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}