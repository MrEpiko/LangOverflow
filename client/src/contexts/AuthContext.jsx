import { createContext, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import queryClient from '../services/api/queryClient';
import apiClient from '../services/api/apiClient';
export const AuthContext = createContext({
    user: {},
    token: null,
    setAuthToken: () => {},
    setCurrentUser: () => {}
});
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState({});
    const setAuthToken = (newToken) => setToken(newToken);
    const setCurrentUser = (currentUser) => setUser(currentUser);
    const { mutate: getCurrentUser } = useMutation({
        mutationFn: async () => {
            const response = await apiClient.get("/auth/me", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            return response.data;
        },
        onSuccess: (response) => {
            setCurrentUser(response);
            queryClient.invalidateQueries('currentUser');
        },
        retry: true,
    });
    useEffect(() => { token && getCurrentUser() }, [token])
    return (
        <AuthContext.Provider value={{ token, user, setAuthToken, setCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
};