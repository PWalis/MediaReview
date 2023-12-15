import React, { useState } from "react";
import Context from "../Context/Context";
import { Link } from "react-router-dom";
import SearchBar from "../SearchBar/Searchbar";
import Logout from "./Logout";

function Header() {
  const context = React.useContext(Context);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const isAuthenticatedHeader = (
    <nav className="sticky top-0 z-50 bg-charcoal">
      <section className="grid  grid-cols-10 lg:hidden justify-center items-center relative">
        <div className="relative col-span-8 col-start-1 pl-5 sm:col-start-3 sm:col-span-6">
          <SearchBar />
        </div>
        <div
          className="col-start-10 flex flex-col items-end justify-end py-5 pr-5 border-collapse sticky space-y-2"
          onClick={() => setIsNavOpen((prev) => !prev)}
        >
          <span className="block h-0.5 w-8 bg-whitesmoke"></span>
          <span className="block h-0.5 w-8 bg-whitesmoke"></span>
          <span className="block h-0.5 w-8 bg-whitesmoke"></span>
        </div>

        <div className={isNavOpen ? "showNavMenu" : "hideNavMenu"}>
          <div
            className="CROSS-ICON absolute top-0 right-0 px-8 py-8"
            onClick={() => setIsNavOpen(false)} // change isNavOpen state to false to close the menu
          >
            <svg
              className="h-8 w-8 bg-transparent text-whitesmoke rounded-full"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <ul className="flex flex-col items-center justify-center space-y-4 bg-charcoal border-collapse sticky top-0 z-10">
            <li>
              <Link to="/" className="text-whitesmoke text-2xl">
                Feed
              </Link>
            </li>

            <li>
              <Link to="/CreatePost" className="text-whitesmoke text-2xl">
                Create Review
              </Link>
            </li>

            <li>
              <Link to="/profilePage" className="text-whitesmoke text-2xl">
                Profile
              </Link>
            </li>
            <li>
              <Logout />
            </li>
          </ul>
        </div>
      </section>

      <div className="py-5 w-full hidden lg:grid grid-cols-5 m-auto justify-center  bg-charcoal border-collapse sticky top-0 z-10">
        <div className="col-start-1 pl-5">
          <Logout />
        </div>
        <ul className="flex justify-between gap col-span-3 col-start-2">
          <li>
            <Link
              to="/"
              className="sm:px-10 px-5 py-3 text-2xl text-whitesmoke hover:border-b-2 hover:border-whitesmoke"
            >
              Feed
            </Link>
          </li>
          <li>
            <Link
              to="/CreatePost"
              className="sm:px-10 px-5 py-3 text-2xl text-whitesmoke hover:border-b-2 hover:border-whitesmoke"
            >
              Create Review
            </Link>
          </li>
          <li>
            <Link
              to="/profilePage"
              className="sm:px-10 px-5 py-3 text-2xl text-whitesmoke hover:border-b-2 hover:border-whitesmoke"
            >
              Profile
            </Link>
          </li>
        </ul>
        <div className="col-start-5 relative">
          <SearchBar />
        </div>
      </div>
      <style>{`
      .hideNavMenu {
        display: none;
      }
      .showNavMenu {
        display: block;
        position: absolute;
        width: 200px;
        height: 50vh;
        top: 0;
        right: 0;
        background: white;
        z-index: 50;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        background-color: #274156;
      }
    `}</style>
    </nav>
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
    </>
  );
}

export default Header;
