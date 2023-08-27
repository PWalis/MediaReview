import React from "react";
import { Outlet } from "react-router-dom";
import Context from "../Context/Context";
import { Link } from "react-router-dom";

function Header() {
  const context = React.useContext(Context);

  const isAuthenticatedHeader = (
    <>
      <button>
        <Link to="/">Home</Link>
      </button>
      <button>
        <Link to="/CreatePost">Create Post</Link>
      </button>
      <button>
        <Link to="/profilePage">Profile</Link>
      </button>
      {/* <button>
        <Link to="/logout">Logout</Link>
      </button> */}
    </>
  );

  const isNotAuthenticatedHeader = (
    <>
      <button>
        <Link to="/">Home</Link>
      </button>
      <button>
        <Link to="/login">Login</Link>
      </button>
      <button>
        <Link to="/register">Register</Link>
      </button>
    </>
  );
  return (
    <>
      {context.isAuthenticated
        ? isAuthenticatedHeader
        : isNotAuthenticatedHeader}
      <Outlet />
    </>
  );
}

export default Header;
