import { createBrowserRouter } from "react-router-dom";
import { Home, Login, Signup } from "../pages";
import Protected from "../components/AuthLayer.jsx";
import {Layout} from ".";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: (
          <Protected authentication={true}>
            <Home />
          </Protected>
        ),
      },
      {
        path: '/login',
        element: (
          <Protected authentication={false}>
            <Login />
          </Protected>
        ),
      },
      {
        path: '/signup',
        element: (
          <Protected authentication={false}>
            <Signup />
          </Protected>
        ),
      },
      
    ],
  },
]);

export default router;