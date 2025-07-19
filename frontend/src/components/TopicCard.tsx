// 话题卡片子组件 (可以放在同文件或单独文件)
interface TopicCardProps {
    topic: string;
    onClick: (topic: string) => void;
    isLoading: boolean;
}

// 一个小的加载图标组件
export const Spinner = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

const TopicCard = ({ topic, onClick, isLoading }: TopicCardProps) => {
    return (
        <button
            onClick={() => onClick(topic)}
            disabled={isLoading}
            className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-left hover:bg-blue-100 dark:hover:bg-gray-600 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer disabled:cursor-wait disabled:opacity-70"
        >
            <div className="flex items-center justify-between">
                <p className="font-medium text-gray-800 dark:text-gray-200">
                    {topic}
                </p>
                {isLoading && <Spinner />}
            </div>
        </button>
    );
};

export default TopicCard;


