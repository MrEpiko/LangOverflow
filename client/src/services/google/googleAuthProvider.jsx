import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Loading from '../../components/Loading';
export const GoogleAuthProvider = ({ children }) => {
  const [clientId, setClientId] = useState('');
  const GOOGLE_CLIENT_ID = `${import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}`; 
  useEffect(() => {
    setClientId(GOOGLE_CLIENT_ID);
  }, []);
  if (!clientId) return <Loading/>;
  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
};