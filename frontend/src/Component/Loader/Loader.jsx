/** @format */

import React from "react";
import ChatBot from "../../Assets/96188-chatbot-animation.json";
import lottie from "lottie-web";
import { Box } from "@chakra-ui/react";

const Loader = () => {
  React.useEffect(() => {
    lottie.loadAnimation({
      container: document.querySelector("#react-logo"),
      animationData: ChatBot,
    });
  }, []);

  return (
    <Box className='loader_container'>
      <Box id='react-logo' />
      <span className='loader_text'>Select user to start chatting</span>
    </Box>
  );
};

export default Loader;
