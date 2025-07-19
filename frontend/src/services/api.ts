import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

const apiClient = axios.create({
    baseURL: API_URL,
});

// 你甚至可以在这里添加拦截器，统一处理 token 失效等情况
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // 在这里可以触发全局的登出逻辑
            // 例如： window.location.href = '/login';
            // 或者使用事件总线通知 AuthContext
            console.error("Unauthorized! Logging out.");
            localStorage.removeItem("accessToken");
        }
        return Promise.reject(error);
    }
);

export default apiClient;
