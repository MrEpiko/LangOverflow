import axios from "axios";
import { useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
const apiClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});
export const createApiClient = () => {
    const { token } = useAuthContext();
       apiClient.interceptors.request.use(
            config => {
                if (token) {
                    
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            error => Promise.reject(error)
        );
        
    return apiClient;
};
export default apiClient;