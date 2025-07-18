import React, { useState, useEffect, useRef } from "react";
import { Volume2, X, Send, Search, MessageSquare } from "lucide-react";
import { Star } from "lucide-react"; // 你可以换成 StarOff 或 Bookmark 等

import type {
    User,
    Character,
    Message,
    Conversation,
    WordCard,
} from "../types/index";
// --- 类型定义 (与之前相同) ---
// interface User {
//     id: string;
//     username: string;
// }
// interface Character {
//     id: string;
//     name: string;
//     description: string;
//     avatar: string;
// }
// interface Message {
//     id: string;
//     conversationId: string;
//     content: string;
//     isUser: boolean;
//     timestamp: string;
// }
// interface Conversation {
//     id: string;
//     characterId: string;
//     userId: string;
//     title: string;
//     topic: string;
//     summary: string;
//     updatedAt: string;
//     backgroundUrl: string;
// }
// interface WordCard {
//     id: string;
//     userId: string;
//     word: string;
//     definition: string;
//     context: string;
//     conversationId: string;
//     messageId: string;
//     createdAt: string;
// }

// --- 模拟数据 (为单个对话场景调整) ---

const mockCharacter: Character = {
    id: "char-1",
    name: "艾拉",
    description: "一位知识渊博的图书管理员，对古代历史充满热情。",
    avatar: "https://bkudcgimcodwrexeqekc.supabase.co/storage/v1/object/public/media/characters/bK0mXMTrrspFRMYnE10qbheVZhODQEO4/neutral.jpg",
};
const mockConversation: Conversation = {
    id: "conv-1",
    characterId: "char-1",
    userId: "user-1",
    title: "探寻失落的亚特兰蒂斯",
    topic: "古代历史",
    summary: "我们讨论了关于亚特兰蒂斯沉没的几种理论...",
    updatedAt: "2024-07-18T10:30:00Z",
    backgroundUrl:
        "https://images.unsplash.com/photo-1590302591933-2a46fdb987c5?q=80&w=2070&auto=format&fit=crop",
};
const initialMessages: Message[] = [
    {
        id: "msg-1-1",
        conversationId: "conv-1",
        content:
            "Hello, traveler. Welcome to the Royal Library. What ancient secrets are you interested in?",
        isUser: false,
        timestamp: "2024-07-18T10:30:00Z",
    },
    {
        id: "msg-1-2",
        conversationId: "conv-1",
        content:
            "I have been studying the legends about Atlantis. Are there any clues?",
        isUser: true,
        timestamp: "2024-07-18T10:31:00Z",
    },
    {
        id: "msg-1-3",
        conversationId: "conv-1",
        content:
            "A wise choice. Many people think it is just a myth, but some ancient texts hint at its real existence.",
        isUser: false,
        timestamp: "2024-07-18T10:32:00Z",
    },
];
const mockAiOptions: string[] = [
    "关于它的位置有什么理论？",
    "哪些古代文献提到了它？",
    "为什么它会毁灭？",
];

// --- 模拟 API 调用 ---
const fetchWordDefinition = async (
    word: string
): Promise<Partial<WordCard>> => {
    console.log(`Fetching definition for: ${word}`);
    return new Promise((resolve) =>
        setTimeout(
            () =>
                resolve({
                    word: word,
                    definition: `这是一个模拟的'${word}'的释义。`,
                    context: `这是包含'${word}'的上下文句子。`,
                }),
            500
        )
    );
};

const getMockAiResponse = (userInput: string): Message => ({
    id: `msg-${Date.now()}`,
    conversationId: mockConversation.id,
    content: `关于“${userInput.substring(
        0,
        10
    )}...”，这是一个有趣的问题。根据古籍记载，理论上... (模拟AI回复)`,
    isUser: false,
    timestamp: new Date().toISOString(),
});

// --- React 组件 ---
// **【新】** 单词定义悬浮窗 (Popover)
const WordDefinitionPopup: React.FC<{
    word: string;
    position: { top: number; left: number };
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}> = ({ word, position, onMouseEnter, onMouseLeave }) => {
    const [data, setData] = useState<Partial<WordCard> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFavorited, setIsFavorited] = useState(false); // 收藏状态

    useEffect(() => {
        setIsLoading(true);
        setData(null);
        setIsFavorited(false); // 每次新词取消收藏状态（根据你需要可保留）
        fetchWordDefinition(word).then((res) => {
            setData(res);
            setIsLoading(false);
        });
    }, [word]);

    const toggleFavorite = () => {
        setIsFavorited((prev) => !prev);
        // 你可以在这里添加保存收藏到后端或本地的逻辑
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
                    <p className="text-sm">{data?.definition}</p>
                )}
            </div>
        </div>
    );
};


// 左侧 - 对话历史记录

// **【修改】** 左侧 - 对话历史记录

const MessageHistoryPanel: React.FC<{
    messages: Message[];
    onWordMouseEnter: (
        word: string,
        position: { top: number; left: number }
    ) => void;
    onWordMouseLeave: () => void;
}> = ({ messages, onWordMouseEnter, onWordMouseLeave }) => {
    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleWordHover = (e: React.MouseEvent<HTMLSpanElement>) => {
        const text = e.currentTarget.innerText.trim().replace(/[.,!?]/g, "");
        if (text) {
            const rect = e.currentTarget.getBoundingClientRect();
            onWordMouseEnter(text, { top: rect.bottom + 8, left: rect.left });
        }
    };

    return (
        <div className="w-full h-full bg-black bg-opacity-20 backdrop-blur-sm p-6 flex flex-col">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-500 pb-2">
                对话历史
            </h2>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`p-3 rounded-lg ${
                            msg.isUser
                                ? "bg-blue-800 bg-opacity-50 text-right"
                                : "bg-gray-700 bg-opacity-50"
                        }`}
                    >
                        <p className="text-sm text-white">
                            {msg.content.split(/(\s+)/).map((word, index) => (
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
                        <p className="text-xs text-gray-400 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                    </div>
                ))}
                <div ref={endOfMessagesRef} />
            </div>
        </div>
    );
};

// const MessageHistoryPanel: React.FC<{
//     messages: Message[];
//     onWordClick: (word: string) => void;
// }> = ({ messages, onWordClick }) => {
//     const endOfMessagesRef = useRef<HTMLDivElement>(null);
//     useEffect(() => {
//         endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     const handleWordClick = (e: React.MouseEvent<HTMLSpanElement>) => {
//         const text = e.currentTarget.innerText.trim().replace(/[.,!?]/g, "");
//         if (text) onWordClick(text);
//     };

//     return (
//         <div className="w-full h-full bg-black bg-opacity-20 backdrop-blur-sm p-6 flex flex-col">
//             <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-500 pb-2">
//                 对话历史
//             </h2>
//             <div className="flex-1 overflow-y-auto space-y-4 pr-2">
//                 {messages.map((msg) => (
//                     <div
//                         key={msg.id}
//                         className={`p-3 rounded-lg ${
//                             msg.isUser
//                                 ? "bg-blue-800 bg-opacity-50 text-right"
//                                 : "bg-gray-700 bg-opacity-50"
//                         }`}
//                     >
//                         <p className="text-sm text-white">
//                             {msg.content.split(/(\s+)/).map((word, index) => (
//                                 <span
//                                     key={index}
//                                     className="cursor-pointer hover:bg-yellow-400 hover:text-black rounded"
//                                     onClick={handleWordClick}
//                                 >
//                                     {word}
//                                 </span>
//                             ))}
//                         </p>
//                         <p className="text-xs text-gray-400 mt-1">
//                             {new Date(msg.timestamp).toLocaleTimeString()}
//                         </p>
//                     </div>
//                 ))}
//                 <div ref={endOfMessagesRef} />
//             </div>
//         </div>
//     );
// };

// **【修改】** 右侧 - 当前角色回复
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
        <div className="w-full h-full bg-black bg-opacity-20 backdrop-blur-sm p-6 flex flex-col justify-center">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-500 pb-2">
                当前回复
            </h2>
            {message ? (
                <div className="bg-gray-700 bg-opacity-50 p-6 rounded-2xl shadow-lg">
                    <p className="text-2xl text-white leading-relaxed">
                        {message.content.split(/(\s+)/).map((word, index) => (
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
    );
};

// // 右侧 - 当前角色回复
// const CurrentReplyPanel: React.FC<{
//     message: Message | null;
//     onWordClick: (word: string) => void;
// }> = ({ message, onWordClick }) => {
//     const handleWordClick = (e: React.MouseEvent<HTMLSpanElement>) => {
//         const text = e.currentTarget.innerText.trim().replace(/[.,!?]/g, "");
//         if (text) onWordClick(text);
//     };

//     const handleTTS = (content: string) => {
//         if ("speechSynthesis" in window && content) {
//             const utterance = new SpeechSynthesisUtterance(content);
//             speechSynthesis.speak(utterance);
//         }
//     };

//     return (
//         <div className="w-full h-full bg-black bg-opacity-20 backdrop-blur-sm p-6 flex flex-col justify-center">
//             <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-500 pb-2">
//                 当前回复
//             </h2>
//             {message ? (
//                 <div className="bg-gray-700 bg-opacity-50 p-6 rounded-2xl shadow-lg">
//                     <p className="text-2xl text-white leading-relaxed">
//                         {message.content.split(/(\s+)/).map((word, index) => (
//                             <span
//                                 key={index}
//                                 className="cursor-pointer hover:bg-yellow-400 hover:text-black rounded"
//                                 onClick={handleWordClick}
//                             >
//                                 {word}
//                             </span>
//                         ))}
//                     </p>
//                     <button
//                         onClick={() => handleTTS(message.content)}
//                         className="text-gray-300 hover:text-white mt-4 flex items-center gap-2"
//                     >
//                         <Volume2 size={20} /> 朗读
//                     </button>
//                 </div>
//             ) : (
//                 <div className="text-center text-gray-400">
//                     <MessageSquare size={48} className="mx-auto" />
//                     <p className="mt-4">正在等待角色的回复...</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// --- 主页面组件 ---
export default function ChatPage() {
    const [conversation] = useState<Conversation>(mockConversation);
    const [character] = useState<Character>(mockCharacter);
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [currentCharacterReply, setCurrentCharacterReply] =
        useState<Message | null>(null);
    const [inputValue, setInputValue] = useState("");

    // **【新】** 悬浮窗状态管理
    const [popupInfo, setPopupInfo] = useState<{
        word: string;
        position: { top: number; left: number };
    } | null>(null);
    // const closeTimer = useRef<NodeJS.Timeout | null>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const lastCharacterMessage = [...messages]
            .reverse()
            .find((m) => !m.isUser);
        setCurrentCharacterReply(lastCharacterMessage || null);
    }, [messages]);

    const handleSendMessage = (content: string) => {
        if (content.trim() === "") return;
        const userMessage: Message = {
            id: `msg-${Date.now()}`,
            conversationId: conversation.id,
            content: content,
            isUser: true,
            timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setTimeout(() => {
            const aiResponse = getMockAiResponse(content);
            setMessages((prev) => [...prev, aiResponse]);
        }, 1500);
    };

    // **【新】** 悬浮窗显示/隐藏逻辑
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

    return (
        <div className="h-screen w-screen bg-gray-900 font-sans text-white flex flex-col relative overflow-hidden">
            {/* 背景图 */}
            <div className="absolute inset-0 z-0">
                <img
                    src={conversation.backgroundUrl}
                    alt={conversation.topic}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* 主内容区: 三栏布局 */}
            <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-6 p-6">
                <div className="hidden md:block md:col-span-1 lg:col-span-1">
                    <MessageHistoryPanel
                        messages={messages}
                        onWordMouseEnter={handleWordMouseEnter}
                        onWordMouseLeave={handleMouseLeave}
                    />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-1 flex items-end justify-center">
                    <img
                        src={character.avatar}
                        alt={character.name}
                        className="max-h-full object-contain drop-shadow-2xl"
                    />
                </div>
                <div className="hidden md:block md:col-span-1 lg:col-span-1">
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
                    <div className="flex flex-wrap justify-center gap-2 mb-3">
                        {mockAiOptions.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleSendMessage(option)}
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
                            className="bg-blue-500 rounded-lg p-3 text-white hover:bg-blue-600 active:bg-blue-700 transition-colors disabled:bg-gray-500"
                            disabled={!inputValue.trim()}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* **【新】** 单词查询悬浮窗的渲染逻辑 */}
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

// --- 主页面组件 ---
// export default function ChatPage() {
//     const [conversation] = useState<Conversation>(mockConversation);
//     const [character] = useState<Character>(mockCharacter);
//     const [messages, setMessages] = useState<Message[]>(initialMessages);
//     const [currentCharacterReply, setCurrentCharacterReply] =
//         useState<Message | null>(null);
//     const [selectedWord, setSelectedWord] = useState<string | null>(null);
//     const [inputValue, setInputValue] = useState("");

//     useEffect(() => {
//         const lastCharacterMessage = [...messages]
//             .reverse()
//             .find((m) => !m.isUser);
//         setCurrentCharacterReply(lastCharacterMessage || null);
//     }, [messages]);

//     const handleSendMessage = (content: string) => {
//         if (content.trim() === "") return;

//         const userMessage: Message = {
//             id: `msg-${Date.now()}`,
//             conversationId: conversation.id,
//             content: content,
//             isUser: true,
//             timestamp: new Date().toISOString(),
//         };

//         // 立即更新UI，显示用户消息
//         setMessages((prev) => [...prev, userMessage]);
//         setInputValue("");

//         // 模拟AI思考和回复
//         setTimeout(() => {
//             const aiResponse = getMockAiResponse(content);
//             setMessages((prev) => [...prev, aiResponse]);
//         }, 1500);
//     };

//     return (
//         <div className="h-screen w-screen bg-gray-900 font-sans text-white flex flex-col relative overflow-hidden">
//             {/* 背景图 */}
//             <div className="absolute inset-0 z-0">
//                 <img
//                     src={conversation.backgroundUrl}
//                     alt={conversation.topic}
//                     className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-black/50"></div>
//             </div>

//             {/* 主内容区: 三栏布局 */}
//             <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-6 p-6">
//                 {/* 左栏: 对话历史 */}
//                 <div className="hidden md:block md:col-span-1 lg:col-span-1">
//                     <MessageHistoryPanel
//                         messages={messages}
//                         onWordClick={setSelectedWord}
//                     />
//                 </div>

//                 {/* 中间: 角色 */}
//                 <div className="col-span-1 md:col-span-2 lg:col-span-1 flex items-end justify-center">
//                     <img
//                         src={character.avatar}
//                         alt={character.name}
//                         className="max-h-full object-contain drop-shadow-2xl"
//                     />
//                 </div>

//                 {/* 右栏: 当前回复 */}
//                 <div className="hidden md:block md:col-span-1 lg:col-span-1">
//                     <CurrentReplyPanel
//                         message={currentCharacterReply}
//                         onWordClick={setSelectedWord}
//                     />
//                 </div>
//             </div>

//             {/* 底部输入区 */}
//             <div className="relative z-20 p-4 bg-black bg-opacity-30 backdrop-blur-md border-t border-gray-700">
//                 <div className="max-w-4xl mx-auto">
//                     <div className="flex flex-wrap justify-center gap-2 mb-3">
//                         {mockAiOptions.map((option, index) => (
//                             <button
//                                 key={index}
//                                 onClick={() => handleSendMessage(option)}
//                                 className="bg-gray-700 text-white text-sm px-4 py-2 rounded-full hover:bg-gray-600 transition-colors"
//                             >
//                                 {option}
//                             </button>
//                         ))}
//                     </div>
//                     <div className="flex items-center bg-gray-800 rounded-xl p-2">
//                         <input
//                             type="text"
//                             value={inputValue}
//                             onChange={(e) => setInputValue(e.target.value)}
//                             onKeyPress={(e) =>
//                                 e.key === "Enter" &&
//                                 handleSendMessage(inputValue)
//                             }
//                             placeholder={`与 ${character.name} 对话...`}
//                             className="flex-1 bg-transparent placeholder-gray-400 focus:outline-none px-3"
//                         />
//                         <button
//                             onClick={() => handleSendMessage(inputValue)}
//                             className="bg-blue-500 rounded-lg p-3 text-white hover:bg-blue-600 transition-colors disabled:bg-gray-500"
//                             disabled={!inputValue.trim()}
//                         >
//                             <Send size={20} />
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* 单词查询弹窗 */}
//             {selectedWord && (
//                 <WordDefinitionPopup
//                     word={selectedWord}
//                     onClose={() => setSelectedWord(null)}
//                 />
//             )}
//         </div>
//     );
// }
