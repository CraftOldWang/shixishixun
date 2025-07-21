import apiClient from "./api";
import type { User } from "../types"; // 如果需要，可以导入类型

// 封装注册用户的函数
export const registerUser = async (username: string, password: string) => {
    // 我们将 API 调用的所有细节都封装在这里
    // 组件不需要知道端点是什么，也不需要知道数据结构是什么
    console.log(username, password);
    const response = await apiClient.post("/api/auth/register", {
        username: username,
        password: password,
        // email: "hellotest@gmail.com", // 只是测试。 现在也可以不给这个...因为后端检查了邮箱的唯一性，所以这里别填了。
    });
    // 你可以根据需要返回后端的数据，或者不返回 (返回成功信息...)
    console.log(response.data);
    return response.data;
};

// 你甚至可以把登录逻辑也移到这里
export const loginUser = async (
    username1: string,
    password: string
): Promise<User> => {
    const params = new URLSearchParams();
    params.append("username", username1);
    params.append("password", password);

    const response = await apiClient.post("/api/auth/login", params, {
        // 假设你的登录端点是 /token
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    // shit-like
    const { user:userGetFromBackend } = response.data;
    console.log(response.data);

    const user: User = {
        id: userGetFromBackend.id,
        username:userGetFromBackend.username,
    };
    console.log(user);
    return user;
};

// 获取当前用户信息的函数 (id , username)
// TODO这个函数 貌似不需要了， 因为登录之后前端直接存了当前用户id和username
export const getMe = async (userid: string): Promise<User> => {
    // 测试用数据
    // 为了模拟网络延迟，你可以添加一个 setTimeout
    // await new Promise((resolve) => setTimeout(resolve, 50)); // 延迟500毫秒
    // return {
    //     id: "1",
    //     username: "Akkarin",
    // };

    const response = await apiClient.get(`/api/users/${userid}`);
    console.log("正在调用 getMe 函数")
    const { user_id, username } = response.data;

    const user: User = {
        id: user_id,
        username,
    };
    return user;
};
