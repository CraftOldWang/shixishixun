import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type{ Character, Conversation } from "../types";
import {generateTopics, getPredefinedTopics,createConversation} from "../services/topicService";
import TopicCard, {Spinner} from "../components/TopicCard";
import { fetchSingleCharacterById } from "../services/characterService";

// TODO 前端最后一个逻辑
// 选完话题应当先把场景之类的发给AI，让其生成第一句话...
// 这样的话， 就可以把旧对话和新对话的处理逻辑合并了。



const TopicSelectionPage = () => {
    const { characterId } = useParams<{ characterId: string }>();
    const navigate = useNavigate();

    // 状态管理
    const [character, setCharacter] = useState<Character | null>(null);
    const [categories, setCategories] = useState<Record<string, string[]>>({});
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [aiTopics, setAiTopics] = useState<string[]>([]);
    const [prompt, setPrompt] = useState("");

    // 加载状态
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCreating, setIsCreating] = useState<string | null>(null); // 存储正在创建的话题

    // 初始化加载数据
    useEffect(() => {
        if (!characterId) { // 一般来说不可能是这个情况
            // 如果没有characterId，可能是URL错误，跳转回首页
            navigate("/");
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [charData, topicsData] = await Promise.all([
                    fetchSingleCharacterById(characterId),
                    getPredefinedTopics(),
                ]);
                setCharacter(charData);
                setCategories(topicsData);
                setSelectedCategory(Object.keys(topicsData)[0] || "");
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
                // 这里可以添加错误提示
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [characterId, navigate]);

    // 处理AI话题生成
    const handleGenerateTopics = async () => {
        setIsGenerating(true);
        setAiTopics([]); // 清空旧的AI话题
        try {
            const topics = await generateTopics(prompt);
            setAiTopics(topics);
        } catch (error) {
            console.error("Failed to generate topics:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    // 处理话题选择（最终步骤）
    const handleTopicSelect = async (topic: string) => {
        if (!characterId) return;
        setIsCreating(topic);
        try {
            const newConversation = await createConversation(
                characterId,
                topic
            );
            navigate(`/chat/${newConversation.id}`);
        } catch (error) {
            console.error("Failed to create conversation:", error);
            setIsCreating(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-white">
                Loading...
            </div>
        );
    }

    const displayedTopics = categories[selectedCategory] || [];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                {/* 页面头部 */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                    {/* TODO立绘放这里显示效果有点怪, 想加之后换个方式 */}
                    {/* {character?.avatar && (
                        <img
                            src={character.avatar}
                            alt={character.name}
                            className="w-24 h-24 rounded-full border-4 border-blue-400 dark:border-blue-600"
                        />
                    )} */}
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                            Start a Conversation
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            with {character?.name}
                        </p>
                    </div>
                </div>

                {/* AI 话题生成器 */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-semibold mb-4">
                        Let AI Suggest a Topic
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Optional: type a keyword (e.g., 'technology')"
                            className="flex-grow p-3 rounded-md bg-gray-100 dark:bg-gray-700 border border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <button
                            onClick={handleGenerateTopics}
                            disabled={isGenerating}
                            className="flex justify-center items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isGenerating ? <Spinner /> : "Generate"}
                        </button>
                    </div>
                    {aiTopics.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold mb-3">
                                AI Suggestions:
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {aiTopics.map((topic) => (
                                    <TopicCard
                                        key={topic}
                                        topic={topic}
                                        onClick={handleTopicSelect}
                                        isLoading={isCreating === topic}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 预设话题 */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">
                        Or, Pick a Predefined Topic
                    </h2>
                    {/* 分类标签 */}
                    <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                        {Object.keys(categories).map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                                    selectedCategory === category
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    {/* 话题卡片 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {displayedTopics.map((topic) => (
                            <TopicCard
                                key={topic}
                                topic={topic}
                                onClick={handleTopicSelect}
                                isLoading={isCreating === topic}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default TopicSelectionPage;