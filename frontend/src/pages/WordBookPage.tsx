import { useState, useEffect } from "react";
import WordCard from "../components/WordCard";
import Navbar from "../components/WordCardNavbar";
import { useNavigate } from "react-router-dom";
import { X, ArrowLeft, Search, Plus } from "lucide-react";
import type { Wordcard } from "../types";
import { useAuth } from "../contexts/AuthContext";

const WordBookPage = () => {

    const { user: currentUser } = useAuth();
    console.log(currentUser);

    const [wordCards, setWordCards] = useState<Wordcard[]>([]);
    const [filteredCards, setFilteredCards] = useState<Wordcard[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [wordToDelete, setWordToDelete] = useState<string | null>(null);
    
    const navigate = useNavigate();

    // Mock Data
    useEffect(() => {
        const mockData: Wordcard[] = [
            {
                id: "word-1",
                userId: "user-123",
                word: "Apple",
                pronunciation: "[æpl]",
                pos: "noun",
                context: "An apple is a round fruit with red or green skin and a whitish inside.",
                conversationId: "conv-1",
                messageId: "msg-1",
                createdAt: "2023-10-20T08:30:00Z",
            },
            {
                id: "word-2",
                userId: "user-123",
                word: "Banana",
                pronunciation: "[bəˈnɑ:nə]",
                pos: "noun",
                context: "Bananas are long curved fruits with yellow skins.",
                conversationId: "conv-2",
                messageId: "msg-2",
                createdAt: "2023-10-21T09:00:00Z",
            },
            {
                id: "word-3",
                userId: "user-123",
                word: "Serendipity",
                pronunciation: "[ˌser.ənˈdɪp.ə.ti]",
                pos: "noun",
                context: "Finding my favorite book at the flea market was pure serendipity.",
                conversationId: "conv-3",
                messageId: "msg-3",
                createdAt: "2023-10-22T10:15:00Z",
            },
            {
                id: "word-4",
                userId: "user-123",
                word: "Ubiquitous",
                pronunciation: "[juːˈbɪk.wɪ.təs]",
                pos: "adjective",
                context: "Mobile phones are now ubiquitous in modern society.",
                conversationId: "conv-4",
                messageId: "msg-4",
                createdAt: "2023-10-23T11:20:00Z",
            },
            {
                id: "word-5",
                userId: "user-123",
                word: "Eloquent",
                pronunciation: "[ˈel.ə.kwənt]",
                pos: "adjective",
                context: "She gave an eloquent speech that moved the entire audience.",
                conversationId: "conv-5",
                messageId: "msg-5",
                createdAt: "2023-10-24T12:25:00Z",
            },
            {
                id: "word-6",
                userId: "user-123",
                word: "Pragmatic",
                pronunciation: "[præɡˈmæt.ɪk]",
                pos: "adjective",
                context: "We need a pragmatic approach to solve this problem.",
                conversationId: "conv-6",
                messageId: "msg-6",
                createdAt: "2023-10-25T13:30:00Z",
            },
        ];
        
        setWordCards(mockData);
        setFilteredCards(mockData);
    }, []);

    // 处理单词删除
    const handleRemoveWord = (id: string) => {
        setWordToDelete(id);
        setShowDeleteConfirmation(true);
    };

    // 确认删除
    const confirmDelete = () => {
        if (wordToDelete) {
            setWordCards(prev => prev.filter(card => card.id !== wordToDelete));
            setShowDeleteConfirmation(false);
            setWordToDelete(null);
        }
    };

    // 取消删除
    const cancelDelete = () => {
        setShowDeleteConfirmation(false);
        setWordToDelete(null);
    };

    const handleLogout = () => {
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col">
            {/* Navbar */}
            <Navbar currentUser={currentUser!} onLogout={handleLogout} />
            
            {/* 删除确认弹窗 */}
            {showDeleteConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">确认删除</h3>
                        <p className="text-gray-600 mb-6">
                            您确定要从收藏夹中删除这个单词吗？此操作不可撤销。
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                取消
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                确认删除
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Wordbook Content */}
            <main className="flex-grow container mx-auto p-4 md:p-6">
                
                {/* 单词卡片区域 */}
                <section>
                    {filteredCards.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                            <div className="mx-auto bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mb-6">
                                <Search className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-700 mb-2">
                                {searchTerm ? "没有找到匹配的单词" : "您的收藏夹是空的"}
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {searchTerm 
                                    ? "请尝试不同的搜索词或分类筛选" 
                                    : "开始学习并收藏您遇到的单词吧！"}
                            </p>
                            <button 
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCategory("all");
                                }}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {searchTerm ? "重置搜索" : "开始学习"}
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredCards.map((word) => (
                                <WordCard 
                                    key={word.id} 
                                    wordCard={word} 
                                    onRemove={handleRemoveWord}
                                />
                            ))}
                        </div>
                    )}
                </section>

            </main>

        </div>
    );
};

export default WordBookPage;
