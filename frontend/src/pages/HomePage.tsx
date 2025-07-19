import { useState, useEffect } from "react";
import type { Character, Conversation, User } from "../types/index";
import CharacterCard from "../components/CharacterCard";
import AddCharacterCard from "../components/AddCharacterCard";
import HistoryDialog from "../components/HistoryDialog"
import Navbar from "../components/HomePageNavbar";
import { useNavigate } from "react-router-dom";
import { Settings, X } from "lucide-react"; // 举例：使用 lucide-react 图标库

const HomePage = () => {
    // --- State Management ---
    // In a real app, this user object would come from context or a hook
    //TODO 用户信息应该从Authcontext中获取 , 注意jwt?
    const [currentUser, setCurrentUser] = useState<User>({
        id: "user-123",
        username: "Alice",
    });

    const [defaultCharacters, setDefaultCharacters] = useState<Character[]>([]);
    const [customCharacters, setCustomCharacters] = useState<Character[]>([]);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [selectedCharacter, setSelectedCharacter] =
        useState<Character | null>(null);
    const navigate = useNavigate();

    // --- Mock Data (Conforming to your types) ---
    //TODO 这些都需要通过后端API得到
    //1.默认角色信息  2. 该用户自定义角色信息  3.某个用户与某个角色的所有 conversation (不包含message)。
    //还不知道怎么办的逻辑： 1.点击某一条历史会话可以加载，从那里继续对话。 2.如何开启新对话。
    // 下面这些useEffect 是在组件初次被加载时挂载(不太懂该怎么描述)

    // 默认角色 mock data
    useEffect(() => {
        setDefaultCharacters([
            {
                id: "char-1",
                name: "全能翻译官",
                description: "精通多种语言，提供精准翻译。",
                avatar: "https://images.unsplash.com/photo-1543465077-5338d8232588?w=400",
                isDefault: true,
                tags: ["翻译", "学习"],
            },
            {
                id: "char-2",
                name: "编程高手",
                description: "解决各种编程难题和代码审查。",
                avatar: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400",
                isDefault: true,
                tags: ["编程", "技术"],
            },
            {
                id: "1",
                name: "小明",
                description: "热心的学习助手",
                avatar: "https://randomuser.me/api/portraits/men/1.jpg",
                isDefault: true,
                tags: ["默认", "AI", "幽默"],
            },
            {
                id: "2",
                name: "小红",
                description: "善于讲故事的AI",
                avatar: "https://randomuser.me/api/portraits/women/2.jpg",
                isDefault: true,
                tags: ["默认", "故事", "温柔"],
            },
        ]);
    }, []);

    // 自定义角色 mock data
    useEffect(() => {
        setCustomCharacters([
            {
                id: "char-3",
                name: "我的健身教练",
                description: "为我量身定制的健身计划。",
                avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
                isDefault: false,
                createdBy: currentUser.id,
                tags: ["健康", "运动"],
            },
        ]);
    }, []);



    // --- 初次加载时运行 ---
    //TODO 需要根据后端API制作。
    // TODO: 获取默认角色列表
    useEffect(() => {
        // fetchDefaultCharacters().then(setDefaultCharacters)
    }, []);

    // TODO: 获取自定义角色列表
    useEffect(() => {
        // fetchCustomCharacters().then(setCustomCharacters)
    }, []);

    // --- Event Handlers ---
    //TODO 还需要添加拿历史记录并设置的 逻辑
    const handleCardClick = (character: Character) => {
        setSelectedCharacter(character);
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
        setSelectedCharacter(null);
    };

    //TODO 创建自定义角色的页面
    const handleCreateNew = () => {
        alert("跳转到创建角色页面或打开创建弹窗！");
        navigate("/create_chara_todo");
    };

    const handleLogout = () => {
        // setCurrentUser(null); //呃，不过没有登录是到不了这个页面的。
        navigate("/login");
    };

    //TODO
    const handleStartNewConversation = () => {};
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* 导航栏 */}
            <Navbar currentUser={currentUser} onLogout={handleLogout} />

            {/* 主要内容 */}
            <main className="flex-grow container mx-auto p-6 md:p-8">
                {/* 默认角色区块 */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        默认角色
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {defaultCharacters.map((char) => (
                            <CharacterCard
                                key={char.id}
                                character={char}
                                onClick={() => handleCardClick(char)}
                            />
                        ))}
                    </div>
                </section>

                {/* 自定义角色区块 */}
                <section className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        自定义角色
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        <AddCharacterCard onClick={handleCreateNew} />
                        {customCharacters.map((char) => (
                            <CharacterCard
                                key={char.id}
                                character={char}
                                onClick={() => handleCardClick(char)}
                            />
                        ))}
                    </div>
                </section>
            </main>

            {/* 历史对话框 */}
            {showDialog && selectedCharacter && (
                <HistoryDialog
                character={selectedCharacter}
                onClose={handleCloseDialog}
                onStartNewConversation={handleStartNewConversation}
                />
            )}

        </div>
    );
};

export default HomePage;
