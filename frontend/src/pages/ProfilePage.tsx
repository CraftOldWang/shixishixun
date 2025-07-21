import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { FC } from 'react';
import type { Character, Conversation, User } from "../types";
import CharacterCard from "../components/CharacterCard";
import { fetchConversationsByUser } from "../services/conversationService";
import { fetchCustomCharacters } from "../services/characterService";
import { useAuth } from "../contexts/AuthContext";


const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"conversations" | "characters">("conversations");
  const { user, logout } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
 // 获取用户会话历史
  const loadConversations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchConversationsByUser(user.id);
      setConversations(data);
    } catch (err) {
      console.error("获取会话历史失败:", err);
      setError("加载会话历史失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };
  
  // 获取用户创建的角色
  const loadCharacters = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchCustomCharacters(user.id);
      setCharacters(data);
    } catch (err) {
      console.error("获取角色列表失败:", err);
      setError("加载角色列表失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  // 根据激活的标签加载数据
  useEffect(() => {
    if (activeTab === "conversations") {
      loadConversations();
    } else {
      loadCharacters();
    }
  }, [activeTab, user]);
  
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
          <h2 className="text-xl font-bold text-gray-800">{user?.id}</h2>
          <div className="text-sm text-gray-500 mt-1">{user?.username}</div>
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
                
              </div>
            ) : (
              <div className="flex flex-wrap gap-6">
                {characters.map((char) => (
                  <CharacterCard
                    key={char.id}
                    character={char}
                    onClick={() => void(null)}
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