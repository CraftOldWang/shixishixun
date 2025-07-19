import { useState, useEffect, type FC } from "react";
import { X } from "lucide-react";

// Import your custom types
import type { Character, Conversation } from "../types/index";

// Define the types for the component's props
interface HistoryDialogProps {
    character: Character;
    onClose: () => void;
    onStartNewConversation: (character: Character) => void;
}

// A mock API function, now fully typed
// 这个也要根据JWT 获取特定用户的吧
const fetchConversationsForCharacter = async (
    characterId: string
): Promise<Conversation[]> => {
    console.log(`Fetching history for character ${characterId}...`);
    // In a real app, you would make a type-safe API call here.
    // const response = await fetch(`/api/characters/${characterId}/conversations`);
    // const data: Conversation[] = await response.json();
    // return data;

    // Returning mock data for the example:
    //TODO 也许拿到之后需要排序。。。。
    return new Promise((resolve) =>
        setTimeout(() => {
            if (characterId === "char-1") {
                resolve([
                    {
                        id: "conv-1",
                        characterId: "char-1",
                        userId: "user-1",
                        title: "探讨宇宙的起源",
                        topic: "科学",
                        summary: "关于大爆炸理论的一些初步讨论...",
                        updatedAt: "2025-07-15",
                    },
                    {
                        id: "conv-2",
                        characterId: "char-1",
                        userId: "user-1",
                        title: "如何烤出完美的披萨",
                        topic: "烹饪",
                        summary: "从面团发酵到烤箱温度的精确控制...",
                        updatedAt: "2025-07-12",
                    },
                    {
                        id: "conv-3",
                        characterId: "char-1",
                        userId: "user-1",
                        title: "如何烤出完美的披萨",
                        topic: "烹饪",
                        summary: "从面团发酵到烤箱温度的精确控制...",
                        updatedAt: "2025-07-12",
                    },
                    {
                        id: "conv-4",
                        characterId: "char-1",
                        userId: "user-1",
                        title: "如何烤出完美的披萨",
                        topic: "烹饪",
                        summary: "从面团发酵到烤箱温度的精确控制...",
                        updatedAt: "2025-07-12",
                    },
                    {
                        id: "conv-5",
                        characterId: "char-1",
                        userId: "user-1",
                        title: "如何烤出完美的披萨",
                        topic: "烹饪",
                        summary: "从面团发酵到烤箱温度的精确控制...",
                        updatedAt: "2025-07-12",
                    },
                    {
                        id: "conv-6",
                        characterId: "char-1",
                        userId: "user-1",
                        title: "如何烤出完美的披萨",
                        topic: "烹饪",
                        summary: "从面团发酵到烤箱温度的精确控制...",
                        updatedAt: "2025-07-12",
                    },
                ]);
            } else {
                resolve([]);
            }
        }, 1000)
    );
};

// Use the FC (Functional Component) type from React for props typing
const HistoryDialog: FC<HistoryDialogProps> = ({
    character,
    onClose,
    onStartNewConversation,
}) => {
    // Type the state variables
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // //TODO 会话，应该是根据角色和用户，通过 event handler获取 而不是用useEffect
    // useEffect(() => {
    //     setConversations([
    //         {
    //             id: "conv-1",
    //             characterId: "char-3",
    //             userId: currentUser.id,
    //             title: "本周训练计划",
    //             topic: "力量训练",
    //             summary: "讨论了周三的腿部训练日强度和注意事项...",
    //             updatedAt: "2023-10-27T10:30:00Z",
    //         },
    //     ]);
    // }, []);

    useEffect(() => {
        // No need to check for character here, as the parent component ensures it exists before rendering
        const loadConversations = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedConversations =
                    await fetchConversationsForCharacter(character.id);
                setConversations(fetchedConversations);
            } catch (err) {
                setError("无法加载对话记录。");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadConversations();
    }, [character.id]); // Re-run the effect only when the character ID changes

    const renderContent = () => {
        if (isLoading) {
            // 如果正在加载
            return (
                <div className="text-center text-gray-500 py-8">加载中...</div>
            );
        }
        if (error) {
            // 如果有错误
            return <div className="text-center text-red-500 py-8">{error}</div>;
        }
        if (conversations.length === 0) {
            // 如果没有历史记录
            return (
                <div className="text-center text-gray-500 py-8">
                    暂无历史记录
                </div>
            );
        }
        // `conv` is now correctly typed as Conversation, so you get full autocomplete
        return conversations.map((conv) => (
            <div
                key={conv.id}
                className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
            >
                <div className="font-semibold text-gray-800">{conv.title}</div>
                {/* Accessing properties from your Conversation type */}
                <p className="text-sm text-gray-600 mt-1">话题：{conv.topic}</p>
                <p className="text-sm text-gray-500 mt-1 truncate">
                    摘要：{conv.summary}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                    最后更新：{new Date(conv.updatedAt).toLocaleString()}
                </p>
            </div>
        ));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
                <div className="p-6 flex justify-between items-center border-b">
                    <h3 className="text-xl font-bold text-gray-800">
                        {character.name} 的历史对话
                    </h3>
                    <button
                        onClick={onClose}
                        type="button"
                        className="text-gray-400 hover:text-gray-800"
                        aria-label="关闭"
                    >
                        <X className="w-7 h-7" />
                    </button>
                </div>
                <div className="p-6">
                    <button
                        onClick={() => onStartNewConversation(character)}
                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        开启新对话
                    </button>
                    <div className="my-6 border-t"></div>
                    <h4 className="font-semibold text-gray-700 mb-3">
                        对话记录
                    </h4>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryDialog;
