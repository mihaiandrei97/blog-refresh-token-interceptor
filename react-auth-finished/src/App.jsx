import "./App.css";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import {
  action as loginAction,
  LoginPage,
} from "./pages/LoginPage";
import { Root } from "./layouts/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
        action: loginAction,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
