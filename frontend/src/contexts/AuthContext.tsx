import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import type { User } from "../types/index";
import apiClient from "../services/api"; // 从新文件中导入
import { loginUser, getMe } from "../services/authService";

// --- 类型定义 ---
interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

// --- AuthProvider 组件 ---
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    // isLoading 初始为 true，因为我们首先要检查本地 token，这是一个异步过程
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // --- 核心改动：组件挂载时，检查并验证存储的 Token ---
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem("accessToken");

            // TODO测试时，无论怎样，都加载测试用户
            setUser(await getMe())
            if (token) {
                try {
                    // 关键步骤：将 token 设置到 axios 的默认请求头中
                    apiClient.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${token}`;
                    //请求头中的键值对   "Authorization": `Bearer ${token}`

                    // 向后端发送请求，验证 token 的有效性，并获取用户信息
                    setUser(await getMe());
                } catch (error) {
                    // 如果 token 无效或过期，后端会返回 401 错误
                    // 清理无效的 token
                    console.error("Token validation failed:", error);
                    logout(); // 使用 logout 函数来清理状态
                }
            }
            // 无论有无 token，检查过程都已完成
            setIsLoading(false);
        };

        checkAuthStatus();
    }, []); // 空依赖数组确保此 effect 只在组件挂载时运行一次

    // --- 核心改动：实现真实的登录函数 ---
    const login = async (username: string, password: string) => {
        setIsLoading(true);
        try {
            //TODO 正式API调用时需要更改
            // // 1-2 尝试登录
            // const { access_token } = await loginUser(username, password);
            // // 3. 存储 token 到 localStorage
            // localStorage.setItem("accessToken", access_token);
            // // 4. 更新 axios 实例的默认请求头，用于后续所有请求
            // apiClient.defaults.headers.common[
            //     "Authorization"
            // ] = `Bearer ${access_token}`;

            // 5. 获取并设置用户信息
            setUser(await getMe());
        } catch (error) {
            // 登录失败，确保清理任何可能残留的状态
            logout();
            // 将错误向上抛出，以便登录页面可以捕获并显示错误信息
            // 登录页有进行处理， 所以是ok的
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // --- 核心改动：更新注销函数 ---
    const logout = () => {
        setUser(null);
        // 移除 token 而不是 user 对象
        localStorage.removeItem("accessToken");
        // 从 axios 实例中移除 Authorization 头
        delete apiClient.defaults.headers.common["Authorization"];
    };

    const value = {
        user,
        login,
        logout,
        isLoading,
    };

    return (
        <AuthContext.Provider value={value}>
            {/* 只有在初始加载完成后才渲染子组件，防止页面闪烁 */}
            {!isLoading && children}
        </AuthContext.Provider>
    );
}

// --- 自定义 Hook (无需改动) ---
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
