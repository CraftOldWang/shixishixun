import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useConversation } from "../hooks/useConversation";
import MessageBubble from "../components/MessageBubble";
import ChatInput from "../components/ChatInput";
import ChatOptions from "../components/ChatOptions";
import ConversationHistory from "../components/ConversationHistory";
import CharacterAvatar from "../components/CharacterAvatar";
import backgroundImage from "../assets/background.svg";
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
        <div
            className="relative min-h-screen flex flex-col"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* 历史记录侧边栏 */}
            {showHistory && conversation && character && (
                <ConversationHistory
                    messages={messages}
                    characterName={character.name}
                    onClose={toggleHistory}
                />
            )}

            {/* 主内容区 */}
            <div className="flex-1 flex">
                {/* 角色区域 - 左侧 */}
                <div className="w-1/3 h-screen flex items-center justify-center p-4">
                    {character ? (
                        <CharacterAvatar character={character} />
                    ) : (
                        <CharacterAvatar character={defaultCharacter} />
                    )}
                </div>

                {/* 对话区域 - 右侧 */}
                <div className="w-2/3 flex flex-col p-6">
                    {/* 历史记录按钮 */}
                    <button
                        onClick={toggleHistory}
                        className="absolute top-4 left-4 bg-black bg-opacity-60 backdrop-blur-md text-white p-2 rounded-full z-10"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
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
                        <div className="flex-1 flex items-center justify-center">
                            <div className="bg-black bg-opacity-60 backdrop-blur-md text-white p-4 rounded-lg">
                                <p>加载中...</p>
                            </div>
                        </div>
                    )}

                    {/* 错误状态 */}
                    {error && (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="bg-black bg-opacity-60 backdrop-blur-md text-white p-4 rounded-lg">
                                <p className="text-red-500">{error}</p>
                                <button
                                    onClick={() => navigate("/")}
                                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                                >
                                    返回首页
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 对话内容 */}
                    {!loading && !error && (
                        <>
                            <div className="flex-1 overflow-y-auto mb-4 pr-4 space-y-4">
                                {messages.length === 0 ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="bg-black bg-opacity-60 backdrop-blur-md text-white p-6 rounded-lg max-w-md text-center">
                                            <h2 className="text-xl font-bold mb-2">
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

                            {/* 选项区域 */}
                            <div className="mb-4">
                                <ChatOptions
                                    options={options}
                                    onSelectOption={handleOptionSelect}
                                    disabled={loading}
                                />
                            </div>

                            {/* 输入区域 */}
                            <div className="mt-auto">
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
