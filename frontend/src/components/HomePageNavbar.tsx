import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/index";
import { Settings } from "lucide-react";

interface NavBarProps {
    currentUser: User;
    onLogout: () => void;
}
// onLogout大概是要返回到登录页面的， 然后清除本地用户什么的。
const NavBar: React.FC<NavBarProps> = ({ currentUser, onLogout }) => {
    // 使用tailwindcss来做悬浮菜单，不需要了。
    // const [showUserMenu, setShowUserMenu] = useState(false);

    // 处理点击外部关闭菜单的逻辑 (可选但推荐)
    // 可以在这里添加一个 useEffect 来监听点击事件，当点击区域在菜单外部时关闭菜单
    // 但为了简化，这里暂时不添加，只通过点击按钮切换

    // 默认的登出处理函数，如果父组件没有提供 onLogout prop
    const handleLogout = () => {
        onLogout ? onLogout() : alert("登出成功 (默认处理)");
    };
    const navigate = useNavigate();

    // 调试用打印信息。
    // console.log(currentUser.id);

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-8">
                    <h1 className="text-xl font-bold text-gray-800">
                        {/* TODO 应用名.... */}
                        MyApp {/* 这个也可以作为 prop 传入，例如 appName */}
                    </h1>
                    <div className="hidden md:flex items-center space-x-6">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                        >
                            首页
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/wordbook")}
                            className="text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            单词本
                        </button>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        aria-label="setting"
                        type="button"
                        className="text-gray-500 hover:text-gray-800"
                    >
                        {/* TODO要做这个吗？ */}
                        <Settings className="w-5 h-5" />
                    </button>
                    <div className="relative group">
                        <button
                            type="button"
                            className="flex items-center space-x-2"
                        >
                            <span className="text-gray-700 font-medium">
                                {currentUser.username}
                            </span>
                            {/* TODO暂时不考虑给用户添加头像, 可能随机一个 或者...找一个 */}
                            <img
                                src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRR-BzFOrymJ6oS1w1T2N_OdQ4U-H-hmZdTB_DebBCv2MDNHsMKxjsnVtf&s`}
                                alt="avatar"
                                className="h-9 w-9 rounded-full object-cover"
                            />
                        </button>


                        {/* 悬浮菜单 */}
                        <div
                            className="absolute right-0  w-48 bg-white rounded-md shadow-xl z-50 py-1
               opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 
               transition-transform transition-opacity duration-150 ease-in-out pointer-events-none group-hover:pointer-events-auto"
                        >
                            <button
                                type="button"
                                onClick={() => navigate("/profile")}
                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                用户中心
                            </button>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                登出
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default NavBar;

