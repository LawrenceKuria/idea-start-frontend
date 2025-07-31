import axios from "axios";
import { getStoredAccessToken, setStoredAccessToken } from "./authToken";
import { refreshToken } from "@/api/auth";

const api = axios.create({
    
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    withCredentials: true,
    headers: {
       'Content-Type': 'application/json' 
    }
})

//Attach token on refresh
api.interceptors.request.use((config) => {
    const token = getStoredAccessToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

//Refresh token after expire
api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/refresh')) {
        originalRequest._retry = true

        try {
            const { accessToken: newToken } = await refreshToken()
            setStoredAccessToken(newToken)
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return api(originalRequest)
        } catch (error) {
            console.log('Refresh token failed', error);
        }
    }

    return Promise.reject(error)
})

export default api