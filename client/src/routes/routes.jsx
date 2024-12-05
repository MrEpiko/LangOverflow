import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage";
import Pagelayout from "../layouts/Pagelayout";
import ProtectedRoute from "./ProtectedRoute";
import AskQuestionPage from "../pages/AskQuestionPage";
import Questions from "../pages/Questions";
import QuestionInFullFocus from "../pages/QuestionInFullFocus";
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
  path: '/ask-question',
    element: (
        <ProtectedRoute>
            <Pagelayout>
                <AskQuestionPage/>
            </Pagelayout>
        </ProtectedRoute>
    )
  },
  {
    path: '/questions',
      element: (
          <ProtectedRoute>
            <Pagelayout>
                    <Questions/>
                </Pagelayout>
                  
          </ProtectedRoute>
      )
    },
    {
      path: '/questioninfullfocus/:id',
        element: (
            <ProtectedRoute>
                <Pagelayout>
                    <QuestionInFullFocus/>
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
                <ProfilePage/>
        </ProtectedRoute>
    ),
  },
];
export const router = createBrowserRouter(routes);