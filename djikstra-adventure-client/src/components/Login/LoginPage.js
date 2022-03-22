import React, { useState } from "react";
import Login from "./Login";
// import Register from "./Register";

const postAction = (e, action) => {
  console.log("yo");
};

const LoginPage = () => {
  return (
    <React.Fragment>
      <Login />
    </React.Fragment>
  );
};

export default LoginPage;
