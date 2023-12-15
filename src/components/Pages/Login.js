import React, { useState, useContext } from "react";
import Context from "../Context/Context";
import { Link, useNavigate } from "react-router-dom";
import Header from "../UI/Header";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const context = useContext(Context);

  const updateUsernameHandler = (event) => {
    setUsername(event.target.value);
  };

  const updatePasswordHandler = (event) => {
    setPassword(event.target.value);
  };

  const navigate = useNavigate();

  const submitHandler = async (event) => {
    event.preventDefault();
    await fetch("/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "User not found") {
          alert("User not found");
        } else if (data.message === "User not authenticated") {
          alert("User not authenticated");
        } else {
          // alert("User authenticated");
          context.updateAuth(true);
          context.updateUserId(data.id);
          document.cookie =
            "loginToken=" + data.token + "; max-age=" + data.expires;
          document.cookie = "userID=" + data.id + "; max-age=" + data.expires;
          navigate("/");
        }
      });
  };

  const eyeOnClickHandler = (event) => {
    const passwordInput = document.getElementById("password");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      event.target.classList.remove("fa-eye");
      event.target.classList.add("fa-eye-slash");
    } else {
      passwordInput.type = "password";
      event.target.classList.remove("fa-eye-slash");
      event.target.classList.add("fa-eye");
    }
  };

  return (
    <>
      <div className="bg-whitesmoke container md:max-w-md max-w-xs grid grid-rows-5 mt-10 m-auto max-h-176 shadow-xl pl-3 pr-3 h-176 justify-center rounded-3xl">
        <h1 className=" text-5xl m-auto row-span-2 row-end-3">Book Review</h1>
        <form onSubmit={submitHandler} className="flex m-auto flex-col gap-5 ">
          {/* <label htmlFor="username">Username</label> */}
          <input
            type="text"
            id="username"
            onChange={updateUsernameHandler}
            placeholder="Username"
            className=" bg-transparent border-b-2 border-slate-800 focus:outline-none "
          />
          {/* <label htmlFor="password">Password</label> */}
          <div className="relative">
            <input
              type="password"
              id="password"
              onChange={updatePasswordHandler}
              placeholder="Password"
              className=" bg-transparent border-b-2 border-slate-800 focus:outline-none"
            />
            <i
              class="far fa-eye"
              id="togglePassword"
              onClick={eyeOnClickHandler}
              className="far fa-eye w-6"
            ></i>
          </div>
          
            <button type="submit" className="border-2 border-slate-300">Login</button>
            <Link to="/register" className="m-auto border-b-2 border-blue-300 hover:text-blue-400">Don't have an account?</Link>
          
        </form>
        {/* <p>{context.isAuthenticated ? "Authenticated" : "Not authenticated"}</p> */}
        {/* <p>{"User ID: " + context.userId}</p> */}
      </div>
    </>
  );
};

export default Login;
