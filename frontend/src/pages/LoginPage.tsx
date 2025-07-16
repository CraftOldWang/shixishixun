import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
// import { Button, Input } from "../components/ui";


const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); // 重置错误信息

        try {
            await login(username, password);
            navigate("/");
        } catch (err) {
            setError("登录失败，请检查用户名和密码，或注册账号。");
        }
    };

    const handleRegister = () => {
        navigate("/register");
    };
    return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">登录</h2>
        <div className="mb-4">
          <label className="block mb-1">用户名</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">密码</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
            disabled={isLoading}
          />
        </div>
        {error && (
          <div className="mb-4 text-red-500 text-sm">{error}</div>
        )}
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isLoading}
          >
            {isLoading ? "登录中..." : "登录"}
          </button>
          <button
            type="button"
            className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
            onClick={handleRegister}
            disabled={isLoading}
          >
            注册
          </button>
        </div>
      </form>
    </div>

    );
}


export default LoginPage;