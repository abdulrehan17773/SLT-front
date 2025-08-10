import { createBrowserRouter } from "react-router-dom";
import { Home, Login, Dashboard, Signup, About, Contact, Profile, Users, Training,Feedback } from "../pages";
import Protected from "../components/AuthLayer.jsx";
import { Layout } from ".";

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
      {
        path: '/about',
        element: (
          <Protected authentication={true}>
            <About />
          </Protected>
        ),
      },
      {
        path: '/contact',
        element: (
          <Protected authentication={true}>
            <Contact />
          </Protected>
        ),
      },
      {
        path: '/profile',
        element: (
          <Protected authentication={true}>
            <Profile />
          </Protected>
        ),
      },
      {
        path: '/dashboard',
        children: [
          {
            index: true, // this matches /dashboard
            element: (
              <Protected authentication={true} dashboard={true}>
                <Dashboard />
              </Protected>
            ),
          },
          {
            path: 'users', // matches /dashboard/users
            element: (
              <Protected authentication={true} dashboard={true}>
                <Users />
              </Protected>
            ),
          },
          {
            path: 'feedback', // matches /dashboard/feedback
            element: (
              <Protected authentication={true} dashboard={true}>
                <Feedback />
              </Protected>
            ),
          },
          {
            path: 'training', // matches /dashboard/users
            element: (
              <Protected authentication={true} dashboard={true}>
                <Training />
              </Protected>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
