/** @format */

import React from "react";
import { Box, Button, Spinner } from "@chakra-ui/react";

const MyButton = ({ className, clickHandler, disabled, text, loading }) => {
  return (
    <Box>
      <Button className={className} onClick={clickHandler} disabled={disabled}>
        {loading ? <Spinner /> : <>{text}</>}
      </Button>
    </Box>
  );
};

export default MyButton;
