import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // 调用真实注册接口
            const result = await registerUser(username, password);
            console.log(result); // 打印调试...

            // 注册成功后跳转登录页
            navigate("/login");
        } catch (err: any) {
            // 你可以根据后端返回的错误，做更细致的提示
            setError(err.response?.data?.message || "注册失败，请重试。");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // 1. 整体页面容器
        // - 使用与登录页完全相同的样式，确保视觉一致性
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-300 via-purple-100 to-pink-200 p-4"
            // 【背景图片】如果你想添加背景图片，可以取消下面的 style 注释，并换上你的图片URL
            // style={{
            //   backgroundImage: `url('你的背景图片URL')`,
            //   backgroundSize: 'cover',
            //   backgroundPosition: 'center',
            // }}
        >
            {/* 2. 注册表单卡片 */}
            {/* - 同样采用 w-full max-w-md, bg-white, rounded-xl, shadow-lg, p-8 等样式 */}
            {/* - space-y-6 为表单元素之间提供统一的垂直间距 */}
            <form
                onSubmit={handleRegister}
                className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6"
            >
                {/* 3. 标题 */}
                <h2 className="text-3xl font-bold text-center text-gray-800">
                    注册
                </h2>

                {/* 4. 账号输入区域 */}
                {/* - 为了与登录页保持一致，将 "用户名" 改为 "账号" */}
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
                        placeholder="请设置你的账号"
                    />
                </div>

                {/* 5. 密码输入区域 */}
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
                        placeholder="请设置你的密码"
                    />
                </div>

                {/* 6. 错误信息展示 */}
                {/* - 采用居中、红色的样式来提示错误 */}
                {error && (
                    <div className="text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* 7. 注册按钮 (主操作) */}
                {/* - 这是一个全宽度的主要操作按钮，颜色和样式与登录按钮相同 */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-4 py-2 text-white bg-blue-600 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? "注册中..." : "创建账户"}
                </button>

                {/* 8. 返回登录链接 (次要操作) */}
                {/* - 居中放置，并设计成链接样式，引导用户返回登录页面 */}
                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        disabled={isLoading}
                        className="text-blue-600 hover:text-blue-800 font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        已有账号？立即登录
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;
