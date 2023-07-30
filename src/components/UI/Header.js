import React from "react";
import { Outlet } from "react-router-dom";
import Context from "../Context/Context";
import { Link } from "react-router-dom";

function Header() {

  const context = React.useContext(Context);

  const isAuthenticatedHeader = (
    <>
      <button>
        <Link to="/CreatePost">Create Post</Link>
      </button>
    </>

  );
  return (
    <>
      <div>
        <h1>Header</h1>
      </div>
      <Outlet />
    </>
  );
}

export default Header;
