import { use } from "react";
import type { Message } from "../types";
import apiClient from "./api";
import { useAuth } from "../contexts/AuthContext";

export const fetchAiOptions = async (replyText: string, conversationId: string): Promise<string[]> => {
    // 为了模拟网络延迟，你可以添加一个 setTimeout
    // const mockAiOptions: string[] = [
    //     "关于它的位置有什么理论？",
    //     "哪些古代文献提到了它？",
    //     "为什么它会毁灭？",
    // ];
    // await new Promise((resolve) => setTimeout(resolve, 2000)); // 延迟500毫秒
    // return mockAiOptions;

    try {
        const res = await apiClient.post("/api/ai/options", {
            reply: replyText,
            conversationId
        });
        // 期待后端返回
        // {
        //     "options": ["xxx1", "xxx2", "xxx3"]
        // }
        return res.data.options;
    } catch (err) {
        console.error("获取AI推荐问题失败", err);
        return [];
    }
};

// 保存用户消息接口
export async function saveUserMessage(
    content: string,
    conversationId: string
): Promise<Message> {
    // 模拟数据， 真实的 api， 时间要从 后台取什么的。...
    // 为了模拟网络延迟，你可以添加一个 setTimeout
    // await new Promise((resolve) => setTimeout(resolve, 300)); // 延迟500毫秒

    // return {
    //     id: `msg-${Date.now()}`,
    //     conversationId: conversationId,
    //     content: content,
    //     isUser: true,
    //     timestamp: new Date().toISOString(),
    // };

    const res = await apiClient.post<Message>("/api/messages", {
        content,
        conversationId,
        isUser: true,
    });
    return res.data;
}

// 获取AI回复接口
export async function getAiResponse(
    userInput: string,
    conversationId: string
): Promise<Message> {
    // 为了模拟网络延迟，你可以添加一个 setTimeout
    // await new Promise((resolve) => setTimeout(resolve, 1000)); // 延迟500毫秒

    // return {
    //     id: `msg-${Date.now()}`,
    //     conversationId: conversationId,
    //     content: `这是AI的模拟回复, 对于${userInput}`,
    //     isUser: false,
    //     timestamp: new Date().toISOString(),
    // };

    const { user} = useAuth();
    const userId = user!.id;

    const res = await apiClient.post<Message>("/api/ai/response", {
        userInput,
        conversationId,
        userId
    });

    return res.data;
}

// 创建新对话， 然后让ai生成第一条回复。 再返回对话id
//TODO 这个有点难，再看看改不改
interface CreateConversationResponse {
    conversationId: string;
}
export const createConversation = async (
    characterId: string,
    topic: string
): Promise<string> => {
    console.log(
        `Creating conversation for character ${characterId} with topic: "${topic}"`
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return `conv_${Date.now()}`;

    const res = await apiClient.post<CreateConversationResponse>(
        "/api/conversation/create",
        {
            characterId,
            topic,
        }
    );
    return res.data.conversationId;
};
