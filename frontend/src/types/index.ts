// 用户类型
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

// 角色类型
export interface Character {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  isDefault?: boolean;   
  createdBy?: string;
  tags?: string[]; // ✅ 新增：可选的标签数组，每个标签是字符串
}

// 对话消息类型
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  characterId: string;
}

// 对话历史类型
export interface Conversation {
  id: string;
  title: string;
  characterId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

// 单词卡类型
export interface WordCard {
  id: string;
  word: string;
  definition: string;
  context: string;
  conversationId: string;
  createdAt: string;
}