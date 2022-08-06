/** @format */

import React from "react";
import lottie from "lottie-web";
import LoadingData from "../../Assets/Loading.json";

const Loading = () => {
  React.useEffect(() => {
    lottie.loadAnimation({
      container: document.querySelector("#react-logo"),
      animationData: LoadingData,
      renderer: "svg", // "canvas", "html"
      loop: true, // boolean
      autoplay: true, // boolean
    });
  }, []);

  return (
    <div>
      <div id='react-logo' />
    </div>
  );
};

export default Loading;
