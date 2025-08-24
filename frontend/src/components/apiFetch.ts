import axios from "axios";
import useAuth from "./authentication/useAuth";

// Create an axios instance
const apiFetch = axios.create({
    baseURL: "http://localhost:5173/api", // Backend URL
    withCredentials: true, // Require cookies for CORS requests
});

// Request interceptor: insert token in headers
apiFetch.interceptors.request.use(
    (config) => {
        const { accessToken } = useAuth();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        } else {
            window.location.href = "/login"; // Redirect to login if no token
            throw new axios.Cancel("No access token available");
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle 401 errors and refresh token
apiFetch.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite loop

            try {
                // Request a new access token using the refresh token
                const res = await axios.post(
                    "http://localhost:5173/api/user/refresh",
                    {},
                    { withCredentials: true }
                );

                const newToken = res.data.access_token;
                const { setAccessToken } = useAuth();

                setAccessToken(newToken);

                // Set the new token in the original request and retry it
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiFetch(originalRequest);
            } catch (refreshError) {
                console.error("Refresh token failed", refreshError);
                window.location.href = "/login"; // Redirect to login on failure
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiFetch;
