import axios from "axios";

// const API_BASE_URL = "https://backend.com.jplawsuvidha.com/api";
const API_BASE_URL = 'http://localhost:3001/api';


let accessToken: string | null = null;
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

export const privateApi = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// REQUEST INTERCEPTOR
privateApi.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// RESPONSE INTERCEPTOR
privateApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as any;
        console.log('orginairequest', originalRequest)

        // Do NOT retry validate itself
        if (originalRequest?.url?.includes("/validate")) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                if (!isRefreshing) {
                    isRefreshing = true;

                    refreshPromise = axios
                        .get(
                            `${process.env.NEXT_PUBLIC_PROD_API_URL || "http://localhost:3001/api"}/validate`,
                            { withCredentials: true }
                        )
                        .then((res) => {
                            const newToken = res.data.token;
                            setAccessToken(newToken);
                            return newToken;
                        })
                        .finally(() => {
                            isRefreshing = false;
                            refreshPromise = null;
                        });
                }

                const newToken = await refreshPromise!;
                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                return privateApi(originalRequest);
            } catch (err) {
                setAccessToken(null);
                window.location.href = "/login";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default privateApi;
