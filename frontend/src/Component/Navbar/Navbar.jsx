/** @format */

import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { AiOutlineUser } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import MyModal from "../MyModal/MyModal";
import { BsFillCameraFill } from "react-icons/bs";
import { MyChatState } from "../../Context/Context";
import DrawerComp from "../Drawer/DrawerComp";
import { FaBell } from "react-icons/fa";

const Navbar = () => {
  const { user, setToken, notifications, setSelectChatId } = MyChatState();
  const [openModal, setOpenModal] = useState(false);
  const [image, setImage] = useState("");
  const [imagePrev, setImagePrev] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!imagePrev.trim()) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [imagePrev]);

  const handleFileChange = (e) => {
    setImagePrev(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };

  // Upload profile image
  const uploadImage = () => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("x-access-token", localStorage.getItem("token"));

    var formdata = new FormData();
    formdata.append("image", image);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch("http://localhost:5000/api/user/upload/image", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        localStorage.setItem("token", result.token);
        setToken(localStorage.getItem("token"));
        setImage("");
        setImagePrev("");
        setIsDisable(true);
        setIsLoading(false);
        setOpenModal(false);
      })
      .catch((error) => {
        console.log("error", error);
        setImage("");
        setImagePrev("");
        setIsDisable(true);
        setIsLoading(false);
        setOpenModal(false);
      });
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <>
      {user && (
        <Box className='navbar_container'>
          {/* Modal */}
          {openModal && (
            <MyModal
              isOpen={openModal}
              onClose={setOpenModal}
              title='Profile'
              body={
                <Box className='modal_body'>
                  <Box className='avatar_container'>
                    <Avatar
                      src={!imagePrev ? user.profile_img : imagePrev}
                      className='modal_avatar'
                    />
                    <label htmlFor='file' className='cam_icon'>
                      <BsFillCameraFill />
                    </label>
                    <Input
                      type='file'
                      className='input_file'
                      id='file'
                      onChange={(e) => handleFileChange(e)}
                    />
                  </Box>
                  <Text className='user_name'>{user && user.name}</Text>
                  <Text className='user_username'>{user && user.username}</Text>

                  <Box className='modal_footer'>
                    <Button
                      className='upload_btn'
                      disabled={isDisable}
                      onClick={uploadImage}>
                      {isLoading ? <Spinner /> : <>Upload</>}
                    </Button>
                  </Box>
                </Box>
              }
            />
          )}
          {/* Drawer */}{" "}
          {openDrawer && (
            <DrawerComp
              isOpen={openDrawer}
              isClose={setOpenDrawer}
              search={search}
              value={search}
              onChange={handleSearch}
            />
          )}
          {/* DRAWER BUTTON */}
          <Button
            className='drawer_btn'
            onClick={() => setOpenDrawer((prev) => !prev)}>
            Create new chat
          </Button>
          {/* APP NAME */}
          <Text className='navbar_text'>Chat App</Text>
          {/* PROFILE MENU */}
          <Box>
            <Menu className='menu'>
              <MenuButton as={Button} className='menu_btn'>
                <Box
                  className={notifications.length > 0 && "notification_bell"}>
                  <FaBell />
                  <span
                    className={notifications.length > 0 && "nofication_length"}>
                    {notifications.length || ""}
                  </span>
                </Box>
              </MenuButton>
              {(notifications || []).length > 0 ? (
                <>
                  {notifications.map((notification) => (
                    <MenuList className='menu_list' key={notification._id}>
                      <MenuItem
                        className='menu_item'
                        onClick={() => setSelectChatId(notification.chat._id)}>
                        New message from{" "}
                        <span className='notification_username'>
                          {notification.sender.name}
                        </span>
                      </MenuItem>
                    </MenuList>
                  ))}
                </>
              ) : (
                <MenuList className='menu_list'>
                  <MenuItem className='menu_item'>No notification</MenuItem>
                </MenuList>
              )}
            </Menu>

            {/* Profile view */}
            <Menu className='menu'>
              <MenuButton as={Button} className='menu_btn'>
                <Avatar
                  src={user && user.profile_img}
                  className='profile_avatar'
                />
              </MenuButton>
              <MenuList className='menu_list'>
                <MenuItem
                  className='menu_item'
                  onClick={() => setOpenModal(true)}>
                  <span className='menu_icon'>
                    <AiOutlineUser />
                  </span>
                  Profile
                </MenuItem>
                <MenuItem className='menu_item'>
                  <span className='menu_icon'>
                    <FiLogOut />
                  </span>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Navbar;
