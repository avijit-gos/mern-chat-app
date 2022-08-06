/** @format */

import {
  Avatar,
  Box,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Tag,
  TagLabel,
  TagCloseButton,
  Input,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { MyChatState } from "../../Context/Context";
import { FiMoreHorizontal } from "react-icons/fi";
import MyModal from "../MyModal/MyModal";
import { useToast } from "@chakra-ui/react";
import Typing from "../Loader/Typing";
import { GrClose } from "react-icons/gr";

const MessageHeader = ({ chatId, isTyping }) => {
  const toast = useToast();
  const { user, selectChatId, setSelectChatId, setUserList, userList } =
    MyChatState();
  const [headerData, setHeaderData] = React.useState(null);
  const [openMembersModal, setOpenMemberModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selectUser, setSelectUser] = useState([]);
  const [addUsers, setAddUsers] = useState([]);
  const [fnCall, setFnCall] = useState(false);

  React.useEffect(() => {
    var axios = require("axios");

    var config = {
      method: "get",
      url: "http://localhost:5000/api/chat/" + chatId,
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };

    axios(config)
      .then(function (response) {
        // console.log(response.data);
        setHeaderData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [chatId]);

  const removeUserFromGroup = (id) => {
    var axios = require("axios");
    var data = JSON.stringify({
      chatId: selectChatId,
    });

    var config = {
      method: "put",
      url: "http://localhost:5000/api/chat/remove/user/" + id,
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        headerData.users.filter((user) => user._id !== id);
        toast({
          title: "Sucess",
          description:
            "User removed from group. Please reload to make changes.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const searchUser = () => {
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
        // setIsLoading(false);
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

  const removeUser = (id) => {
    setSelectUser(selectUser.filter((user) => user._id !== id));
    setAddUsers(addUsers.filter((userId) => userId !== id));
    if (selectUser.length < 1) {
      setFnCall((p) => !p);
    } else {
      setFnCall((p) => !p);
    }
  };

  const addUserTogroup = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      chatId: "62e576d75b48b307856f623d",
      users: JSON.stringify(addUsers),
    });

    var config = {
      method: "put",
      url: "http://localhost:5000/api/chat/add/user",
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response);
        toast({
          title: "Sucess",
          description: response.data.msg,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setOpenMemberModal(false);
        setSelectUser([]);
        setAddUsers([]);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const closeChat = () => {
    setSelectChatId("");
  };

  return (
    <React.Fragment>
      {openMembersModal && (
        <MyModal
          isOpen={openMembersModal}
          onClose={setOpenMemberModal}
          title='Group Members'
          body={
            <Box className='modal_container'>
              {/* Members tag */}
              <Box className='members_container'>
                {headerData.users.map((user) => (
                  <Tag key={user._id} borderRadius='full' className='tag'>
                    <TagLabel>{user.name}</TagLabel>
                    {headerData.groupAdmin !== user._id && (
                      <TagCloseButton
                        onClick={() => removeUserFromGroup(user._id)}
                      />
                    )}
                  </Tag>
                ))}
              </Box>

              {/* Search user to add into group */}
              <Box>
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
                      <TagCloseButton
                        onClick={() => removeUser(userData._id)}
                      />
                    </Tag>
                  ))}
                <Box className='modal_btn_container'>
                  <Button className='modal_btn' onClick={addUserTogroup}>
                    Add
                  </Button>
                </Box>
              </Box>
            </Box>
          }
        />
      )}
      {headerData && (
        <Box className='message_header_container'>
          {!headerData.isGroupChat ? (
            <Box className='new_msg_header'>
              <Box>
                {headerData.users.map((userData) => (
                  <Box key={userData._id}>
                    {user._id !== userData._id && (
                      <Box className='message_header'>
                        <Avatar
                          src={userData.profile_img || ""}
                          className='message_avatar'
                        />
                        <Text className='message_sender_name_info'>
                          {userData.name}
                        </Text>

                        {isTyping && (
                          <span className='typing_indicator'>
                            <Typing />
                          </span>
                        )}
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
              <Button className='close_chat' onClick={closeChat}>
                <GrClose />
              </Button>
            </Box>
          ) : (
            <Box className='message_header_container'>
              <Box className='message_header'>
                <Avatar src={""} className='message_avatar' />
                <Text className='group_name'>{headerData.chatName}</Text>
              </Box>
              <Menu>
                <MenuButton
                  className='group_header_btn'
                  as={Button}
                  rightIcon={<FiMoreHorizontal />}></MenuButton>
                <MenuList>
                  <MenuItem
                    className='group_menu_item'
                    onClick={() => setOpenMemberModal(true)}>
                    Members
                  </MenuItem>
                  <MenuItem className='group_menu_item'>Settings</MenuItem>
                  <MenuItem className='group_menu_item' onClick={closeChat}>
                    Close chat
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          )}
        </Box>
      )}
    </React.Fragment>
  );
};

export default MessageHeader;
