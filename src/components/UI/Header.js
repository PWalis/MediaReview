import React from "react";
import { Outlet } from "react-router-dom";
import Context from "../Context/Context";
import { Link } from "react-router-dom";
import SearchBar from "../SearchBar/Searchbar";
import Logout from "./Logout";

function Header() {
  const context = React.useContext(Context);

  const isAuthenticatedHeader = (
    <div className="py-5 w-full grid grid-cols-5 m-auto justify-center space-x-4 bg-charcoal border-collapse sticky top-0 z-10">
      <div className="flex gap-3 col-span-2 col-start-2">
        <button>
          <Link
            to="/"
            className="sm:px-10 px-5 py-3 text-base text-whitesmoke hover:border-b-2 hover:border-whitesmoke"
          >
            Feed
          </Link>
        </button>
        <button>
          <Link
            to="/CreatePost"
            className="sm:px-10 px-5 py-3 text-base text-whitesmoke hover:border-b-2 hover:border-whitesmoke"
          >
            Create Review
          </Link>
        </button>
        <button>
          <Link
            to="/profilePage"
            className="sm:px-10 px-5 py-3 text-base text-whitesmoke hover:border-b-2 hover:border-whitesmoke"
          >
            Profile
          </Link>
        </button>
      </div>
      <div className="relative z-50">
        <Logout />
        <SearchBar />
      </div>
    </div>
  );

  const isNotAuthenticatedHeader = (
    <div className="py-5 w-full flex m-auto justify-center space-x-4 bg-blue-100 border-collapse">
      <button>
        <Link
          to="/login"
          className="px-10 py-3 bg-gradient-to-br from-blue-200 to-blue-500"
        >
          Login
        </Link>
      </button>
      <button>
        <Link
          to="/register"
          className="px-10 py-3 bg-gradient-to-tr from-blue-200 to-blue-500"
        >
          Register
        </Link>
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
