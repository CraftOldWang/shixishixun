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
            const id = localStorage.getItem("id");
            const username = localStorage.getItem("username");
            console.log("开始挂载")
            console.log(id, username);

            // TODO测试时，无论怎样，都加载测试用户
            // setUser(await getMe());
            if (id && username) {
                try {
                    setUser({ id, username });
                    // TODO测试用
                    // setUser(await getMe());
                } catch (error) {
                    // 清理无效的 token 如果 token 无效或过期，后端会返回 401 错误
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
    const login = async (username1: string, password: string) => {
        // setIsLoading(true);
        try {
            const { id, username } = await loginUser(username1, password);

            // 存储到 localStorage
            localStorage.setItem("id", id);
            localStorage.setItem("username", username);
            console.log("已经存储到localStorage")

            // 设置到内存状态（用于当前页面展示）
            setUser({ id, username });
        } catch (error) {
            logout();
            console.log("login error")
            throw error;
        }
    };

    // --- 核心改动：更新注销函数 ---
    const logout = () => {
        setUser(null);
        // 移除 token 而不是 user 对象
        localStorage.removeItem("id");
        localStorage.removeItem("username");
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
