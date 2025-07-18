// 用户类型
export interface User { // 前端用不到密码
  id: string;
  username: string;
}

// 角色类型
export interface Character {
  id: string;
  name: string;
  description: string;
  avatar?: string;   // 也许应该改成必选
  isDefault?: boolean;    // 也许应该改成必选
  createdBy?: string;   // 也许应该改成必选
  tags?: string[]; // ✅ 新增：可选的标签数组，每个标签是字符串
}

// 对话消息类型
export interface Message {
  id: string;
  conversationId: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

// 对话历史类型
export interface Conversation {
  id: string;
  characterId: string;
  userId: string;
  title: string;
  topic: string;     //  话题(场景)
  summary: string    // 摘要
  updatedAt: string; //最后进入时间
  messages?: Message[]; // 暂时选填， 也许有了更方便？ 所有消息保存在会话下，也更合理， 
  // 但是 数据库不能存数组。
  //TODO 如果背景要AI生成的话，这样可以每个对话都不同背景。
  backgroundUrl:string; 
}

// 单词卡类型
export interface WordCard {
  id: string;
  userId: string;
  word: string; 
  definition?: string;   // 这是什么？
  context?: string;
  conversationId: string; //TODO ， 到底要什么字段
  messageId?: string;   // 有这个应该就不需要conversationId了吧，或者多存一个方便使用。？
  createdAt: string;
}