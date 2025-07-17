import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


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
    <div>
      <form onSubmit={handleLogin}>
        <h2>登录</h2>
        <div>
          <label>用户名</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label>密码</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        {error && <div>{error}</div>}
        <div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "登录中..." : "登录"}
          </button>
          <button
            type="button"
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