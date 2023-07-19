import "./App.css";
import Header from "./components/UI/Header";
import Home from "./components/Pages/Home";
import CreatePost from "./components/Pages/CreatePost";
import { createBrowserRouter, Router, RouterProvider } from "react-router-dom";

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
]);

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
