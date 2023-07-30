import React, { useState, useReducer } from "react";

//password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character
const passwordValidReducer = (state, action) => {
  switch (action.type) {
    case "VALIDATE":
      return {
        ...state,
        minLength: action.value.trim().length >= 8,
        uppercase: action.value.match(/[A-Z]/),
        lowercase: action.value.match(/[a-z]/),
        number: action.value.match(/[0-9]/),
        specialChar: action.value.match(/[!@#$%^&*]/),
        noSpace: !action.value.match(/\s/),
        isValid:
          state.minLength &&
          state.uppercase &&
          state.lowercase &&
          state.number &&
          state.specialChar,
      };
    case "IS_VALID":
      return {
        ...state,
        isValid:
          state.minLength &&
          state.uppercase &&
          state.lowercase &&
          state.number &&
          state.specialChar &&
          state.noSpace,
      };
    default:
      return state;
  }
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordValid, dispatchPasswordValid] = useReducer(
    passwordValidReducer,
    {
      minLength: false,
      uppercase: false,
      lowercase: false,
      number: false,
      specialChar: false,
      noSpace: true,
      isValid: false,
    }
  );
  const updateEmailHandler = (event) => {
    setEmail(event.target.value);
  };

  const updateUsernameHandler = (event) => {
    setUsername(event.target.value);
  };

  const updatePasswordHandler = (event) => {
    setPassword(event.target.value);
    dispatchPasswordValid({ type: "VALIDATE", value: event.target.value });
    dispatchPasswordValid({ type: "IS_VALID" });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    await fetch("/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data.message));
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
        <label htmlFor="email">Email</label>
        <input type="email" id="email" onChange={updateEmailHandler}/>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" onChange={updatePasswordHandler} />
        <i
          class="far fa-eye"
          id="togglePassword"
          onClick={eyeOnClickHandler}
        ></i>
        <button type="submit" disabled={!passwordValid.isValid}>
          Login
        </button>
        <p>{passwordValid.minLength ? "Min length: ✅" : "Min length: ❌"}</p>
        <p>{passwordValid.uppercase ? "Uppercase: ✅" : "Uppercase: ❌"}</p>
        <p>{passwordValid.lowercase ? "Lowercase: ✅" : "Lowercase: ❌"}</p>
        <p>{passwordValid.number ? "Number: ✅" : "Number: ❌"}</p>
        <p>
          {passwordValid.specialChar
            ? "Special Character: ✅"
            : "Special Character: ❌"}
        </p>
        <p>{passwordValid.noSpace ? "No Space: ✅" : "No Space: ❌"}</p>
      </form>
    </div>
  );
};

export default Register;
