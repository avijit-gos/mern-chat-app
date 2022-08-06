/** @format */

import React from "react";
import { Input, Box } from "@chakra-ui/react";

const MyInput = ({ type, value, placeholder, className, onChange }) => {
  return (
    <Box>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        className={className}
        onChange={(e) => onChange(e)}
      />
    </Box>
  );
};

export default MyInput;
