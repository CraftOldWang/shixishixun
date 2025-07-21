import apiClient from "./api";
import type { Wordcard } from "../types";

// 调用词典api 得到单词释义
//TODO 还没写。
export const fetchWordDefinition = async (
    word: string
): Promise<Partial<Wordcard>> => {
    console.log(`Fetching definition for: ${word}`);
    // return new Promise((resolve) =>
    //     setTimeout(
    //         () =>
    //             resolve({
    //                 word: word,
    //                 pronunciation: "发音 [æpl]",
    //                 pos: "词性noun",
    //                 context: `这是一个模拟的'${word}'的释义。`,
    //                 //context : `这是包含'${word}'的上下文句子。`, // 上下文。。。
    //             }),
    //         500
    //     )
    // );

    // 前端查了，存到后端？？？？？？？？？？？？？？？？？？？？不存吧
    // 收藏了才存到后端
    const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    if (!res.ok) throw new Error("Word not found");

    const data = await res.json();
    const entry = data[0]; // 只取第一个结果
    const meaning = entry.meanings?.[0];
    const def = meaning?.definitions?.[0];

    return {
        word: entry.word,
        pronunciation: entry.phonetic ?? entry.phonetics?.[0]?.text ?? "",
        pos: meaning?.partOfSpeech,
        context: def?.definition,
    };
};

export const checkIfFavorited = async (
    word: string,
    userId: string
): Promise<boolean> => {
    // 模拟
    // return false;

    // 真实
    const res = await apiClient.get(
        `/api/check?word=${encodeURIComponent(word)}&user_id=${userId}`
    );
    // 返回如下样子的json
    // {
    //     "favorited": true
    // }
    return res.data === true;
};

// 增加收藏
export const addFavorite = async (word: string, userId: string) => {
    /*
    await new Promise((resolve) => setTimeout(resolve, 500));
    return "";
    */
    // 真实
    const res = await apiClient.post( `/api/favorites/add?user_id=${userId}&word=${word}`);
    return res.data;
};

// 去除收藏
export const removeFavorite = async (word: string, userId: string) => {
    /*
    await new Promise((resolve) => setTimeout(resolve, 500));
    return "";
    */
    // 真实
    const res = await apiClient.post( `/api/favorites/remove?user_id=${userId}&word=${word}`);
    return res.data;
};

// 获取用户所有收藏单词
export const fetchFavorites = async (userId: string): Promise<Wordcard[]> => {
    // 模拟， 不与后端交互
    await new Promise((resolve) => setTimeout(resolve, 500));
    // return [
    //     {
    //         id: "word-1",
    //         userId: "user-123",
    //         word: "Apple",
    //         pronunciation: "[æpl]",
    //         pos: "noun",
    //         context: "An apple is a round fruit with red or green skin and a whitish inside.",
    //         conversationId: "conv-1",
    //         messageId: "msg-1",
    //         createdAt: "2023-10-20T08:30:00Z",
    //     },
    //     {
    //         id: "word-2",
    //         userId: "user-123",
    //         word: "Banana",
    //         pronunciation: "[bəˈnɑ:nə]",
    //         pos: "noun",
    //         context: "Bananas are long curved fruits with yellow skins.",
    //         conversationId: "conv-2",
    //         messageId: "msg-2",
    //         createdAt: "2023-10-21T09:00:00Z",
    //     },
    // ];

    //api
    const res = await apiClient.get(`/api/favorites/list?user_id=${userId}`);
    return res.data.map((item: any) => ({
        id: item.id,
        userId: item.user_id,
        word: item.word,
        pronunciation: item.pronunciation || undefined,
        pos: item.pos || undefined,
        context: item.context || undefined,
        conversationId: item.conversation_id,
        messageId: item.message_id || undefined,
        createdAt: item.created_at,
    }));
};
