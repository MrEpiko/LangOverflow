import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { GoogleAuthProvider } from './services/google/googleAuthProvider';
import { AuthProvider } from './contexts/AuthContext';
import { router } from './routes/routes';
import queryClient from './services/api/queryClient';
import ToastMessage from './components/ToastMessage';
import './index.css';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GoogleAuthProvider>
          <ToastMessage/>
          <RouterProvider router={router}/>
        </GoogleAuthProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);