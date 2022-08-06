/** @format */

import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Box,
} from "@chakra-ui/react";
import { MyChatState } from "../../Context/Context";
import UserComponent from "../UserList/User.Comp";
import Loading from "../Loading/Loading";

const DrawerComp = ({ isOpen, isClose, btnRef, value, onChange }) => {
  const { userList, setUserList, setCall } = MyChatState();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (value.trim()) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [value]);

  const onClose = () => {
    isClose(false);
  };

  const searchUser = () => {
    setLoading(true);
    var axios = require("axios");

    var config = {
      method: "get",
      url: `http://localhost:5000/api/user/search/user?search=${value}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };

    axios(config)
      .then(function (response) {
        setUserList(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const createChat = (userId) => {
    var axios = require("axios");
    var data = JSON.stringify({
      profileId: userId,
    });

    var config = {
      method: "post",
      url: "http://localhost:5000/api/chat/create",
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response);
        setCall((prev) => !prev);
        isClose(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search User</DrawerHeader>

          <DrawerBody>
            <Input
              placeholder='Type here...'
              value={value}
              onChange={(e) => onChange(e)}
              onKeyDown={searchUser}
            />

            <Box>
              {show && (
                <>
                  {loading ? (
                    <Loading />
                  ) : (
                    <>
                      {(userList || []).length > 0 && (
                        <Box className='drawer_body'>
                          {userList.map((user) => (
                            <UserComponent
                              userData={user}
                              key={user._id}
                              createChat={createChat}
                            />
                          ))}
                        </Box>
                      )}
                    </>
                  )}
                </>
              )}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default DrawerComp;
