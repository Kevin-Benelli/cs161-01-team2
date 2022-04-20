import React from "react";
import { useState, useEffect, useRef } from "react";
import "./Login.css";
import guard from "../../images/guard.jpg";
import { Link } from "react-router-dom";
import SocketClient from "../SocketClient";
import Axios from "axios";
import Button from "react-bootstrap/Button";

const Login = () => {
  // used to post the username and password to the database
  const usernameRef = useRef();
  const passwordRef = useRef();

  const [loginResponse, setLoginResponse] = useState("");

  // const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");

    if (storedUserLoggedInInformation === "1") {
      setIsLoggedIn(true);
    }
  }, []);

  // useEffect(() => {
  //   Axios.get("http://localhost:5000/post_login").then((response) => {
  //     if (response.data.loggedIn == true) {
  //       setLoginResponse(response.data.user[0].username);
  //     }
  //   });
  // }, []);

  // Posts username and password for login or create account to server
  const postAction = (e, action) => {
    e.preventDefault(); // prevent refresh and submission
    const url = `http://localhost:5000/post_${action}`;
    console.log("URL: ", url);
    const enteredUsername = usernameRef.current.value;
    const enteredPassword = passwordRef.current.value;

    if (
      enteredPassword.length >= 5 &&
      enteredUsername.length >= 5 &&
      !isLoggedIn
    ) {
      try {
        Axios.post(url, {
          username: enteredUsername,
          password: enteredPassword,
        })
          .then((response) => {
            console.log(
              "client response:",
              response.data.message,
              response.data.error
            );
            if (response.data.error) {
              setLoginResponse(response.data.message);
              console.log("RES ERROR: ", response.data.error);
              return <h1> {response.data.message}</h1>;
            } else {
              setLoginResponse(response.data.message);
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
    } else if (enteredPassword.length >= 5 && enteredUsername.length <= 5) {
      setLoginResponse("Username must be greater or equal to 5 chars.");
    } else if (enteredPassword.length <= 5 && enteredUsername.length >= 5) {
      setLoginResponse("Password must be greater or equal to 5 chars.");
    } else {
      setLoginResponse(
        "Username and Password both must be greater or equal to 5 chars."
      );
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  //Creates the login page
  return (
    <React.Fragment>
      <div className="login_body">
        {!isLoggedIn && (
          // Some ghetto line breaks, need to fix it with CSS in the future
          <div className="center">
            <br></br>
            <br></br>
            <div className="card">
              <h1 className="title">C# is C Hashtag</h1>
              <img src={guard} alt="guard" className="image" />

              <br></br>

              <div class="login_content">
                <div class="login_header">Login or Register</div>
                <input
                  required
                  ref={usernameRef}
                  type="text"
                  placeholder="Username"
                  className="login_input"
                  onChange={(event) => {
                    // setUsername(event.target.value.toUpperCase());
                    console.log(event.target.value.toUpperCase());
                  }}
                  onKeyPress={(event) => {
                    // If user types message and presses enter then send the message
                    event.key === "Enter" && postAction(event, "login");
                  }}
                />
                <br></br>
                <i className="bi bi-eye-slash" id="togglePassword"></i>
                <br></br>

                <input
                  required
                  ref={passwordRef}
                  type="password"
                  placeholder="Password"
                  className="login_input"
                  onChange={(event) => {
                    // setPassword(event.target.value.toUpperCase());
                    console.log(event.target.value.toUpperCase());
                  }}
                  onKeyPress={(event) => {
                    // If user types message and presses enter then send the message
                    event.key === "Enter" && postAction(event, "login");
                  }}
                />
              </div>
              <br></br>
              <button
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

              {/* <Link to="/home" className="button">
            Admin Login
          </Link> */}
              <h5> {loginResponse} </h5>
            </div>
          </div>
        )}
      </div>
      {isLoggedIn && (
        <React.Fragment>
          <SocketClient onLogoutHandler={logoutHandler}> </SocketClient>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
export default Login;
