import { useState, useEffect } from "react";
import type { Character, Conversation } from "../types/index";
import CharacterCard from "../components/CharacterCard";

// 导航栏组件（可以单独拆出去）
function Navbar({
    username,
    avatarUrl,
}: {
    username: string;
    avatarUrl?: string;
}) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 16px",
                borderBottom: "1px solid #eee",
            }}
        >
            {/* 左侧导航 */}
            <div>
                <button>首页</button>
                <button>单词本</button>
                <button>账号管理</button>
            </div>
            {/* 右侧用户信息 */}
            <div style={{ position: "relative" }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                    }}
                    onMouseEnter={() => setShowMenu(true)}
                    onMouseLeave={() => setShowMenu(false)}
                >
                    {avatarUrl && (
                        <img
                            src={avatarUrl}
                            alt="avatar"
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                marginRight: 8,
                            }}
                        />
                    )}
                    <span>{username}</span>
                </div>
                {/* 悬浮菜单 */}
                {showMenu && (
                    <div
                        style={{
                            position: "absolute",
                            right: 0,
                            top: "100%",
                            background: "#fff",
                            border: "1px solid #eee",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                            padding: "8px 16px",
                            zIndex: 10,
                        }}
                    >
                        <button
                            onClick={() => {
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
}

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
                tags: ["默认", "AI", "幽默"],
            },
            {
                id: "2",
                name: "小红",
                description: "善于讲故事的AI",
                avatar: "https://randomuser.me/api/portraits/women/2.jpg",
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
                <div className="flex gap-4 flex-wrap">
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
                    style={{
                        border: "2px dashed #a5b4fc",
                        borderRadius: "12px",
                        height: "320px",
                        width: "140px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        background: "#f3f4f6",
                        marginRight: "16px",
                    }}
                >
                    <div style={{ fontSize: "48px", color: "#6366f1" }}>+</div>
                    <div
                        style={{
                            fontWeight: "bold",
                            color: "#6366f1",
                            marginTop: "8px",
                        }}
                    >
                        创建自定义角色
                    </div>
                </div>
                <div className="flex gap-4 flex-wrap">
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
                <div
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        background: "#fff",
                        border: "1px solid #eee",
                        borderRadius: "8px",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                        padding: "24px",
                        zIndex: 100,
                        minWidth: "340px",
                        maxWidth: "90vw",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <h3>{selectedCharacter.name} 的历史对话</h3>
                        <button onClick={handleCloseDialog}>关闭</button>
                    </div>
                    <div style={{ margin: "16px 0" }}>
                        <button
                            onClick={() => {
                                // TODO: 开启新对话
                            }}
                            style={{
                                background: "#3b82f6",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                padding: "8px 16px",
                                cursor: "pointer",
                            }}
                        >
                            开启新对话
                        </button>
                    </div>
                    <div
                        style={{
                            maxHeight: "300px",
                            overflowY: "auto",
                            borderTop: "1px solid #eee",
                            paddingTop: "12px",
                        }}
                    >
                        {conversations.length === 0 ? (
                            <div style={{ color: "#888", textAlign: "center" }}>
                                暂无历史记录
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    style={{
                                        borderBottom: "1px solid #f3f4f6",
                                        padding: "8px 0",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        // TODO: 继续对话（跳转或弹窗）
                                    }}
                                >
                                    <div style={{ fontWeight: "bold" }}>
                                        {conv.title}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "12px",
                                            color: "#555",
                                        }}
                                    >
                                        话题：{conv.topic || "无"}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "12px",
                                            color: "#888",
                                        }}
                                    >
                                        摘要：{conv.summary || "无"}
                                    </div>
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
