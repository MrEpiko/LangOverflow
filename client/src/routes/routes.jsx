import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage";
import Pagelayout from "../layouts/Pagelayout";
import ProtectedRoute from "./ProtectedRoute";
import QuestionPage from "../pages/QuestionPage";
const routes = [
  {
    path: '/',
    element: (
      <Pagelayout>
        <LandingPage/>
      </Pagelayout>
    ),
    errorElement: <NotFoundPage/>,
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
          <Pagelayout>
              <HomePage/>
          </Pagelayout>
      </ProtectedRoute>
    ),
  },
  {
  path: '/question',
    element: (
        <ProtectedRoute>
            <Pagelayout>
                <QuestionPage/>
            </Pagelayout>
        </ProtectedRoute>
    )
  },
  {
    path: '/login',
    element: 
        <LoginPage/>
  },
  {
    path: '/register',
    element:
        <RegisterPage/>
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