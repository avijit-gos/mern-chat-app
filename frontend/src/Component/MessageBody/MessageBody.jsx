/** @format */

import { Box } from "@chakra-ui/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import timeDifference from "../../Utils/getTime";
import { MyChatState } from "../../Context/Context";

const MessageBody = ({ messages }) => {
  const { user } = MyChatState();
  return (
    <Box className='messsage_container'>
      {(messages || []).length > 0 && (
        <>
          {messages.map((message) => (
            <Box
              key={message._id}
              className={
                message.sender._id === user._id
                  ? "message_send_by_me"
                  : "message_send_by_others"
              }>
              {/* Message header */}
              <Box className='message_header_info'>
                <span className='message_sender_name'>
                  {message.sender.name}
                </span>
                {/* <span className='time'>{message.createdAt}</span> */}
              </Box>

              {/* Message Body */}
              <Box className='message_body'>
                <span>{message.content}</span>
              </Box>
            </Box>
          ))}
        </>
      )}
    </Box>
  );
};

export default MessageBody;
