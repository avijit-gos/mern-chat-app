/** @format */

import React from "react";
import lottie from "lottie-web";
import TypingAnimation from "../../Assets/Typing.json";

const Typing = () => {
  React.useEffect(() => {
    lottie.loadAnimation({
      container: document.querySelector("#react-typing"),
      animationData: TypingAnimation,
    });
  }, []);

  return (
    <div>
      <span id='react-typing' />
    </div>
  );
};

export default Typing;
