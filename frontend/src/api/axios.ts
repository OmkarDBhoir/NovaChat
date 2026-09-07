import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL = "http://localhost:8080";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {

    const accessToken =
      localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {

    const originalRequest =
      error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry
    ) {
      return Promise.reject(error);
    }

    if (
      originalRequest.url === "/api/auth/refresh"
    ) {
      return Promise.reject(error);
    }

    const refreshToken =
      localStorage.getItem("refreshToken");

    if (!refreshToken) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {

      const response =
        await refreshClient.post(
          "/api/auth/refresh",
          {
            refreshToken,
          }
        );

      const {
        accessToken,
        refreshToken: newRefreshToken,
      } = response.data;

      localStorage.setItem(
        "accessToken",
        accessToken
      );

      localStorage.setItem(
        "refreshToken",
        newRefreshToken
      );

      originalRequest.headers.Authorization =
        `Bearer ${accessToken}`;

      return apiClient(originalRequest);

    } catch (refreshError) {

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;