import { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../types/index";

//TODO 改成JWT 之后， 不能用这一套了。

// 定义 AuthContext 的类型
interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) =>Promise<void>;
    logout: () => void;
    isLoading: boolean; // 这个是做什么用的？
}

// 创建 Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider 组件的 props 类型
interface AuthProviderProps {
    children: React.ReactNode;
}

// AuthProvider 组件
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 登录函数
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // 这里先用模拟数据，后续会连接真实API
      // TODO: 替换为真实的API调用
      const mockUser: User = {
        id: "1",
        username: username,
      };
      setUser(mockUser);
      // 可以保存到 localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 注销函数
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // 组件挂载时检查本地存储
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const value = {
    user,
    login,
    logout,
    isLoading,
  };

  //提供 context 的实际值（实现 + 分发）
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 自定义 hook 用于使用 AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 只需要 这样就可以在别的地方使用这些(相当于全局变量的)东西(用户信息、登录、注销、加载状态等)
// const { user, login, logout, isLoading } = useAuth();
