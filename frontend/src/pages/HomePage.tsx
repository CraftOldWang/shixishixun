// src/pages/HomePage.tsx
import { useState, useEffect } from "react";
import type { Character, Conversation, User } from "../types/index";
import CharacterCard from "../components/CharacterCard";
import AddCharacterCard from "../components/AddCharacterCard";
import HistoryDialog from "../components/HistoryDialog";
import CreateCharacterDialog from "../components/CreateCharacterDialog"; // 导入新组件
import Navbar from "../components/HomePageNavbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
    fetchDefaultCharacters,
    fetchCustomCharacters,
} from "../services/characterService";

const HomePage = () => {
    // --- State Management ---
    const navigate = useNavigate();
    const { user: currentUser, logout } = useAuth();
    console.log(currentUser);
    const [defaultCharacters, setDefaultCharacters] = useState<Character[]>([]);
    const [customCharacters, setCustomCharacters] = useState<Character[]>([]);
    const [showHistoryDialog, setShowHistoryDialog] = useState<boolean>(false);
    const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false); // 新增状态
    const [selectedCharacter, setSelectedCharacter] =
        useState<Character | null>(null);

    useEffect(() => {
        // 加载默认角色
        fetchDefaultCharacters().then(setDefaultCharacters);
    }, []);

    useEffect(() => {
        // 加载自定义角色
        fetchCustomCharacters().then(setCustomCharacters);
    }, []);

    // --- Event Handlers ---
    // 点击卡片
    const handleCardClick = (character: Character) => {
        setSelectedCharacter(character);
        setShowHistoryDialog(true);
    };

    // 关闭卡片(历史会话框)
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
        setCustomCharacters((prev) => [...prev, newCharacter]);
        setShowCreateDialog(false);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* 导航栏 */}
            <Navbar currentUser={currentUser!} onLogout={handleLogout} />

            {/* 主要内容 */}
            <main className="flex-grow container mx-auto p-6 md:p-8">
                {/* 默认角色区块 */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        默认角色
                    </h2>
                    <div className="flex flex-wrap gap-6">
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
                    <div className="flex flex-wrap gap-6">
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
