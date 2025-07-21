// src/components/CreateCharacterDialog.tsx
import { useState, type FC } from "react";
import { X } from "lucide-react";
import { createCharacter } from "../services/characterService";
import { useAuth } from "../contexts/AuthContext";
import type { Character } from "../types";

interface CreateCharacterDialogProps {
  onClose: () => void;
  onCreate: (character: Character) => void;
}

const CreateCharacterDialog: FC<CreateCharacterDialogProps> = ({
  onClose,
  onCreate,
}) => {
  const { user:currentUser } = useAuth();
  const [characterData, setCharacterData] = useState({
    name: "",
    description: "",
    setting: "",
    avatar: "",
    tags: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCharacterData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证必填字段
    if (!characterData.name.trim()) {
      setError("角色名称不能为空");
      return;
    }
    
    if (!characterData.description.trim()) {
      setError("角色描述不能为空");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 准备请求数据
      const requestData = {
        name: characterData.name,
        description: characterData.description,
        avatar: characterData.avatar,
        tags: characterData.tags ? 
              characterData.tags.split(',').map(tag => tag.trim()) : 
              [],
      };
      
      // 调用API创建角色
      const newCharacter = await createCharacter(currentUser!.id,requestData);
      
      // 调用父组件的回调函数
      onCreate(newCharacter);
      setIsLoading(false);
      onClose();
    } catch (err) {
      console.error("创建角色错误:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
        <div className="p-6 flex justify-between items-center border-b">
          <h3 className="text-xl font-bold text-gray-800">
            创建自定义角色
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
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* 角色名称 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                角色名称 *
              </label>
              <input
                type="text"
                name="name"
                value={characterData.name}
                onChange={handleInputChange}
                placeholder="为您的角色起一个名字"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* 角色描述 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                角色描述
              </label>
              <textarea
                name="description"
                value={characterData.description}
                onChange={handleInputChange}
                placeholder="简短描述角色的特点"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 头像URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                头像URL (可选)
              </label>
              <input
                type="text"
                name="avatar"
                value={characterData.avatar}
                onChange={handleInputChange}
                placeholder="输入角色图片链接"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {characterData.avatar && (
                <div className="mt-2 flex items-center">
                  <span className="text-sm text-gray-500 mr-2">预览:</span>
                  <img 
                    src={characterData.avatar} 
                    alt="头像预览" 
                    className="w-12 h-12 rounded-full object-cover border"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x260/EFEFEF/AAAAAA?text=Image+Error';
                    }}
                  />
                </div>
              )}
            </div>
            
            {/* 标签 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                标签 (逗号分隔)
              </label>
              <input
                type="text"
                name="tags"
                value={characterData.tags}
                onChange={handleInputChange}
                placeholder="例如: 动漫,英语,幽默"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                使用逗号分隔多个标签，帮助其他人发现您的角色
              </p>
            </div>
            
            {/* 错误信息 */}
            {error && (
              <div className="text-red-500 text-sm py-2">{error}</div>
            )}
          </div>
          
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={isLoading}
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  创建中...
                </>
              ) : (
                "创建角色"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCharacterDialog;