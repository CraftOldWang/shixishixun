import apiClient from "./api";
import type { Wordcard } from "../types";

// 调用词典api 得到单词释义
//TODO 还没写。
export const fetchWordDefinition = async (
    word: string
): Promise<Partial<Wordcard>> => {
    console.log(`Fetching definition for: ${word}`);
    return new Promise((resolve) =>
        setTimeout(
            () =>
                resolve({
                    word: word,
                    pronunciation: "发音 [æpl]",
                    pos: "词性noun",
                    context: `这是一个模拟的'${word}'的释义。`,
                    //context : `这是包含'${word}'的上下文句子。`, // 上下文。。。
                }),
            500
        )
    );
};


