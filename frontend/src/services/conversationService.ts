import apiClient from "./api";
import type { Conversation, Message, Character } from "../types";
import { useAuth } from "../contexts/AuthContext";



// 获取特定对话, 不带message(为了复用，带message就有点大了)
export const getConversationWithoutMessages = async (
    conversationId: string
): Promise<Conversation> => {
    //1.TODO 假数据
    // const mockConversation: Conversation = {
    //     id: "conv-1",
    //     characterId: "char-1",
    //     userId: "user-1",
    //     title: "探寻失落的亚特兰蒂斯",
    //     topic: "古代历史",
    //     summary: "我们讨论了关于亚特兰蒂斯沉没的几种理论...",
    //     updatedAt: "2024-07-18T10:30:00Z",
    //     backgroundUrl: "https://w.wallhaven.cc/full/po/wallhaven-po2vg3.jpg",
    // };
    // // 为了模拟网络延迟，你可以添加一个 setTimeout
    // await new Promise((resolve) => setTimeout(resolve, 500)); // 延迟500毫秒
    // return mockConversation;

    //2. 真实api调用
    try {
        const response = await apiClient.get<Conversation>(`/api/conversations/${conversationId}`);
        return response.data;
    } catch (error) {
        console.error("获取对话详情失败:", error);
        throw error;
    }
};

// 获取messages 数组
export const getMessagesByConversationId = async (
    conversationId: string
): Promise<Message[]> => {
    //1. 测试数据
    // const initialMessages: Message[] = [
    //     {
    //         id: "msg-1-1",
    //         conversationId: "conv-1",
    //         content:
    //             "Hello, traveler. Welcome to the Royal Library. What ancient secrets are you interested in?",
    //         isUser: false,
    //         timestamp: "2024-07-18T10:30:00Z",
    //     },
    //     {
    //         id: "msg-1-2",
    //         conversationId: "conv-1",
    //         content:
    //             "I have been studying the legends about Atlantis. Are there any clues?",
    //         isUser: true,
    //         timestamp: "2024-07-18T10:31:00Z",
    //     },
    //     {
    //         id: "msg-1-3",
    //         conversationId: "conv-1",
    //         content:
    //             "A wise choice. Many people think it is just a myth, but some ancient texts hint at its real existence.",
    //         isUser: false,
    //         timestamp: "2024-07-18T10:32:00Z",
    //     },
    // ];
    // // 为了模拟网络延迟，你可以添加一个 setTimeout
    // await new Promise((resolve) => setTimeout(resolve, 500)); // 延迟500毫秒
    // // 直接返回硬编码的数组
    // return initialMessages;

    //2. 调用api
    try {
        const response = await apiClient.get(
            `/api/conversations/${conversationId}/messages`
        );
        return response.data;
    } catch (error) {
        console.error("获取对话详情失败:", error);
        throw error;
    }
};


// 获取某角色的所有历史会话 , 按时间降序排序(新的在数组的前面)。
// 同样不带messages
export async function fetchConversationsByCharacter(
    characterId: string,
    userId:string
): Promise<Conversation[]> {
    // 1. 假数据， 调api时记得注释掉。
    // console.log(`Fetching history for character ${characterId}...`);
    // return new Promise((resolve) =>
    //     setTimeout(() => {
    //         if (characterId === "char-1") {
    //             resolve([
    //                 {
    //                     id: "conv-1",
    //                     characterId: "char-1",
    //                     userId: "user-1",
    //                     title: "探讨宇宙的起源",
    //                     topic: "科学",
    //                     summary: "关于大爆炸理论的一些初步讨论...",
    //                     updatedAt: "2025-07-15",
    //                 },
    //                 {
    //                     id: "conv-2",
    //                     characterId: "char-1",
    //                     userId: "user-1",
    //                     title: "如何烤出完美的披萨",
    //                     topic: "烹饪",
    //                     summary: "从面团发酵到烤箱温度的精确控制...",
    //                     updatedAt: "2025-07-12",
    //                 },
    //             ]);
    //         } else {
    //             resolve([]);
    //         }
    //     }, 1000)
    // );

    //2. 调用api
    const response = await apiClient.get(`/api/users/${userId}/characters/${characterId}/conversations`);
    return response.data
        .map(
            (item: any): Conversation => ({
                id: item.id,
                title: item.title,
                topic: item.scene, // scene -> topic 映射
                summary: item.summary,
                updatedAt: item.timestamp, // timestamp -> updatedAt 映射
                characterId: characterId, // 从参数中补全
                userId: "", // TODO后端未提供，如需可在后端返回或另外处理
            })
        )
        .sort(
            (a: Conversation, b: Conversation) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
        );
}

// 获取某用户的所有历史会话 , 按时间降序排序(新的在数组的前面)。
// 由于有JWT token， 所以后端应该能知道用户id
export async function fetchConversationsByUser(
    userId: string
): Promise<Conversation[]> {
    // 1. 假数据， 调api时记得注释掉。
    console.log(`Fetching history for user ${userId}...`);
    return [
        {
                        id: "conv-1",
                        characterId: "char-1",
                        userId: "user-1",
                        title: "探讨宇宙的起源",
                        topic: "科学",
                        summary: "关于大爆炸理论的一些初步讨论...",
                        updatedAt: "2025-07-15",
                    },
                    {
                        id: "conv-2",
                        characterId: "char-1",
                        userId: "user-1",
                        title: "如何烤出完美的披萨",
                        topic: "烹饪",
                        summary: "从面团发酵到烤箱温度的精确控制...",
                        updatedAt: "2025-07-12",
                    },
    ];

    // 为了模拟网络延迟，你可以添加一个 setTimeout
    await new Promise((resolve) => setTimeout(resolve, 500)); // 延迟500毫秒

    //2. 调用api
    const response = await apiClient.get(`/api/conversation/user/${userId}`);
    return response.data
        .map(
            (item: any): Conversation => ({
                id: item.id,
                title: item.title,
                topic: item.scene, // scene -> topic 映射
                summary: item.summary,
                updatedAt: item.timestamp, // timestamp -> updatedAt 映射
                characterId: item.characterId, // 从参数中补全
                userId: userId, 
            })
        )
        .sort(
            (a: Conversation, b: Conversation) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
        );
}