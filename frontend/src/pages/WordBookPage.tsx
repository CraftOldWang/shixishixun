import { useState, useEffect } from "react";
import WordCard from "../components/WordCard";
import Navbar from "../components/WordCardNavbar";
import { useNavigate } from "react-router-dom";
import { X, ArrowLeft, Search, Plus } from "lucide-react";
import type { Wordcard } from "../types";
import { useAuth } from "../contexts/AuthContext";
import {fetchFavorites, removeFavorite,} from "../services/wordService"; // 导入 API 函数

const WordBookPage = () => {

    const { user: currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const [wordCards, setWordCards] = useState<Wordcard[]>([]);
    const [filteredCards, setFilteredCards] = useState<Wordcard[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [wordToDelete, setWordToDelete] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 获取用户收藏单词
    const loadFavorites = async () => {
        if (!currentUser) return;
        
        setLoading(true);
        setError(null);
        
        try {
        const favorites = await fetchFavorites(currentUser.id);
        setWordCards(favorites);
        setFilteredCards(favorites);
        } catch (err) {
        console.error("获取收藏单词失败:", err);
        setError("获取收藏单词失败，请稍后重试");
        } finally {
        setLoading(false);
        }
    };

    // 初始化加载收藏单词
    useEffect(() => {
        if (currentUser) {
        loadFavorites();
        }
    }, [currentUser]);

    // 处理单词删除
    const handleRemoveWord = async (id: string) => {
        const wordCard = wordCards.find(card => card.id === id);
        if (!wordCard) return;

        setWordToDelete(id);
        setShowDeleteConfirmation(true);
    };

    // 确认删除
    const confirmDelete = async () => {
        if (!wordToDelete || !currentUser) return;

        try {
        const wordCard = wordCards.find(card => card.id === wordToDelete);
        if (!wordCard) return;

        // 调用 API 删除收藏
        await removeFavorite(wordCard.word);
        
        // 本地更新状态
        setWordCards(prev => prev.filter(card => card.id !== wordToDelete));
        setFilteredCards(prev => prev.filter(card => card.id !== wordToDelete));
        
        setShowDeleteConfirmation(false);
        setWordToDelete(null);
        } catch (err) {
        console.error("删除收藏失败:", err);
        setError("删除收藏失败，请稍后重试");
        setShowDeleteConfirmation(false);
        }
    };

    // 取消删除
    const cancelDelete = () => {
        setShowDeleteConfirmation(false);
        setWordToDelete(null);
    };

    const handleLogout = () => {
        logout(); //
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
