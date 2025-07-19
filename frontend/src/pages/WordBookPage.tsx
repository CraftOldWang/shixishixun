import { useState, useEffect } from "react";
import WordCard from "../components/WordCard"; // Import the WordCard component
import Navbar from "../components/WordCardNavbar";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const WordBookPage = () => {
    const [currentUser, setCurrentUser] = useState({
        id: "user-123",
        username: "Alice",
    });

    const [wordCards, setWordCards] = useState<WordCard[]>([]);

    const navigate = useNavigate();

    // Mock Data: Replace this with API calls to get user-specific word data
    useEffect(() => {
        setWordCards([
            {
                id: "word-1",
                userId: "user-123",
                word: "Apple",
                pronunciation: "[æpl]",
                pos: "noun",
                context: "苹果",
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
                context: "香蕉",
                conversationId: "conv-2",
                messageId: "msg-2",
                createdAt: "2023-10-21T09:00:00Z",
            },
            // Add more word cards here
        ]);
    }, []);

    const handleLogout = () => {
        navigate("/login");
    };

    const handleBackToHome = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Navbar */}
            <Navbar currentUser={currentUser} onLogout={handleLogout} />

            {/* Wordbook Content */}
            <main className="flex-grow container mx-auto p-6 md:p-8">
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        单词收藏夹
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {wordCards.map((word) => (
                            <WordCard key={word.id} wordCard={word} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default WordBookPage;
