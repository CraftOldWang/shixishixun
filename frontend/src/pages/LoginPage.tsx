import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        setIsLoading(true);
        e.preventDefault();
        setError(""); // 重置错误信息

        try {
            await login(username, password);
            navigate("/");
        } catch (err) {
            setError("登录失败，请检查用户名和密码，或注册账号。");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = () => {
        navigate("/register");
    };

    return (
        // 1. 整体页面容器
        // - min-h-screen: 确保容器至少占满整个屏幕的高度
        // - flex items-center justify-center: 使用 Flexbox 实现内容垂直和水平居中
        // TODO 渐变效果真好看， 感觉在别的地方也能用
        // - bg-gradient-to-br from-gray-100 to-gray-200: 设置了一个优雅的从左上到右下的渐变背景
        // - p-4: 在小屏幕上提供一些边距，防止内容贴边
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-300 via-purple-100 to-pink-200 p-4"
            // 【背景图片】如果你想添加背景图片，可以取消下面的 style 注释，并换上你的图片URL
            // style={{
            //   backgroundImage: `url('你的背景图片URL')`,
            //   backgroundSize: 'cover',
            //   backgroundPosition: 'center',
            // }}
        >
            {/* 2. 登录表单卡片 */}
            {/* - w-full max-w-md: 在小屏幕上宽度为100%，最大宽度为中等尺寸(md)，实现响应式
            // - bg-white: 卡片背景为白色
            // - rounded-xl: 更大的圆角，看起来更柔和
            // - shadow-lg: 添加一个明显的阴影，让卡片有立体感
            // - p-8: 卡片内部的边距 */}
            <form
                onSubmit={handleLogin}
                className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6"
            >
                {/* 对应草图中的 "Logo" 或 "登录" 标题 */}
                <h2 className="text-3xl font-bold text-center text-gray-800">
                    登录
                </h2>

                {/* 用户名输入区域 */}
                <div>
                    <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        账号
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isLoading}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="请输入你的账号"
                    />
                </div>

                {/* 密码输入区域 */}
                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        密码
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="请输入你的密码"
                    />
                </div>

                {/* 错误信息展示 */}
                {error && (
                    <div className="text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* 按钮容器 */}
                {/* - flex items-center justify-between: 让登录和注册按钮分布在两端 */}
                <div className="flex gap-4">
                    {/* 登录按钮 (主操作) */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto flex-grow px-4 py-2 text-white bg-blue-600 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? "登录中..." : "登录"}
                    </button>
                </div>

                {/* 注册按钮 */}
                <div className="text-center">
                    {/* 注册按钮 (次要操作，设计成链接样式) */}
                    <button
                        type="button"
                        onClick={handleRegister}
                        disabled={isLoading}
                        className="w-full sm:w-auto text-center text-blue-600 hover:text-blue-800 font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        没有账号？立即注册
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
