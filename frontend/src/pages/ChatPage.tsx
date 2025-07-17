import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useConversation } from "../hooks/useConversation";
import MessageBubble from "../components/MessageBubble";
import ChatInput from "../components/ChatInput";
import ChatOptions from "../components/ChatOptions";
import ConversationHistory from "../components/ConversationHistory";
import CharacterAvatar from "../components/CharacterAvatar";
import defaultCharacterImage from "../assets/default-character.svg";

const ChatPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const {
        conversation,
        character,
        loading,
        error,
        messages,
        options,
        sendUserMessage,
        selectOption,
        showHistory,
        setShowHistory,
    } = useConversation();

    // 如果没有角色ID，重定向到首页
    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (!character && !loading) {
            navigate("/");
        }
    }, [user, character, loading, navigate]);

    // 创建一个模拟角色，以防character为null
    const defaultCharacter = {
        id: "default",
        name: "语言助手",
        description: "默认语言学习助手",
        avatar: defaultCharacterImage,
        isDefault: true,
    };

    // 处理历史记录显示切换
    const toggleHistory = () => {
        setShowHistory(!showHistory);
    };

    // 处理选项点击
    const handleOptionSelect = async (option: string) => {
        await selectOption(option);
    };

    // 处理消息发送
    const handleSendMessage = async (content: string) => {
        await sendUserMessage(content);
    };

    return (
        <div>
            {/* 历史记录侧边栏 */}
            {showHistory && conversation && character && (
                <ConversationHistory
                    messages={messages}
                    characterName={character.name}
                    onClose={toggleHistory}
                />
            )}
            {/* 主内容区 */}
            

            {/* 左侧 */}
            <div>
                {/* 角色区域 - 左侧 */}
                <div>
                    {character ? (
                        <CharacterAvatar character={character} />
                    ) : (
                        <CharacterAvatar character={defaultCharacter} />
                    )}
                </div>

                {/* 对话区域 - 右侧 */}
                <div>
                    <button onClick={toggleHistory}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>

                    {/* 加载状态 */}
                    {loading && (
                        <div>
                            <div>
                                <p>加载中...</p>
                            </div>
                        </div>
                    )}

                    {/* 错误状态 */}
                    {error && (
                        <div>
                            <div>
                                <p></p>
                                <button onClick={() => navigate("/")}>返回首页</button>
                            </div>
                        </div>
                    )}

                    {/* 对话内容 */}
                    {!loading && !error && (
                        <>
                            <div>
                                <div>
                                    {messages.length === 0 ? (
                                        <div>
                                            <div>
                                                <h2>
                                                    开始与
                                                    {character?.name || "语言助手"}
                                                    对话
                                                </h2>
                                                <p>
                                                    选择下方的选项或输入你想说的话开始对话
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        messages.map((message) => (
                                            <MessageBubble
                                                key={message.id}
                                                message={message}
                                                conversationId={
                                                    conversation?.id || ""
                                                }
                                            />
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* 选项区域 */}
                            <div>
                                <ChatOptions
                                    options={options}
                                    onSelectOption={handleOptionSelect}
                                    disabled={loading}
                                />
                            </div>

                            {/* 输入区域 */}
                            <div>
                                <ChatInput
                                    onSendMessage={handleSendMessage}
                                    disabled={loading}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
