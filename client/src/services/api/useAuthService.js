import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useToastMessage } from '../../hooks/useToastMessage';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import apiClient from './apiClient';
export const useAuthService = () => {
    const navigate = useNavigate();
    const { setCurrentUser, setAuthToken } = useAuthContext();
    const { successMessage, errorMessage } = useToastMessage();
    const { Get, Set, Delete } = useLocalStorage();
    const { mutate: login } = useMutation({
        mutationFn: async ({email, password}) => {
            const response = await apiClient.post('/auth/login', { email, password });
            return response.data;
        },
        onSuccess: (data) => {
            setAuthToken(data.access_token);
            Set('token', data.access_token);
            navigate('/', { replace: true });
            successMessage('Success login');
        },
        onError: (error) => {
            console.error('Login error:', error);
            errorMessage(`Error: ${error}`);
        },
    });
    const { mutate: register } = useMutation({
        mutationFn: async ({ username, email, password }) => {
            const response = await apiClient.post('/auth/register', { username, email, password });
            return response.data;
        },
        onSuccess: (data) => {
            setAuthToken(data.access_token);
            Set('token', data.access_token);
            navigate('/', { replace: true });
            successMessage('Success register');
        },
        onError: (error) => {
            console.error('Registration error:', error);
            errorMessage(`Registration error: ${error}`);
        },
    });
    const fetchUserProfile = () => {
        const { data } = useQuery({
            queryKey: ['userProfile'],
            queryFn: async () => {
                const token = Get('token');
                if (!token) {
                    throw new Error('Token not found');
                }
                const response = await apiClient.get('/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                return response.data;
            },
            enabled: !!Get('token'),
            onError: (error) => {
                console.error('Fetch user profile error:', error);
                errorMessage(`Fetch user profile error: ${error}`);
            },
        });
        return data;
    }
    const logout = () => {
        setAuthToken(null);
        setCurrentUser({});
        Delete('token');
        navigate('/login', { replace: true });
        successMessage('Success logout');
    };
    return { login, register, logout, fetchUserProfile};
};