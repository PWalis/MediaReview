import "./App.css";
import Header from "./components/UI/Header";
import Home from "./components/Pages/Home";
import Login from "./components/Pages/Login";
import CreatePost from "./components/Pages/CreatePost";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";
import Context from "./components/Context/Context";
import Register from "./components/Pages/Register";
import ProfilePage from "./components/Pages/ProfilePage";
import OtherUserProfilePage from "./components/Pages/OtherUserProfilePage";

const router = createBrowserRouter([
  {
    name: "Home",
    path: "/",
    exact: true,
    element: <Header />,
    children: [{ name: "HomePage", path: "/", exact: true, element: <Home /> }],
  },
  {
    name: "CreatePost",
    path: "/CreatePost",
    exact: true,
    element: <Header />,
    children: [
      {
        name: "CreatePost",
        path: "/CreatePost",
        exact: true,
        element: <CreatePost />,
      },
    ],
  },
  {
    name: "login",
    path: "/login",
    exact: true,
    element: <Header />,
    children: [
      {
        name: "login",
        path: "/login",
        exact: true,
        element: <Login />,
      },
    ],
  },
  {
    name: "Register",
    path: "/register",
    exact: true,
    element: <Header />,
    children: [
      {
        name: "Register",
        path: "/register",
        exact: true,
        element: <Register />,
      },
    ],
  },
  {
    name: "ProfilePage",
    path: "/ProfilePage",
    exact: true,
    element: <ProfilePage />,
  },
  {
    name: "User",
    path: "/User/:userID",
    exact: true,
    element: <OtherUserProfilePage />,
  },
]);

function App() {
  const [contextState, setContextState] = useState({
    isAuthenticated: false,
    userId: null,
  });

  const updateAuth = (value) => {
    setContextState((prevState) => {
      return { ...prevState, isAuthenticated: value };
    });
  };

  const updateUserId = (value) => {
    setContextState((prevState) => {
      return { ...prevState, userId: value };
    });
  };

  return (
    <div className="bg-blue-100">
      <Context.Provider
        value={{
          isAuthenticated: contextState.isAuthenticated,
          userId: contextState.userId,
          updateAuth: updateAuth,
          updateUserId: updateUserId,
        }}
      >
        <RouterProvider router={router}></RouterProvider>
      </Context.Provider>
    </div>
  );
}

export default App;
