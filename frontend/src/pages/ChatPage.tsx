import React, { useState, useEffect, useRef } from "react";
import { Volume2, X, Send, Search, MessageSquare, Menu } from "lucide-react";
import { Star } from "lucide-react"; // 你可以换成 StarOff 或 Bookmark 等
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "react-router-dom";
import type {
    User,
    Character,
    Message,
    Conversation,
    Wordcard,
} from "../types/index";
import {
    getConversationWithoutMessages,
    getMessagesByConversationId,
} from "../services/conversationService";
import { fetchSingleCharacterById } from "../services/characterService";
import {
    addFavorite,
    checkIfFavorited,
    fetchWordDefinition,
    removeFavorite,
} from "../services/wordService";
import {
    fetchAiOptions,
    getAiResponse,
    saveUserMessage,
} from "../services/aiService";
// --- 模拟数据 (为单个对话场景调整) ---

// --- React 组件 ---
// 单词定义悬浮窗 (Popover)
const WordDefinitionPopup: React.FC<{
    word: string;
    position: { top: number; left: number };
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}> = ({ word, position, onMouseEnter, onMouseLeave }) => {
    const [data, setData] = useState<Partial<Wordcard> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFavorited, setIsFavorited] = useState(false); // 收藏状态

    useEffect(() => {
        setIsLoading(true);
        setData(null);
        setIsFavorited(false); // 每次新词取消收藏状态（根据你需要可保留）

        // 同时请求词义 和 收藏状态
        Promise.all([
            fetchWordDefinition(word),
            checkIfFavorited(word), // 👈 加这个
        ]).then(([def, favorited]) => {
            setData(def);
            setIsFavorited(favorited);
            setIsLoading(false);
        });
    }, [word]);

    const toggleFavorite = async () => {
        const newState = !isFavorited;
        setIsFavorited(newState);

        try {
            newState ? await addFavorite(word) : await removeFavorite(word);
        } catch (err) {
            console.error(err);
            setIsFavorited(!newState);
        }
    };

    return (
        <div
            className="absolute z-50 w-64 transform transition-all duration-150"
            style={{ top: position.top, left: position.left }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700">
                {/* 收藏按钮 */}
                <button
                    onClick={toggleFavorite}
                    className="absolute top-2 right-2 text-gray-400 hover:text-yellow-500 transition-colors"
                    aria-label="收藏"
                >
                    <Star
                        size={20}
                        fill={isFavorited ? "#facc15" : "none"} // 黄色填充
                        stroke={isFavorited ? "#facc15" : "currentColor"} // 黄色描边
                    />
                </button>

                <h3 className="font-bold text-lg mb-2">{word}</h3>
                {isLoading ? (
                    <div className="animate-pulse space-y-2">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                    </div>
                ) : (
                    // TODO这个样式有点怪....
                    <>
                        <p className="text-sm">{data?.pronunciation}</p>
                        <p className="text-sm">{data?.pos}</p>
                        <p className="text-sm">{data?.context}</p>
                    </>
                )}
            </div>
        </div>
    );
};

//  左侧 - 可伸缩的对话历史侧边栏
const ConversationSidebar: React.FC<{
    isCollapsed: boolean;
    onToggle: () => void;
    messages: Message[] | null;
    onWordMouseEnter: (
        word: string,
        position: { top: number; left: number }
    ) => void;
    onWordMouseLeave: () => void;
}> = ({
    isCollapsed,
    onToggle,
    messages,
    onWordMouseEnter,
    onWordMouseLeave,
}) => {
    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "auto" });
    }, [messages]);

    const handleWordHover = (e: React.MouseEvent<HTMLSpanElement>) => {
        const text = e.currentTarget.innerText.trim().replace(/[.,!?]/g, "");
        if (text) {
            const rect = e.currentTarget.getBoundingClientRect();
            onWordMouseEnter(text, { top: rect.bottom + 8, left: rect.left });
        }
    };

    return (
        <aside
            className={`bg-black bg-opacity-30 backdrop-blur-md h-screen flex flex-col transition-all duration-300 ease-in-out ${
                isCollapsed ? "w-16" : "w-96"
            }`}
        >
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                {!isCollapsed && (
                    <h2 className="text-xl font-bold text-white">对话历史</h2>
                )}
                <button
                    onClick={onToggle}
                    className="text-gray-300 hover:text-white p-1"
                >
                    {isCollapsed ? (
                        <ChevronRight size={24} />
                    ) : (
                        <ChevronLeft size={24} />
                    )}
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {!isCollapsed &&
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`p-3 rounded-lg ${
                                msg.isUser
                                    ? "bg-blue-800 bg-opacity-50 text-right"
                                    : "bg-gray-700 bg-opacity-50"
                            }`}
                        >
                            <p className="text-sm text-white text-left">
                                {msg.content
                                    .split(/(\s+)/)
                                    .map((word, index) => (
                                        <span
                                            key={index}
                                            className="cursor-pointer hover:bg-yellow-400 hover:text-black rounded"
                                            onMouseEnter={handleWordHover}
                                            onMouseLeave={onWordMouseLeave}
                                        >
                                            {word}
                                        </span>
                                    ))}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 text-left">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                        </div>
                    ))}
                <div ref={endOfMessagesRef} />
            </div>
        </aside>
    );
};

// 右侧 - 当前角色回复
const CurrentReplyPanel: React.FC<{
    message: Message | null;
    onWordMouseEnter: (
        word: string,
        position: { top: number; left: number }
    ) => void;
    onWordMouseLeave: () => void;
}> = ({ message, onWordMouseEnter, onWordMouseLeave }) => {
    const handleWordHover = (e: React.MouseEvent<HTMLSpanElement>) => {
        const text = e.currentTarget.innerText.trim().replace(/[.,!?]/g, "");
        if (text) {
            const rect = e.currentTarget.getBoundingClientRect();
            onWordMouseEnter(text, { top: rect.bottom + 8, left: rect.left });
        }
    };

    const handleTTS = (content: string) => {
        if ("speechSynthesis" in window && content) {
            const utterance = new SpeechSynthesisUtterance(content);
            speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="w-full h-full p-6 flex flex-col justify-center">
            <div>
                <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-500 pb-2">
                    当前回复
                </h2>
                {message ? (
                    <div className="bg-gray-700 bg-opacity-50 p-6 rounded-2xl shadow-lg">
                        <p className="text-2xl text-white leading-relaxed">
                            {message.content
                                .split(/(\s+)/)
                                .map((word, index) => (
                                    <span
                                        key={index}
                                        className="cursor-pointer hover:bg-yellow-400 hover:text-black rounded"
                                        onMouseEnter={handleWordHover}
                                        onMouseLeave={onWordMouseLeave}
                                    >
                                        {word}
                                    </span>
                                ))}
                        </p>
                        <button
                            onClick={() => handleTTS(message.content)}
                            className="text-gray-300 hover:text-white mt-4 flex items-center gap-2"
                        >
                            <Volume2 size={20} /> 朗读
                        </button>
                    </div>
                ) : (
                    <div className="text-center text-gray-400">
                        <MessageSquare size={48} className="mx-auto" />
                        <p className="mt-4">正在等待角色的回复...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- 主页面组件 ---
export default function ChatPage() {
    // const [character] = useState<Character>(mockCharacter);

    // 状态控制
    const [currentCharacterReply, setCurrentCharacterReply] =
        useState<Message | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    const [loading, setLoading] = useState(true);

    // 路径参数
    // TODO使用假数据时，返回的conversation对象与 这个id 无关
    const { conversationId } = useParams<{ conversationId: string }>();

    //需要用api fetch的东西。
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [character, setCharacter] = useState<Character | null>(null);
    const [messages, setMessages] = useState<Message[] | null>(null);
    const [aiOptions, setAiOptions] = useState<string[] | null>(null);
    // 悬浮窗状态管理
    const [popupInfo, setPopupInfo] = useState<{
        word: string;
        position: { top: number; left: number };
    } | null>(null);
    // const closeTimer = useRef<NodeJS.Timeout | null>(null);
    // 编辑器提示我使用更安全的 ... 不要访问NodeJS
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!conversationId) return;

        const loadData = async () => {
            setLoading(true);
            try {
                // 获取会话信息(注意messages是空的)
                const conv = await getConversationWithoutMessages(
                    conversationId
                );
                setConversation(conv);

                // 这个貌似可以跟下面获取角色信息...并发执行。。不过不管了
                const msg = await getMessagesByConversationId(conversationId);
                setMessages(msg);

                // 获取角色信息
                const char = await fetchSingleCharacterById(conv.characterId);
                setCharacter(char);
            } catch (err) {
                console.error("加载失败：", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [conversationId]); // 说实话也就最初需要加载

    // 同步更新当前回复
    useEffect(() => {
        // 发送消息之后，aioptions应该先被清空。
        setAiOptions([]);

        if (messages && messages.length > 0) {
            const lastCharacterMessage = [...messages]
                .reverse()
                .find((m) => !m.isUser);
            setCurrentCharacterReply(lastCharacterMessage || null);
        } else {
            setCurrentCharacterReply(null);
        }
    }, [messages]);

    // 异步请求推荐问题
    useEffect(() => {
        if (!currentCharacterReply?.content) {
            setAiOptions([]);
            return;
        }

        const fetchOptions = async () => {
            try {
                const options = await fetchAiOptions(
                    currentCharacterReply.content,
                    conversationId
                );
                if (Array.isArray(options)) {
                    setAiOptions(options.slice(0, 3));
                } else {
                    setAiOptions([]);
                }
            } catch {
                setAiOptions([]);
            }
        };

        fetchOptions();
    }, [currentCharacterReply]);

    const handleSendMessage = async (content: string) => {
        if (content.trim() === "") return;

        // 先在前端展示用户消息（即时响应）
        const tempId = `temp-${Date.now()}`;
        const userMessage: Message = {
            id: tempId,
            conversationId: conversation!.id,
            content,
            isUser: true,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev!, userMessage]);
        setInputValue("");

        try {
            // 调接口保存用户消息，得到后端消息（带正式id等）
            const savedUserMessage = await saveUserMessage(
                content,
                conversation!.id
            );

            // 替换临时消息为后端返回的消息（根据 id 替换，确保一致）
            setMessages((prev) =>
                prev!.map((msg) => (msg.id === tempId ? savedUserMessage : msg))
            );

            // 调接口获取AI回复
            const aiResponse = await getAiResponse(content, conversation!.id);

            // 添加AI回复消息
            setMessages((prev) => [...prev!, aiResponse]);
        } catch (err) {
            console.error("消息发送或AI回复失败", err);
            // 这里可做失败提示或回退处理
        }
    };
    //  悬浮窗显示/隐藏逻辑
    const handleWordMouseEnter = (
        word: string,
        position: { top: number; left: number }
    ) => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setPopupInfo({ word, position });
    };
    const handleMouseLeave = () => {
        closeTimer.current = setTimeout(() => {
            setPopupInfo(null);
        }, 200); // 延迟关闭，方便鼠标移动到悬浮窗上
    };

    const handlePopupMouseEnter = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
    };

    if (loading) return <div>加载中...</div>;
    if (!conversation || !character) return <div>未找到会话或角色</div>;

    return (
        <div className="h-screen w-screen bg-gray-900 font-sans text-white flex relative overflow-hidden">
            {/* //TODO 此外侧边栏貌似不够大....以及这里用亚克力的话，显示效果似乎不太好 */}
            {/* 侧边栏 */}
            {/* --- part1折叠时显示浮动按钮 --- */}
            {isSidebarCollapsed && (
                <button
                    onClick={() => setIsSidebarCollapsed(false)}
                    className="fixed top-4 left-4 z-50 bg-gray-700 text-white rounded-full p-2 shadow-lg hover:bg-gray-600 transition-colors"
                    title="展开侧边栏"
                >
                    <Menu size={20} />
                </button>
            )}

            {/* --- part2展开时显示完整侧边栏 --- */}
            {!isSidebarCollapsed && (
                <div className="fixed top-0 left-0 h-full w-[300px] bg-gray-800 shadow-lg z-50 transition-all">
                    <ConversationSidebar
                        isCollapsed={false}
                        onToggle={() => setIsSidebarCollapsed(true)}
                        messages={messages}
                        onWordMouseEnter={handleWordMouseEnter}
                        onWordMouseLeave={handleMouseLeave}
                    />
                </div>
            )}
            {/* //TODO下面这个有动画效果， 但是收缩回去之后，不能隐藏。 想把动画效果融入到上面在使用的侧边栏。 */}
            {/*  可伸缩侧边栏 */}
            {/* <div
                className={`fixed top-0 left-0 h-full w-[300px] bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ${
                    isSidebarCollapsed ? "-translate-x-full" : "translate-x-0"
                }`}
            >
                <ConversationSidebar
                    isCollapsed={false}
                    onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    messages={messages}
                    onWordMouseEnter={handleWordMouseEnter}
                    onWordMouseLeave={handleMouseLeave}
                />
            </div>  */}

            {/* 主内容区 */}
            <main className="flex-1 flex flex-col relative h-screen">
                {/* 背景图 */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={conversation.backgroundUrl}
                        alt={conversation.topic}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                {/* 角色和当前回复面板 */}
                <div className="relative z-10 flex-1 grid grid-cols-2 gap-6 p-6 overflow-hidden">
                    <div className="flex items-end justify-center">
                        <img
                            src={character.avatar}
                            alt={character.name}
                            className="max-h-full object-contain drop-shadow-2xl"
                        />
                    </div>
                    <div className="hidden md:block">
                        <CurrentReplyPanel
                            message={currentCharacterReply}
                            onWordMouseEnter={handleWordMouseEnter}
                            onWordMouseLeave={handleMouseLeave}
                        />
                    </div>
                </div>

                {/* 底部输入区 */}
                <div className="relative z-20 p-4 bg-black bg-opacity-30 backdrop-blur-md border-t border-gray-700">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-wrap justify-center gap-2 mb-3 min-h-[40px]">
                            {aiOptions &&
                                aiOptions.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            handleSendMessage(option)
                                        }
                                        className="bg-gray-700 text-white text-sm px-4 py-2 rounded-full hover:bg-gray-600 transition-colors"
                                    >
                                        {option}
                                    </button>
                                ))}
                        </div>
                        <div className="flex items-center bg-gray-800 rounded-xl p-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) =>
                                    e.key === "Enter" &&
                                    handleSendMessage(inputValue)
                                }
                                placeholder={`与 ${character.name} 对话...`}
                                className="flex-1 bg-transparent placeholder-gray-400 focus:outline-none px-3"
                            />
                            <button
                                aria-label="发送"
                                onClick={() => handleSendMessage(inputValue)}
                                className="bg-blue-500 rounded-lg p-3 text-white hover:bg-blue-600 transition-colors disabled:bg-gray-500"
                                disabled={!inputValue.trim()}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* 单词查询悬浮窗 */}
            {popupInfo && (
                <WordDefinitionPopup
                    word={popupInfo.word}
                    position={popupInfo.position}
                    onMouseEnter={handlePopupMouseEnter}
                    onMouseLeave={handleMouseLeave}
                />
            )}
        </div>
    );
}
