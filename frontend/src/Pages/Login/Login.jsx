/** @format */

import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { Link, useHistory } from "react-router-dom";
import MyInput from "../../Component/MyInput/MyInput";
import MyButton from "../../Component/MyButton/MyButton";

const Login = () => {
  const toast = useToast();
  const history = useHistory();
  const [logUser, setLogUser] = useState("");
  const [password, setPassword] = useState("");
  const [isDisable, setIsDisable] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleUsernameChange = (e) => {
    setLogUser(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    if (!logUser.trim() || !password.trim()) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [logUser, password]);

  const loginHandler = () => {
    setLoading(true);
    var axios = require("axios");
    var data = JSON.stringify({
      logUser: logUser,
      password: password,
    });

    var config = {
      method: "post",
      url: "http://localhost:5000/api/user/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          console.log(response.data.token);
          setLogUser("");
          setPassword("");
          setIsDisable(true);
          setLoading(false);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          toast({
            title: "Success",
            description: response.data.msg,
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          history.push("/home");
        }
      })
      .catch(function (error) {
        console.log(error);
        setLogUser("");
        setPassword("");
        setIsDisable(true);
        setLoading(false);
        toast({
          title: "Error!",
          description: error.response.data.msg,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <Box className='auth_container'>
      <Box className='auth_box'>
        <Box className='auth_header'>Login</Box>

        {/* Auth Form */}
        <Box className='auth_form_container'>
          {/* USERNAME OR EMAIL */}
          <MyInput
            type={"text"}
            value={logUser}
            className='input_field'
            placeholder={"Enter username or email"}
            onChange={handleUsernameChange}
          />

          {/* PASSWORD */}
          <MyInput
            type={"password"}
            value={password}
            className='input_field'
            placeholder={"Enter password"}
            onChange={handlePassword}
          />

          {/* AUTH BUTTON */}
          <MyButton
            className={"auth_btn"}
            text='Login'
            disabled={isDisable}
            loading={loading}
            clickHandler={loginHandler}
          />
        </Box>

        {/* LINKS */}
        <Box className='links_container'>
          <Link to={"/signup"}>Don't have and account?</Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
