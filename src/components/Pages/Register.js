import React, { useState, useReducer, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Context from "../Context/Context";

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
  const context = useContext(Context);
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

  const navigate = useNavigate();

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
      .then((data) => {
        if (data.message === "That username is already taken") {
          alert("That username is already taken");
        }
      });
    await fetch("/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "User not found") {
          alert("User not found");
        } else if (data.message === "User not authenticated") {
          alert("User not authenticated");
        } else {
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
    <div className=" bg-whitesmoke container md:max-w-md max-w-xs grid grid-rows-5 mt-10 m-auto max-h-176 shadow-xl pl-3 pr-3 h-176 justify-center rounded-3xl">
      <h1 className=" text-5xl m-auto row-span-2 row-end-3">Book Review</h1>
      <form onSubmit={submitHandler} className="flex m-auto flex-col gap-5 ">
        <input
          type="text"
          id="username"
          placeholder="Username"
          className=" bg-transparent border-b-2 border-slate-800 focus:outline-none"
          onChange={updateUsernameHandler}
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          className=" bg-transparent border-b-2 border-slate-800 focus:outline-none"
          onChange={updateEmailHandler}
        />
        <div className="relative">
          <input
            type="password"
            id="password"
            placeholder="Password"
            className=" bg-transparent border-b-2 border-slate-800 focus:outline-none"
            onChange={updatePasswordHandler}
          />
          <i
            class="far fa-eye"
            id="togglePassword"
            onClick={eyeOnClickHandler}
            className="far fa-eye w-6 top-1 right-1"
          ></i>
        </div>
        <button
          type="submit"
          className=" disabled:text-gray-300"
          disabled={!passwordValid.isValid}
        >
          Create Account
        </button>
        <div>
          <div className="flex justify-center">
            <p className=" text-sm align-middle">Min Length</p>
            {passwordValid.minLength ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="16px"
                height="16px"
              >
                <path d="M5.857 14.844L0.172 9.032 3.031 6.235 5.888 9.156 12.984 2.061 15.812 4.889z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 26 20"
                width="16px"
                height="16px"
              >
                <path d="M 21.734375 19.640625 L 19.636719 21.734375 C 19.253906 22.121094 18.628906 22.121094 18.242188 21.734375 L 13 16.496094 L 7.761719 21.734375 C 7.375 22.121094 6.746094 22.121094 6.363281 21.734375 L 4.265625 19.640625 C 3.878906 19.253906 3.878906 18.628906 4.265625 18.242188 L 9.503906 13 L 4.265625 7.761719 C 3.882813 7.371094 3.882813 6.742188 4.265625 6.363281 L 6.363281 4.265625 C 6.746094 3.878906 7.375 3.878906 7.761719 4.265625 L 13 9.507813 L 18.242188 4.265625 C 18.628906 3.878906 19.257813 3.878906 19.636719 4.265625 L 21.734375 6.359375 C 22.121094 6.746094 22.121094 7.375 21.738281 7.761719 L 16.496094 13 L 21.734375 18.242188 C 22.121094 18.628906 22.121094 19.253906 21.734375 19.640625 Z" />
              </svg>
            )}
          </div>
          <div className="flex justify-center">
            <p className=" text-sm">UpperCase</p>
            {passwordValid.uppercase ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="16px"
                height="16px"
              >
                <path d="M5.857 14.844L0.172 9.032 3.031 6.235 5.888 9.156 12.984 2.061 15.812 4.889z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 26 20"
                width="16px"
                height="16px"
              >
                <path d="M 21.734375 19.640625 L 19.636719 21.734375 C 19.253906 22.121094 18.628906 22.121094 18.242188 21.734375 L 13 16.496094 L 7.761719 21.734375 C 7.375 22.121094 6.746094 22.121094 6.363281 21.734375 L 4.265625 19.640625 C 3.878906 19.253906 3.878906 18.628906 4.265625 18.242188 L 9.503906 13 L 4.265625 7.761719 C 3.882813 7.371094 3.882813 6.742188 4.265625 6.363281 L 6.363281 4.265625 C 6.746094 3.878906 7.375 3.878906 7.761719 4.265625 L 13 9.507813 L 18.242188 4.265625 C 18.628906 3.878906 19.257813 3.878906 19.636719 4.265625 L 21.734375 6.359375 C 22.121094 6.746094 22.121094 7.375 21.738281 7.761719 L 16.496094 13 L 21.734375 18.242188 C 22.121094 18.628906 22.121094 19.253906 21.734375 19.640625 Z" />
              </svg>
            )}
          </div>
          <div className="flex justify-center">
            <p className=" text-sm">Lowercase</p>
            {passwordValid.lowercase ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="16px"
                height="16px"
              >
                <path d="M5.857 14.844L0.172 9.032 3.031 6.235 5.888 9.156 12.984 2.061 15.812 4.889z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 26 20"
                width="16px"
                height="16px"
              >
                <path d="M 21.734375 19.640625 L 19.636719 21.734375 C 19.253906 22.121094 18.628906 22.121094 18.242188 21.734375 L 13 16.496094 L 7.761719 21.734375 C 7.375 22.121094 6.746094 22.121094 6.363281 21.734375 L 4.265625 19.640625 C 3.878906 19.253906 3.878906 18.628906 4.265625 18.242188 L 9.503906 13 L 4.265625 7.761719 C 3.882813 7.371094 3.882813 6.742188 4.265625 6.363281 L 6.363281 4.265625 C 6.746094 3.878906 7.375 3.878906 7.761719 4.265625 L 13 9.507813 L 18.242188 4.265625 C 18.628906 3.878906 19.257813 3.878906 19.636719 4.265625 L 21.734375 6.359375 C 22.121094 6.746094 22.121094 7.375 21.738281 7.761719 L 16.496094 13 L 21.734375 18.242188 C 22.121094 18.628906 22.121094 19.253906 21.734375 19.640625 Z" />
              </svg>
            )}
          </div>
          <div className="flex justify-center">
            <p className=" text-sm">Number</p>
            {passwordValid.number ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="16px"
                height="16px"
              >
                <path d="M5.857 14.844L0.172 9.032 3.031 6.235 5.888 9.156 12.984 2.061 15.812 4.889z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 26 20"
                width="16px"
                height="16px"
              >
                <path d="M 21.734375 19.640625 L 19.636719 21.734375 C 19.253906 22.121094 18.628906 22.121094 18.242188 21.734375 L 13 16.496094 L 7.761719 21.734375 C 7.375 22.121094 6.746094 22.121094 6.363281 21.734375 L 4.265625 19.640625 C 3.878906 19.253906 3.878906 18.628906 4.265625 18.242188 L 9.503906 13 L 4.265625 7.761719 C 3.882813 7.371094 3.882813 6.742188 4.265625 6.363281 L 6.363281 4.265625 C 6.746094 3.878906 7.375 3.878906 7.761719 4.265625 L 13 9.507813 L 18.242188 4.265625 C 18.628906 3.878906 19.257813 3.878906 19.636719 4.265625 L 21.734375 6.359375 C 22.121094 6.746094 22.121094 7.375 21.738281 7.761719 L 16.496094 13 L 21.734375 18.242188 C 22.121094 18.628906 22.121094 19.253906 21.734375 19.640625 Z" />
              </svg>
            )}
          </div>
          <div className="flex justify-center">
            <p className=" text-sm">Special Character</p>
            {passwordValid.specialChar ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="16px"
                height="16px"
              >
                <path d="M5.857 14.844L0.172 9.032 3.031 6.235 5.888 9.156 12.984 2.061 15.812 4.889z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 26 20"
                width="16px"
                height="16px"
              >
                <path d="M 21.734375 19.640625 L 19.636719 21.734375 C 19.253906 22.121094 18.628906 22.121094 18.242188 21.734375 L 13 16.496094 L 7.761719 21.734375 C 7.375 22.121094 6.746094 22.121094 6.363281 21.734375 L 4.265625 19.640625 C 3.878906 19.253906 3.878906 18.628906 4.265625 18.242188 L 9.503906 13 L 4.265625 7.761719 C 3.882813 7.371094 3.882813 6.742188 4.265625 6.363281 L 6.363281 4.265625 C 6.746094 3.878906 7.375 3.878906 7.761719 4.265625 L 13 9.507813 L 18.242188 4.265625 C 18.628906 3.878906 19.257813 3.878906 19.636719 4.265625 L 21.734375 6.359375 C 22.121094 6.746094 22.121094 7.375 21.738281 7.761719 L 16.496094 13 L 21.734375 18.242188 C 22.121094 18.628906 22.121094 19.253906 21.734375 19.640625 Z" />
              </svg>
            )}
          </div>
          <div className="flex justify-center">
            <p className=" text-sm">No Space</p>
            {passwordValid.noSpace ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="16px"
                height="16px"
              >
                <path d="M5.857 14.844L0.172 9.032 3.031 6.235 5.888 9.156 12.984 2.061 15.812 4.889z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 26 20"
                width="16px"
                height="16px"
              >
                <path d="M 21.734375 19.640625 L 19.636719 21.734375 C 19.253906 22.121094 18.628906 22.121094 18.242188 21.734375 L 13 16.496094 L 7.761719 21.734375 C 7.375 22.121094 6.746094 22.121094 6.363281 21.734375 L 4.265625 19.640625 C 3.878906 19.253906 3.878906 18.628906 4.265625 18.242188 L 9.503906 13 L 4.265625 7.761719 C 3.882813 7.371094 3.882813 6.742188 4.265625 6.363281 L 6.363281 4.265625 C 6.746094 3.878906 7.375 3.878906 7.761719 4.265625 L 13 9.507813 L 18.242188 4.265625 C 18.628906 3.878906 19.257813 3.878906 19.636719 4.265625 L 21.734375 6.359375 C 22.121094 6.746094 22.121094 7.375 21.738281 7.761719 L 16.496094 13 L 21.734375 18.242188 C 22.121094 18.628906 22.121094 19.253906 21.734375 19.640625 Z" />
              </svg>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
