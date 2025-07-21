import apiClient from "./api";
import type { Character } from "../types";
import { useAuth } from "../contexts/AuthContext";
// 获取所有默认角色
export async function fetchDefaultCharacters(): Promise<Character[]> {
    // 为了模拟网络延迟，你可以添加一个 setTimeout
    // await new Promise((resolve) => setTimeout(resolve, 100)); // 延迟500毫秒

    // // 默认角色 mock data 取消注释就可以使用, 但可能要先把下面实际api调用注释了。
    // return [
    //     {
    //         id: "char-1",
    //         name: "全能翻译官",
    //         description: "精通多种语言，提供精准翻译。",
    //         avatar: "https://images.unsplash.com/photo-1543465077-5338d8232588?w=400",
    //         isDefault: true,
    //         tags: ["翻译", "学习"],
    //     },
    //     {
    //         id: "char-2",
    //         name: "编程高手",
    //         description: "解决各种编程难题和代码审查。",
    //         avatar: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400",
    //         isDefault: true,
    //         tags: ["编程", "技术"],
    //     },
    //     {
    //         id: "1",
    //         name: "小明",
    //         description: "热心的学习助手",
    //         avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    //         isDefault: true,
    //         tags: ["默认", "AI", "幽默"],
    //     },
    //     {
    //         id: "2",
    //         name: "小红",
    //         description: "善于讲故事的AI",
    //         avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    //         isDefault: true,
    //         tags: ["默认", "故事", "温柔"],
    //     },
    // ];

    const response = await apiClient.get("/api/characters/default");
    console.log("使用api得到默认角色");
    console.log(response.data);

    // 映射后端字段到前端类型（avatarUrl -> avatar）
    return response.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        avatar: item.avatar,
        isDefault: item.isDefault,
        tags: item.tags,
    }));
}

// 获取当前用户创建的角色
export async function fetchCustomCharacters(
    userId: string
): Promise<Character[]> {
    // 为了模拟网络延迟，你可以添加一个 setTimeout
    // await new Promise((resolve) => setTimeout(resolve, 100)); // 延迟500毫秒

    // return    [
    //     {
    //         id: "char-3",
    //         name: "我的健身教练",
    //         description: "为我量身定制的健身计划。",
    //         avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    //         isDefault: false,
    //          // createdby谁没什么必要....
    //         tags: ["健康", "运动"],
    //     },
    // ];

    const response = await apiClient.get(`/api/characters/users/${userId}`);
    console.log("获取自定义角色");
    console.log(response.data);

    return response.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        avatar: item.avatar,
        isDefault: item.isDefault,
        tags: item.tags,
    }));
}

// 获取当前用户创建的角色
// BUG API 字段可能冲突，之后再改。
export async function fetchSingleCharacterById(
    characterId: string
): Promise<Character> {
    //1.测试用的假数据。
    // const mockCharacter: Character = {
    //     id: "char-1",
    //     name: "艾拉",
    //     description: "一位知识渊博的图书管理员，对古代历史充满热情。",
    //     avatar: "https://bkudcgimcodwrexeqekc.supabase.co/storage/v1/object/public/media/characters/bK0mXMTrrspFRMYnE10qbheVZhODQEO4/neutral.jpg",
    // };

    // // 为了模拟网络延迟，你可以添加一个 setTimeout
    // await new Promise((resolve) => setTimeout(resolve, 500)); // 延迟500毫秒

    // return mockCharacter;

    //2. API 调用。
    const response = await apiClient.get(`/api/characters/${characterId}`);

    const item = response.data;
    return {
        // 仍然返回一个数组，但只包含一个元素
        id: item.id,
        name: item.name,
        description: item.description,
        avatar: item.avatar, // 注意这里是 item.avatar
        isDefault: item.isDefault,
        tags: item.tags,
    };
}

// 创建新角色
export const createCharacter = async (
    userId: string,
    characterData: any
): Promise<Character> => {
    try {
        console.log(characterData);
        const response = await apiClient.post(
            `/api/characters/create?user_id=${userId}`,
            characterData
        );

        if (response.status !== 200) {
            const errorData = response.data;
            throw new Error(errorData.detail || "创建角色失败");
        }

        // 映射后端字段到前端类型
        return {
            id: response.data.id,
            name: response.data.name,
            description: response.data.description,
            avatar: response.data.avatar,
            isDefault: response.data.isDefault,
            createdBy: userId,
            tags: response.data.tags || [],
        };
    } catch (error) {
        console.error("创建角色错误:", error);
        throw error;
    }
};
