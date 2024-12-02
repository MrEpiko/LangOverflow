import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage";
import Pagelayout from "../layouts/Pagelayout";
import ProtectedRoute from "./ProtectedRoute";
const routes = [
  {
    path: '/',
    element: (
        <ProtectedRoute>
            <Pagelayout>
                <HomePage/>
            </Pagelayout>
        </ProtectedRoute>
    ),
    errorElement: <NotFoundPage/>,
  },
  {
    path: '/login',
    element: 
      <Pagelayout>
        <LoginPage/>
      </Pagelayout>
  },
  {
    path: '/register',
    element:
      <Pagelayout>
        <RegisterPage/>
      </Pagelayout>
  },
  {
    path: '/profile',
    element: (
        <ProtectedRoute>
            <Pagelayout>
                <ProfilePage/>
            </Pagelayout>
        </ProtectedRoute>
    ),
  },
];
export const router = createBrowserRouter(routes);