import React from "react";
import { Outlet } from "react-router-dom";
import Context from "../Context/Context";
import { Link } from "react-router-dom";

function Header() {
  const context = React.useContext(Context);

  const isAuthenticatedHeader = (
    <div className="py-5 w-full flex m-auto justify-center space-x-4 bg-blue-100 border-collapse gap-14">
      <button>
        <Link to="/" className="sm:px-10 px-5 py-3 bg-gradient-to-r from-blue-200 to-blue-500 rounded-lg">Feed</Link>
      </button>
      <button>
        <Link to="/CreatePost" className="sm:px-10 px-5 py-3 bg-gradient-to-br from-blue-200 to-blue-500 rounded-lg">Create Review</Link>
      </button>
      <button>
        <Link to="/profilePage" className="sm:px-10 px-5 py-3 bg-gradient-to-tr from-blue-200 to-blue-500 rounded-lg">Profile</Link>
      </button>
      {/* <button>
        <Link to="/logout">Logout</Link>
      </button> */}
    </div>
  );

  const isNotAuthenticatedHeader = (
    <div className="py-5 w-full flex m-auto justify-center space-x-4 bg-blue-100 border-collapse">
      <button>
        <Link to="/" className="px-10 py-3 bg-gradient-to-r from-blue-200 to-blue-500 rounded-lg">Home</Link>
      </button >
      <button >
        <Link to="/login" className="px-10 py-3 bg-gradient-to-br from-blue-200 to-blue-500 rounded-lg">Login</Link>
      </button>
      <button >
        <Link to="/register" className="px-10 py-3 bg-gradient-to-tr from-blue-200 to-blue-500 rounded-lg">Register</Link>
      </button>
    </div>
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
