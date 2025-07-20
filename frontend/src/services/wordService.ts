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

export const checkIfFavorited = async (word: string): Promise<boolean> => {

    // 模拟
    return false;

    // 真实
    const res = await apiClient.get(
        `/api/favorites/check?word=${encodeURIComponent(word)}`
    );
    // 返回如下样子的json
    // {
    //     "favorited": true
    // }
    return res.data.favorited === true;
};

// 增加收藏
export const addFavorite = async (word: string) => {
    // 模拟， 不与后端交互
    await new Promise((resolve) => setTimeout(resolve, 500));
    return "";
    // 真实
    const res = await apiClient.post("/api/favorites/add", { word });
    return res.data;
};

// 去除收藏
export const removeFavorite = async (word: string) => {
    // 模拟， 不与后端交互
    await new Promise((resolve) => setTimeout(resolve, 500));
    return "";

    // 真实
    const res = await apiClient.post("/api/favorites/remove", { word });
    return res.data;
};
