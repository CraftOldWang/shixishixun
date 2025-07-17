import { useState, useEffect } from "react";
import type { Character, Conversation } from "../types/index";
import CharacterCard from "../components/CharacterCard";
import Navbar from "../components/HomePageNavbar";


const HomePage = () => {
    // 默认角色、自定义角色、弹窗相关状态
    const [defaultCharacters, setDefaultCharacters] = useState<Character[]>([]);
    const [customCharacters, setCustomCharacters] = useState<Character[]>([]);
    const [selectedCharacter, setSelectedCharacter] =
        useState<Character | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);

    // TODO: 获取默认角色列表
    useEffect(() => {
        // fetchDefaultCharacters().then(setDefaultCharacters)
    }, []);

    // TODO: 获取自定义角色列表
    useEffect(() => {
        // fetchCustomCharacters().then(setCustomCharacters)
    }, []);

    useEffect(() => {
        // TODO: 替换为真实API
        setDefaultCharacters([
            {
                id: "1",
                name: "小明",
                description: "热心的学习助手",
                avatar: "https://randomuser.me/api/portraits/men/1.jpg",
                isDefault: true,
                createdBy: "1",
                tags: ["默认", "AI", "幽默"],
            },
            {
                id: "2",
                name: "小红",
                description: "善于讲故事的AI",
                avatar: "https://randomuser.me/api/portraits/women/2.jpg",
                isDefault: true,
                createdBy: "1",
                tags: ["默认", "故事", "温柔"],
            },
        ]);
    }, []);

    useEffect(() => {
        // TODO: 替换为真实API
        setCustomCharacters([
            {
                id: "3",
                name: "自定义角色A",
                description: "你自己创建的角色",
                avatar: "",
                isDefault: false,
                createdBy: "2",
                tags: ["自定义", "测试"],
            },
        ]);
    }, []);

    // 角色卡片点击
    const handleCardClick = (character: Character) => {
        setSelectedCharacter(character);
        setShowDialog(true);
        // TODO: 获取该角色历史记录
        // fetchConversations(character.id).then(setConversations)
    };

    // 弹窗关闭
    const handleCloseDialog = () => {
        setShowDialog(false);
        setSelectedCharacter(null);
        setConversations([]);
    };

    return (
        <>
            {/* 导航栏 */}
            <Navbar username="用户名" avatarUrl="头像URL" />

            {/* 默认角色区块 */}
            <section>
                <h2>默认角色</h2>
                <div>
                    {defaultCharacters.map((char) => (
                        <CharacterCard
                            key={char.id}
                            character={char}
                            onClick={handleCardClick}
                            highlightColor="#fafafa"
                        />
                    ))}
                </div>
            </section>

            {/* 自定义角色区块 */}
            <section>
                <h2>自定义角色</h2>
                <div
                    onClick={() => {
                        // TODO: 打开创建角色弹窗或跳转
                    }}
                >
                    <div>+</div>
                    <div>创建自定义角色</div>
                </div>
                <div>
                    {customCharacters.map((char) => (
                        <CharacterCard
                            key={char.id}
                            character={char}
                            onClick={handleCardClick}
                            highlightColor="#fafafa"
                        />
                    ))}
                </div>
            </section>

            {showDialog && selectedCharacter && (
                <div>
                    <div>
                        <h3>{selectedCharacter.name} 的历史对话</h3>
                        <button onClick={handleCloseDialog}>关闭</button>
                    </div>
                    <div>
                        <button
                            onClick={() => {
                                // TODO: 开启新对话
                            }}
                        >
                            开启新对话
                        </button>
                    </div>
                    <div>
                        {conversations.length === 0 ? (
                            <div>暂无历史记录</div>
                        ) : (
                            conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => {
                                        // TODO: 继续对话（跳转或弹窗）
                                    }}
                                >
                                    <div>{conv.title}</div>
                                    <div>话题：{conv.topic || "无"}</div>
                                    <div>摘要：{conv.summary || "无"}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default HomePage;
