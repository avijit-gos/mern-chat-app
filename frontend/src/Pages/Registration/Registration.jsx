/** @format */

import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { Link, useHistory } from "react-router-dom";
import MyInput from "../../Component/MyInput/MyInput";
import MyButton from "../../Component/MyButton/MyButton";

const Registration = () => {
  const toast = useToast();
  const history = useHistory();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDisable, setIsDisable] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [name, username, email, password]);

  const handleName = (e) => {
    setName(e.target.value);
  };
  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    setLoading(true);
    var axios = require("axios");
    var data = JSON.stringify({
      name: name,
      username: username,
      email: email,
      password: password,
    });

    var config = {
      method: "post",
      url: "http://localhost:5000/api/user/register",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response);
        if (response.status === 201) {
          setLoading(false);
          setIsDisable(true);
          setName("");
          setUsername("");
          setEmail("");
          setPassword("");
          toast({
            title: "Success",
            description: response.data.msg,
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          history.push("/");
        }
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
        setIsDisable(true);
        setName("");
        setUsername("");
        setEmail("");
        setPassword("");
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
        <Box className='auth_header'>Signup</Box>

        {/* Auth Form */}
        <Box className='auth_form_container'>
          <MyInput
            type={"text"}
            value={name}
            className='input_field'
            placeholder={"Enter name"}
            onChange={handleName}
          />

          <MyInput
            type={"text"}
            value={username}
            className='input_field'
            placeholder={"Enter username"}
            onChange={handleUsername}
          />

          <MyInput
            type={"email"}
            value={email}
            className='input_field'
            placeholder={"Enter email"}
            onChange={handleEmail}
          />

          <MyInput
            type={"password"}
            value={password}
            className='input_field'
            placeholder={"Enter password"}
            onChange={handlePassword}
          />

          <MyButton
            className={"auth_btn"}
            text='SignUp'
            disabled={isDisable}
            loading={loading}
            clickHandler={handleLogin}
          />

          {/* LINKS */}
          <Box className='links_container'>
            <Link to={"/signup"}>Already have an account?</Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Registration;
