/** @format */

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  Spinner,
  Tag,
  TagLabel,
  Avatar,
  TagCloseButton,
} from "@chakra-ui/react";
import { MyChatState } from "../../Context/Context";
import ChatList from "../ChatLists/ChatList";
import MyModal from "../MyModal/MyModal";
import UserComponent from "../UserList/User.Comp";

const LeftComp = () => {
  const {
    chatList,
    setChatList,
    call,
    token,
    user,
    setCall,
    setUserList,
    userList,
  } = MyChatState();
  const [openModal, setOpenModal] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [selectUser, setSelectUser] = useState([]);
  const [fnCall, setFnCall] = useState(false);
  const [addUsers, setAddUsers] = useState([]);

  // Fetch all user related chats
  React.useEffect(() => {
    var axios = require("axios");
    var config = {
      method: "get",
      url: "http://localhost:5000/api/chat/",
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };

    axios(config)
      .then(function (response) {
        setChatList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [call, token]);

  const searchUser = () => {
    setIsLoading(true);
    var axios = require("axios");

    var config = {
      method: "get",
      url: `http://localhost:5000/api/user/search/user?search=${search}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };

    axios(config)
      .then(function (response) {
        setUserList(response.data);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleSelectUser = (userData) => {
    setSelectUser((prev) => [...prev, userData]);
    setAddUsers((prev) => [...prev, userData._id]);
    setSearch("");
    setUserList([]);
  };

  useEffect(() => {
    if (selectUser.length < 1 || !name.trim()) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [name, userList, fnCall]);

  const removeUser = (id) => {
    setSelectUser(selectUser.filter((user) => user._id !== id));
    setAddUsers(addUsers.filter((userId) => userId !== id));
    if (selectUser.length < 1) {
      setFnCall((p) => !p);
    } else {
      setFnCall((p) => !p);
    }
  };

  const createGroupChat = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      groupName: name,
      users: JSON.stringify(addUsers),
    });

    var config = {
      method: "post",
      url: "http://localhost:5000/api/chat/create/group",
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <Box className='left_container'>
      {openModal && (
        <MyModal
          isOpen={openModal}
          onClose={setOpenModal}
          title='Create group'
          body={
            <Box className='modal_body_container'>
              <Input
                type='text'
                placeholder='Enter a group name'
                className='input_field'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                type='search'
                placeholder='Search users to add in group'
                className='input_field'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={searchUser}
              />
              <Box>
                {(userList || []).length > 0 &&
                  userList.map((userData) => (
                    <Box
                      key={userData._id}
                      className='user_card'
                      onClick={() => handleSelectUser(userData)}>
                      <Avatar
                        src={userData.profile_img || ""}
                        className='profile_card_avatar'
                      />
                      <span className='card_name'>{userData.name}</span>
                    </Box>
                  ))}
              </Box>

              {/* User Tags */}
              {(selectUser || []).length > 0 &&
                selectUser.map((userData) => (
                  <Tag className='tag' key={userData._id}>
                    <TagLabel>{userData.name}</TagLabel>
                    <TagCloseButton onClick={() => removeUser(userData._id)} />
                  </Tag>
                ))}

              <Box className='modal_btn_container'>
                <Button
                  className='modal_btn'
                  disabled={isDisable}
                  onClick={createGroupChat}>
                  {isLoading ? <Spinner /> : <>Create</>}
                </Button>
              </Box>
            </Box>
          }
        />
      )}
      <Box className='left_container_header'>
        <Button className='group_chat_btn' onClick={() => setOpenModal(true)}>
          Create group chat
        </Button>
      </Box>

      {/* User chat list */}
      <Box className='chat_list_container'>
        {(chatList || []).length > 0 &&
          chatList.map((chatData) => (
            <ChatList chatData={chatData} key={chatData._id} user={user} />
          ))}
      </Box>
    </Box>
  );
};

export default LeftComp;
