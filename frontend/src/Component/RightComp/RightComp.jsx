/** @format */

import React, { useEffect, useState } from "react";
import { Box, Button, Input } from "@chakra-ui/react";
import MessageHeader from "../MessageHeader/MessageHeader";
import MessageBody from "../MessageBody/MessageBody";
import { BsEmojiLaughing } from "react-icons/bs";
import Picker from "emoji-picker-react";
import { MyChatState } from "../../Context/Context";
import Loader from "../Loader/Loader";
import io from "socket.io-client";

const END_POINT = "http://localhost:5000";
var socket, selectedChatCompare;

const RightComp = ({ selectChatId }) => {
  const { setCall, notifications, setNotifications } = MyChatState();
  const [messages, setMessages] = useState([]);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [content, setContent] = useState("");
  const [isDisable, setIsDisable] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  React.useEffect(() => {
    socket = io(END_POINT);
    socket.emit("create_room", JSON.parse(localStorage.getItem("user")));
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  React.useEffect(() => {
    if (selectChatId) {
      var axios = require("axios");

      var config = {
        method: "get",
        url: "http://localhost:5000/api/message/" + selectChatId,
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      };

      axios(config)
        .then(function (response) {
          // console.log(response.data);
          setMessages(response.data);
          socket.emit("join_chat", selectChatId);
          selectedChatCompare = selectChatId;
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [selectChatId]);

  const onEmojiClick = (event, emojiObject) => {
    setContent((prev) => prev + emojiObject.emoji);
  };

  const typingHandler = (e) => {
    setContent(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectChatId);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing)
        socket.emit("stop typing", selectChatId);
      setTyping(false);
    }, timerLength);
  };

  useEffect(() => {
    if (!content.trim()) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [content]);

  const createMessage = () => {
    socket.emit("stop typing", selectChatId);
    var axios = require("axios");
    var data = JSON.stringify({
      content: content,
      chatId: selectChatId,
    });

    var config = {
      method: "post",
      url: "http://localhost:5000/api/message",
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        // console.log(response);
        socket.emit("new message", response.data);
        setIsDisable(true);
        setContent("");
        setMessages((prev) => [...prev, response.data]);
        setCall((prev) => !prev);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useEffect(() => {
    socket
      .off("message recieved")
      .on("message recieved", (newMessageReceived) => {
        if (
          !selectedChatCompare ||
          selectedChatCompare !== newMessageReceived.chat._id
        ) {
          // Give notification
          if (!notifications.includes(newMessageReceived)) {
            setNotifications((prev) => [newMessageReceived, ...prev]);
            setCall((prev) => !prev);
          }
        } else {
          setMessages((prev) => [...prev, newMessageReceived]);
        }
      });
  });

  console.log(notifications);

  return (
    <Box className='right_container'>
      {selectChatId ? (
        <React.Fragment>
          {/* Message Header */}
          <MessageHeader chatId={selectChatId} isTyping={isTyping} />
          {/* Message Body */}
          <MessageBody messages={messages} />

          {/* Message Input */}
          <Box className='message_input_container'>
            <Input
              type='text'
              placeholder='Message...'
              value={content}
              onChange={(e) => typingHandler(e)}
            />
            <Button
              className='icon_btn'
              onClick={() => setOpenEmoji((p) => !p)}>
              <BsEmojiLaughing />
            </Button>
            <Button
              className='send_btn'
              disabled={isDisable}
              onClick={createMessage}>
              Send
            </Button>
          </Box>
          {openEmoji && (
            <Box className='emoji_container'>
              <Picker onEmojiClick={onEmojiClick} />
            </Box>
          )}
        </React.Fragment>
      ) : (
        <Loader />
      )}
    </Box>
  );
};

export default RightComp;
