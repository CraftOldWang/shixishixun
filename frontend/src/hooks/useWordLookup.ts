import { useState, useCallback } from 'react';
import { lookupWord, addWordCard } from '../services/wordService';

interface WordDefinition {
  word: string;
  definition: string;
  examples: string[];
}

interface UseWordLookupReturn {
  selectedWord: string | null;
  wordDefinition: WordDefinition | null;
  isLoading: boolean;
  error: string | null;
  lookupSelectedWord: (word: string) => Promise<void>;
  saveWordToWordbook: (conversationId: string, context: string) => Promise<void>;
  clearSelectedWord: () => void;
}

export const useWordLookup = (): UseWordLookupReturn => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordDefinition, setWordDefinition] = useState<WordDefinition | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 查询单词
  const lookupSelectedWord = useCallback(async (word: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedWord(word);
      
      const definition = await lookupWord(word);
      setWordDefinition(definition);
    } catch (err) {
      setError('查询单词失败');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 保存单词到单词本
  const saveWordToWordbook = useCallback(async (conversationId: string, context: string) => {
    if (!selectedWord || !wordDefinition) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      await addWordCard(
        selectedWord,
        wordDefinition.definition,
        context,
        conversationId
      );
      
      // 可以添加成功提示
    } catch (err) {
      setError('保存单词失败');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedWord, wordDefinition]);

  // 清除选中的单词
  const clearSelectedWord = useCallback(() => {
    setSelectedWord(null);
    setWordDefinition(null);
  }, []);

  return {
    selectedWord,
    wordDefinition,
    isLoading,
    error,
    lookupSelectedWord,
    saveWordToWordbook,
    clearSelectedWord
  };
};