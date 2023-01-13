import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './page/home'
import Register from "./page/register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

function App() {
  return (
   <React.StrictMode>
      <RouterProvider router={router} />
   </React.StrictMode>
  );
}

export default App;
