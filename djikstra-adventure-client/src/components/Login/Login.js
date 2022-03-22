import React from "react";
import { useState, useEffect } from "react";
import "./Login.css";
import guard from "../../images/guard.jpg";

const Login = () => {
  // used to post the username and password to the database
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleLockClick() {
    setShowPassword(!showPassword);
  }

  //Creates the login page
  return (
    // Some ghetto line breaks, need to fix it with CSS in the future
    <div className="center">
      <br></br>
      <br></br>
      <img src={guard} alt="guard" class="image" />
      <br></br>
      <br></br>

      <label for="username">
        <b>Username</b>
      </label>
      <br></br>
      <input
        type="text"
        placeholder="Enter Username"
        onChange={(event) => {
          setUsername(event.target.value.toUpperCase());
          console.log(event.target.value.toUpperCase());
        }}
      />
      <br></br>
      <label for="password">
        <b>Password</b>
      </label>
      <i class="bi bi-eye-slash" id="togglePassword"></i>
      <br></br>
      <p>
        <input
          type="password"
          placeholder="Enter Password"
          onChange={(event) => {
            setPassword(event.target.value.toUpperCase());
            console.log(event.target.value.toUpperCase());
          }}
        />
      </p>
      <button className="button" type="login">
        Login
      </button>
      <button className="button" type="register">
        Register
      </button>
    </div>
  );
};
export default Login;
