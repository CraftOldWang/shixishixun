import apiClient from "./api";
import type { User } from "../types"; // 如果需要，可以导入类型

// 封装注册用户的函数
export const registerUser = async (username: string, password: string) => {
    // 我们将 API 调用的所有细节都封装在这里
    // 组件不需要知道端点是什么，也不需要知道数据结构是什么
    const response = await apiClient.post("/api/auth/register", {
        username: username,
        password: password,
        email: "hellotest@gmail.com",
    });
    // 你可以根据需要返回后端的数据，或者不返回 (返回成功信息...)
    return response.data;
};

// 你甚至可以把登录逻辑也移到这里
export const loginUser = async (username: string, password: string) => {
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    const response = await apiClient.post("/api/auth/login", params, {
        // 假设你的登录端点是 /token
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    return response.data; // 返回包含 access_token 的数据
};

// 获取当前用户信息的函数 (id , username)
export const getMe = async (): Promise<User> => {
    // 测试用数据
    // 为了模拟网络延迟，你可以添加一个 setTimeout
    await new Promise((resolve) => setTimeout(resolve, 50)); // 延迟500毫秒
    return {
        id:"1",
        username:"Akkarin"
    }

    const response = await apiClient.get<User>("/auth/me");
    return response.data;
};
