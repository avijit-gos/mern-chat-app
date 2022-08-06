/** @format */

import React, { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import Navbar from "../../Component/Navbar/Navbar";
import { MyChatState } from "../../Context/Context";
import LeftComp from "../../Component/LeftComp/LeftComp";
import RightComp from "../../Component/RightComp/RightComp";

const Home = () => {
  const { user, setUser, token, selectChatId } = MyChatState();
  useEffect(() => {
    var axios = require("axios");

    var config = {
      method: "get",
      url: "http://localhost:5000/api/user/",
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };

    axios(config)
      .then(function (response) {
        // console.log(response);
        setUser(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [token]);
  return (
    <Box className='home_container'>
      {/* Navbar */}
      <Navbar />

      <Box className='container_box'>
        {/* Left Side conatiner */}
        <LeftComp />
        {/* Right Side conatiner */}
        <RightComp selectChatId={selectChatId} />
      </Box>
    </Box>
  );
};

export default Home;
