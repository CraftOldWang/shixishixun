import api from './api';
import type { WordCard } from '../types';

// 查询单词释义
export const lookupWord = async (word: string): Promise<any> => {
  try {
    // 实际项目中应该调用真实的词典API
    // 这里模拟返回单词释义
    return {
      word,
      definition: `这是"${word}"的释义`,
      examples: [`这是一个包含"${word}"的例句。`]
    };
  } catch (error) {
    console.error('查询单词失败:', error);
    throw error;
  }
};

// 获取单词本列表
export const getWordCards = async (): Promise<WordCard[]> => {
  try {
    const response = await api.get('/learning/words');
    return response.data;
  } catch (error) {
    console.error('获取单词本失败:', error);
    throw error;
  }
};

// 添加单词到单词本
export const addWordCard = async (word: string, definition: string, context: string, conversationId: string): Promise<WordCard> => {
  try {
    const response = await api.post('/learning/words', {
      word,
      definition,
      context,
      conversationId
    });
    return response.data;
  } catch (error) {
    console.error('添加单词失败:', error);
    throw error;
  }
};

// 删除单词卡片
export const deleteWordCard = async (wordCardId: string): Promise<void> => {
  try {
    await api.delete(`/learning/words/${wordCardId}`);
  } catch (error) {
    console.error('删除单词失败:', error);
    throw error;
  }
};