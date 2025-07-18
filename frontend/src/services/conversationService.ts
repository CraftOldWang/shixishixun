import api from './api';
import type { Conversation, Message, Character } from '../types';

// 获取角色列表
export const getCharacters = async (): Promise<Character[]> => {
  try {
    const response = await api.get('/characters');
    return response.data;
  } catch (error) {
    console.error('获取角色列表失败:', error);
    throw error;
  }
};

// 获取对话历史
export const getConversations = async (): Promise<Conversation[]> => {
  try {
    const response = await api.get('/conversations');
    return response.data;
  } catch (error) {
    console.error('获取对话历史失败:', error);
    throw error;
  }
};

// 获取特定对话
export const getConversation = async (conversationId: string): Promise<Conversation> => {
  try {
    const response = await api.get(`/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('获取对话详情失败:', error);
    throw error;
  }
};

// 创建新对话
export const createConversation = async (characterId: string, title: string): Promise<Conversation> => {
  try {
    const response = await api.post('/conversations', { characterId, title });
    return response.data;
  } catch (error) {
    console.error('创建对话失败:', error);
    throw error;
  }
};

// 发送消息
export const sendMessage = async (conversationId: string, content: string): Promise<Message> => {
  try {
    const response = await api.post(`/conversations/${conversationId}/messages`, { content });
    return response.data;
  } catch (error) {
    console.error('发送消息失败:', error);
    throw error;
  }
};

// 模拟AI生成选项
export const generateOptions = async (conversationId: string): Promise<string[]> => {
  try {
    // 实际项目中应该调用后端API
    // 这里模拟返回三个选项
    return [
      '告诉我更多关于这个话题的信息',
      '我想学习相关的单词',
      '换个话题聊聊'
    ];
  } catch (error) {
    console.error('生成选项失败:', error);
    throw error;
  }
};