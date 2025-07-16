import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import type{ Conversation, Message, Character } from '../types';
import { getConversation, sendMessage, generateOptions, createConversation, getCharacters } from '../services/conversationService';

interface UseConversationReturn {
  conversation: Conversation | null;
  character: Character | null;
  loading: boolean;
  error: string | null;
  messages: Message[];
  options: string[];
  sendUserMessage: (content: string) => Promise<void>;
  selectOption: (option: string) => Promise<void>;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
}

export const useConversation = (): UseConversationReturn => {
  const { characterId } = useParams<{ characterId?: string }>();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // 初始化对话
  useEffect(() => {
    const initConversation = async () => {
      if (!characterId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // 获取角色信息
        const characters = await getCharacters();
        const selectedCharacter = characters.find(c => c.id === characterId);
        
        if (!selectedCharacter) {
          setError('未找到指定角色');
          setLoading(false);
          return;
        }
        
        setCharacter(selectedCharacter);
        
        // 创建新对话或获取现有对话
        // 这里简化处理，每次都创建新对话
        const newConversation = await createConversation(
          characterId,
          `与${selectedCharacter.name}的对话`
        );
        
        setConversation(newConversation);
        setMessages(newConversation.messages || []);
        
        // 生成初始选项
        const initialOptions = await generateOptions(newConversation.id);
        setOptions(initialOptions);
      } catch (err) {
        setError('初始化对话失败');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    initConversation();
  }, [characterId]);

  // 发送用户消息
  const sendUserMessage = useCallback(async (content: string) => {
    if (!conversation) return;
    
    try {
      setLoading(true);
      
      // 添加用户消息到本地状态
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        isUser: true,
        timestamp: new Date().toISOString(),
        characterId: character?.id || ''
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // 发送消息到服务器并获取AI回复
      const aiResponse = await sendMessage(conversation.id, content);
      
      // 添加AI回复到本地状态
      setMessages(prev => [...prev, aiResponse]);
      
      // 更新选项
      const newOptions = await generateOptions(conversation.id);
      setOptions(newOptions);
    } catch (err) {
      setError('发送消息失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [conversation, character]);

  // 选择预设选项
  const selectOption = useCallback(async (option: string) => {
    await sendUserMessage(option);
  }, [sendUserMessage]);

  return {
    conversation,
    character,
    loading,
    error,
    messages,
    options,
    sendUserMessage,
    selectOption,
    showHistory,
    setShowHistory
  };
};