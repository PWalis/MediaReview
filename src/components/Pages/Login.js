import React, { useState, useContext } from "react";
import Context from "../Context/Context";

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
    <div>
      <form onSubmit={submitHandler}>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" onChange={updateUsernameHandler} />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" onChange={updatePasswordHandler} />
        <i
          class="far fa-eye"
          id="togglePassword"
          onClick={eyeOnClickHandler}
        ></i>
        <button type="submit">Login</button>
      </form>
      <p>{context.isAuthenticated ? "Authenticated" : "Not authenticated"}</p>
      <p>{"User ID: " + context.userId}</p>
    </div>
  );
};

export default Login;
