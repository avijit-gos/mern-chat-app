/** @format */

import { Avatar, Box } from "@chakra-ui/react";
import React from "react";
import { MyChatState } from "../../Context/Context";

const ChatList = ({ chatData, user }) => {
  const { setSelectChatId } = MyChatState();

  return (
    <Box className='chat_list' onClick={() => setSelectChatId(chatData._id)}>
      {/* Chat header */}
      <Box className='chat_header'>
        {chatData.isGroupChat ? (
          <Box className='group_chat_box'>
            <Avatar src={""} className='chat_list_avatar' />
            <span className='chat_sender_name'>{chatData.chatName}</span>
          </Box>
        ) : (
          <>
            {chatData.users.map((userData) => (
              <React.Fragment key={userData._id}>
                {userData._id !== user._id && (
                  <Box className='chat_box'>
                    <Box className='chat_box_header'>
                      <Avatar
                        src={userData.profile_img || ""}
                        className='chat_list_avatar'
                      />
                      <span className='chat_sender_name'>{userData.name}</span>
                    </Box>

                    {chatData.latestMsg && (
                      <Box className='content'>
                        {chatData.latestMsg.content}
                      </Box>
                    )}
                  </Box>
                )}
              </React.Fragment>
            ))}
          </>
        )}
      </Box>
    </Box>
  );
};

export default ChatList;
