import React from "react";
import { useState, useEffect, useRef } from "react";
import "./Login.css";
import guard from "../../images/guard.jpg";
import { Link } from "react-router-dom";
import SocketClient from "../SocketClient";
import Axios from "axios";
import axios from "axios";

const Login = () => {
  // used to post the username and password to the database
  const usernameRef = useRef();
  const passwordRef = useRef();

  const [errorMessage, setErrorMessage] = useState("");

  // const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");

    if (storedUserLoggedInInformation === "1") {
      setIsLoggedIn(true);
    }
  }, []);

  // Posts username and password for login or create account to server
  const postAction = (e, action) => {
    e.preventDefault(); // prevent refresh and submission
    const url = `http://localhost:5000/post_${action}`;
    console.log("URL: ", url);
    const enteredUsername = usernameRef.current.value;
    const enteredPassword = passwordRef.current.value;

    console.log("BRUHH: ", enteredUsername, enteredPassword);
    if (
      enteredPassword.length >= 5 &&
      enteredUsername.length >= 5 &&
      !isLoggedIn
    ) {
      try {
        axios
          .post(url, {
            username: enteredUsername,
            password: enteredPassword,
          })
          .then((response) => {
            console.log("client response:", response.error);
            if (response.data.error) {
              console.log("RES ERROR: ", response.error);
              return <h1> {response.message}</h1>;
            } else {
              console.log("success from client");
              localStorage.setItem("isLoggedIn", "1");
              setIsLoggedIn(true);
            }
          })
          .catch((error) => {
            console.log("Error from client: ", error);
          });
      } catch (error) {
        console.log("Bruhhh something went wrong: %s", error);
      }
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  //Creates the login page
  return (
    <React.Fragment>
      {!isLoggedIn && (
        // Some ghetto line breaks, need to fix it with CSS in the future
        <div className="center">
          <br></br>
          <br></br>
          <img src={guard} alt="guard" className="image" />
          <br></br>
          <br></br>

          <label for="username">
            <b>Username</b>
          </label>
          <br></br>
          <input
            required
            ref={usernameRef}
            type="text"
            placeholder="Enter Username"
            onChange={(event) => {
              // setUsername(event.target.value.toUpperCase());
              console.log(event.target.value.toUpperCase());
            }}
          />
          <br></br>
          <label for="password">
            <b>Password</b>
          </label>
          <i className="bi bi-eye-slash" id="togglePassword"></i>
          <br></br>
          <p>
            <input
              required
              ref={passwordRef}
              type="password"
              placeholder="Enter Password"
              onChange={(event) => {
                // setPassword(event.target.value.toUpperCase());
                console.log(event.target.value.toUpperCase());
              }}
            />
          </p>

          {/* <button
            // onChange={submitHandler}
            className="button"
            type="login"
            onClick={loginHandler}
          > */}
          <button
            // onChange={submitHandler}
            className="button"
            type="login"
            onClick={(e) => {
              postAction(e, "login");
            }}
          >
            Login
          </button>
          <button
            onClick={(e) => {
              postAction(e, "create_account");
            }}
            className="button"
            type="register"
          >
            Register
          </button>
        </div>
      )}

      {isLoggedIn && (
        <React.Fragment>
          <SocketClient onLogoutHandler={logoutHandler}> </SocketClient>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
export default Login;
