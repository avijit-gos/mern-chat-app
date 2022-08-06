/** @format */

import { Avatar, Box } from "@chakra-ui/react";
import React from "react";

const UserComponent = ({ userData, createChat }) => {
  return (
    <Box className='user_card' onClick={() => createChat(userData._id)}>
      <Avatar
        src={userData.profile_img || ""}
        className='profile_card_avatar'
      />
      <span className='card_name'>{userData.name}</span>
    </Box>
  );
};

export default UserComponent;
