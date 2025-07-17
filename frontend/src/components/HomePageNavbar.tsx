import { useState } from "react";
import { useNavigate } from "react-router-dom";

// 导航栏组件
const Navbar = ({
    username,
    avatarUrl,
}: {
    username: string;
    avatarUrl?: string;
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate(); // 获取导航函数

    return (
        <nav>
            {/* 左侧导航 */}
            <div>
                <button
                    onClick={() => {
                        navigate("/");
                    }}
                >
                    首页
                </button>
                <button
                    onClick={() => {
                        navigate("/wordbook");
                    }}
                >
                    单词本
                </button>
            </div>
            {/* 右侧用户信息 */}
            <div>
                <div
                    onMouseEnter={() => setShowMenu(true)}
                    onMouseLeave={() => setShowMenu(false)}
                >
                    {avatarUrl && <img src={avatarUrl} alt="avatar" />}
                    <span>{username}</span>
                </div>
                {/* 悬浮菜单 */}
                {showMenu && (
                    <div>
                        <button
                            onClick={() => {
                                navigate("/profile");
                                /* TODO: 跳转到账户管理 */
                            }}
                        >
                            账户管理
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
