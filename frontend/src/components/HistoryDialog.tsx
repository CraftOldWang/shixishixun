import { useState, useEffect, type FC } from "react";
import { X } from "lucide-react";

// Import your custom types
import type { Character, Conversation } from "../types/index";
import { fetchConversationsByCharacter } from "../services/conversationService";
import { useNavigate } from "react-router-dom";
// Define the types for the component's props
interface HistoryDialogProps {
    character: Character;
    onClose: () => void;
}

// Use the FC (Functional Component) type from React for props typing
const HistoryDialog: FC<HistoryDialogProps> = ({ character, onClose }) => {
    // Type the state variables
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    useEffect(() => {
        // No need to check for character here, as the parent component ensures it exists before rendering
        const loadConversations = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedConversations =
                    await fetchConversationsByCharacter(character.id);
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

    const handleStartNewConversation = () => {
        // 跳转挑选话题的逻辑放到这里了。
        navigate(`/character/${character!.id}/new-topic`);
    };

    // 得有conversations 才能点到这个按钮。。。。
    const handleContinueOldConversation = (conv: Conversation): void => {
        navigate(`/chat/${conv.id}`);
    };

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
        //TODO  这里用的 历史会话，是否要根据时间来排序
        return conversations.map((conv) => (
            <div
                key={conv.id}
                onClick={() => {
                    handleContinueOldConversation(conv);
                }}
                className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
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
                        onClick={handleStartNewConversation}
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
