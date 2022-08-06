/** @format */

import React from "react";
import {
  Modal,
  Box,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

const MyModal = ({ isOpen, onClose, title, body }) => {
  return (
    <Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{body}</ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MyModal;
