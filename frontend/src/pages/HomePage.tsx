// src/pages/HomePage.tsx
import { useState, useEffect } from "react";
import type { Character, Conversation, User } from "../types/index";
import CharacterCard from "../components/CharacterCard";
import AddCharacterCard from "../components/AddCharacterCard";
import HistoryDialog from "../components/HistoryDialog";
import CreateCharacterDialog from "../components/CreateCharacterDialog"; // 导入新组件
import Navbar from "../components/HomePageNavbar";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    // 状态管理
    const [currentUser, setCurrentUser] = useState<User>({
        id: "user-123",
        username: "Alice",
    });

    const [defaultCharacters, setDefaultCharacters] = useState<Character[]>([]);
    const [customCharacters, setCustomCharacters] = useState<Character[]>([]);
    const [showHistoryDialog, setShowHistoryDialog] = useState<boolean>(false);
    const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false); // 新增状态
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const navigate = useNavigate();

    // 模拟数据
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

    useEffect(() => {
        setCustomCharacters([
            {
                id: "char-3",
                name: "我的健身教练",
                description: "为我量身定制的健身计划。",
                avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
                isDefault: false,
                createdBy: "user-123",
                tags: ["健康", "运动"],
            },
        ]);
    }, []);

    // 事件处理
    const handleCardClick = (character: Character) => {
        setSelectedCharacter(character);
        setShowHistoryDialog(true);
    };

    const handleCloseHistoryDialog = () => {
        setShowHistoryDialog(false);
        setSelectedCharacter(null);
    };

    // 修改：打开创建角色弹窗
    const handleCreateNew = () => {
        setShowCreateDialog(true);
    };

    // 新增：关闭创建角色弹窗
    const handleCloseCreateDialog = () => {
        setShowCreateDialog(false);
    };

    // 新增：创建新角色后的处理
    const handleCreateCharacter = (newCharacter: Character) => {
        setCustomCharacters(prev => [...prev, newCharacter]);
        setShowCreateDialog(false);
    };

    const handleLogout = () => {
        navigate("/login");
    };

    const handleStartNewConversation = () => {
        // 实现开启新对话的逻辑
    };

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
            {showHistoryDialog && selectedCharacter && (
                <HistoryDialog
                    character={selectedCharacter}
                    onClose={handleCloseHistoryDialog}
                    onStartNewConversation={handleStartNewConversation}
                />
            )}
            
            {/* 新增：创建角色对话框 */}
            {showCreateDialog && (
                <CreateCharacterDialog 
                    onClose={handleCloseCreateDialog}
                    onCreate={handleCreateCharacter}
                />
            )}
        </div>
    );
};

export default HomePage;