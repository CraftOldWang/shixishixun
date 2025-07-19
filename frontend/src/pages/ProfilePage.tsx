import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { FC } from 'react';
import type { Character, Conversation, User } from "../types";

// 角色卡片组件（已提供）
const CharacterCard: FC<{ character: Character; onClick: () => void }> = ({ 
  character, 
  onClick 
}) => (
  <div
    onClick={onClick}
    className="group bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1"
  >
    <img
      className="w-full h-40 object-cover"
      src={character.avatar || 'https://via.placeholder.com/400x260/EFEFEF/AAAAAA?text=No+Image'}
      alt={character.name}
    />
    <div className="p-4 flex flex-col h-48">
      <h3 className="font-bold text-lg text-gray-800">{character.name}</h3>
      <p className="text-sm text-gray-500 mt-1 flex-grow">{character.description}</p>
      {character.tags && character.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {character.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"conversations" | "characters">("conversations");
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  
  // 模拟用户数据
  useEffect(() => {
    setUser({
      id: "user123",
      username: "二次元学习者",
    });
  }, []);
  
  // 模拟获取会话历史
  useEffect(() => {
    if (activeTab === "conversations") {
      // 模拟API调用
      const mockConversations: Conversation[] = [
        {
          id: "conv1",
          characterId: "char1",
          userId: "user123",
          title: "初次见面",
          topic: "自我介绍",
          summary: "学习基本问候语和自我介绍",
          updatedAt: "2023-10-15T14:30:00Z",
        },
        {
          id: "conv2",
          characterId: "char2",
          userId: "user123",
          title: "动漫词汇学习",
          topic: "常见动漫术语",
          summary: "学习了10个常见动漫词汇及其用法",
          updatedAt: "2023-10-12T09:15:00Z",
        },
        {
          id: "conv3",
          characterId: "char3",
          userId: "user123",
          title: "语法练习",
          topic: "过去时态",
          summary: "练习了过去时态的正确用法",
          updatedAt: "2023-10-10T16:45:00Z",
        },
        {
          id: "conv4",
          characterId: "char4",
          userId: "user123",
          title: "日常对话练习",
          topic: "餐厅点餐",
          summary: "模拟餐厅点餐场景的对话练习",
          updatedAt: "2023-10-05T11:20:00Z",
        },
      ];
      setConversations(mockConversations);
    }
  }, [activeTab]);
  
  // 模拟获取角色列表
  useEffect(() => {
    if (activeTab === "characters") {
      // 模拟API调用
      const mockCharacters: Character[] = [
        {
          id: "1",
          name: "火影老师",
          description: "用火影忍者教英语的AI角色",
          avatar: "https://randomuser.me/api/portraits/men/1.jpg",
          isDefault: false,
          createdBy: "user123",
          tags: ["火影", "忍者", "热血"],
        },
        {
          id: "2",
          name: "海贼王导师",
          description: "航海主题英语学习角色",
          avatar: "https://randomuser.me/api/portraits/women/2.jpg",
          isDefault: false,
          createdBy: "user123",
          tags: ["海贼王", "冒险", "航海"],
        },
        {
          id: "3",
          name: "魔法少女助教",
          description: "魔法题材英语学习角色",
          avatar: "https://randomuser.me/api/portraits/women/3.jpg",
          isDefault: false,
          createdBy: "user123",
          tags: ["魔法", "奇幻", "少女"],
        },
        {
          id: "4",
          name: "机甲战士老师",
          description: "机甲战斗主题英语学习角色",
          avatar: "https://randomuser.me/api/portraits/men/4.jpg",
          isDefault: false,
          createdBy: "user123",
          tags: ["机甲", "科幻", "战斗"],
        },
        {
          id: "5",
          name: "侦探推理助手",
          description: "侦探主题英语学习角色",
          avatar: "https://randomuser.me/api/portraits/men/5.jpg",
          isDefault: false,
          createdBy: "user123",
          tags: ["推理", "侦探", "悬疑"],
        },
      ];
      setCharacters(mockCharacters);
    }
  }, [activeTab]);
  
  // 处理角色点击
  const handleCharacterClick = (characterId: string) => {
    navigate(`/character/${characterId}`);
  };
  
  // 处理会话点击
  const handleConversationClick = (conversationId: string) => {
    navigate(`/conversation/${conversationId}`);
  };
  
  // 处理退出登录
  const handleLogout = () => {
    // 模拟退出登录逻辑
    localStorage.removeItem("token");
    navigate("/login");
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* 左侧边栏 */}
      <div className="w-1/5 bg-white shadow-lg flex flex-col">
        <div className="p-6 flex flex-col items-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mb-4 flex items-center justify-center text-3xl text-purple-600 font-bold">
            {user?.username?.charAt(0)}
          </div>
          <h2 className="text-xl font-bold text-gray-800">{user?.username}</h2>
          <div className="text-sm text-gray-500 mt-1">英语学习爱好者</div>
        </div>
        
        <div className="flex flex-col flex-grow px-4 py-6">
          <button
            className={`flex items-center px-4 py-3 rounded-lg mb-2 transition-all ${
              activeTab === "conversations"
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("conversations")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            会话历史
          </button>
          
          <button
            className={`flex items-center px-4 py-3 rounded-lg mb-2 transition-all ${
              activeTab === "characters"
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("characters")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            已创建角色
          </button>
        </div>
        
        <div className="p-4">
          <button
            className="w-full flex items-center justify-center px-4 py-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            onClick={handleLogout}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            退出登录
          </button>
        </div>
      </div>
      
      {/* 右侧内容区域 */}
      <div className="w-4/5 p-8 overflow-auto">
        {activeTab === "conversations" ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">会话历史</h1>
              <div className="text-sm text-gray-500">
                共 {conversations.length} 条记录
              </div>
            </div>
            
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-4"></div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">暂无会话记录</h3>
                <p className="text-gray-500 mb-6">开始新的对话后，历史记录会出现在这里</p>
                <button 
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  onClick={() => navigate("/")}
                >
                  开始新对话
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {conversations.map((conv) => (
                  <div 
                    key={conv.id}
                    className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleConversationClick(conv.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{conv.title}</h3>
                        <div className="flex items-center text-gray-500 mb-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                          </svg>
                          <span>话题: {conv.topic}</span>
                        </div>
                        <p className="text-gray-600 mt-3">{conv.summary}</p>
                      </div>
                      <div className="text-sm text-gray-500 whitespace-nowrap">
                        最后活跃: {formatDate(conv.updatedAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">已创建角色</h1>
              
            </div>
            
            {characters.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-4"></div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">您尚未创建任何角色</h3>
                <p className="text-gray-500 mb-6">创建自定义角色来个性化您的学习体验</p>
                <button 
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  onClick={() => navigate("/character/create")}
                >
                  创建角色
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.map((char) => (
                  <CharacterCard
                    key={char.id}
                    character={char}
                    onClick={() => handleCharacterClick(char.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="absolute bottom-8 right-8">
          <button 
            className="bg-indigo-500 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white shadow-lg"
            onClick={() => navigate("/")}
          >
            返回首页
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;