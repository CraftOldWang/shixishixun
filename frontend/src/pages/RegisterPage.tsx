import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      // TODO: 替换为真实注册API
      await new Promise(res => setTimeout(res, 1000)); // 模拟网络延迟
      // 注册成功后跳转到登录页
      navigate("/login");
    } catch (err) {
      setError("注册失败，请重试。");
    } finally {
      setIsLoading(false);
    }
  };

    return (
        <div>
            <form onSubmit={handleRegister}>
                <h2>注册</h2>
                <div>
                    <label>用户名</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label>密码</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                {error && <div>{error}</div>}
                <div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "注册中..." : "注册"}
                    </button>
                    <button type="button" onClick={() => navigate("/login")} disabled={isLoading}>
                        返回登录
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;