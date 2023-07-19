import React from "react";
import { Outlet } from "react-router-dom";

function Header() {
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
