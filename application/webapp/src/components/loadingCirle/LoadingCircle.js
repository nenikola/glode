import React from "react";
import "./LoadingCircle.css";

const LoadingCircle = (props) => {
  return (
    <div className={props.active ? "loading-circle" : "loading-circle active"}>
      <div className="loader">Loading...</div>
    </div>
  );
};

export default LoadingCircle;
