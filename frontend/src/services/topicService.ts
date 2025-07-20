import type { Character, Conversation } from "../types"; // 假设你的类型定义在 '
import apiClient from "./api";

// TODO 这里的预定义话题需要存在后端， 不过也需要自己想想可以有什么话题 。 其实存前端也行。。。。。
export const getPredefinedTopics = async (): Promise<
    Record<string, string[]>
> => {
    // const PREDEFINED_TOPICS = {
    //     "Daily Life": [
    //         "Ordering coffee",
    //         "Talking about the weather",
    //         "Making plans for the weekend",
    //         "Grocery shopping",
    //     ],
    //     "Work & Career": [
    //         "Preparing for a job interview",
    //         "Discussing a project with a colleague",
    //         "Asking for a raise",
    //     ],
    //     Travel: [
    //         "Booking a hotel room",
    //         "Asking for directions",
    //         "Checking in at the airport",
    //         "Sharing travel experiences",
    //     ],
    //     Hobbies: [
    //         "Talking about your favorite movie",
    //         "Discussing a book you've read",
    //         "Planning a hiking trip",
    //     ],
    // };
    console.log("Fetching predefined topics...");

    const res = await apiClient.get<Record<string, string[]>>(
        "/api/topics/predefined"
    );

    return res.data;

};

export const generateTopics = async (prompt?: string): Promise<string[]> => {
    console.log(`Generating topics with prompt: "${prompt || "random"}"`);
    // await new Promise((resolve) => setTimeout(resolve, 1500));
    // if (prompt) {
    //     return [
    //         `Discussing "${prompt}" on a podcast`,
    //         `Debating the pros and cons of "${prompt}"`,
    //         `How to explain "${prompt}" to a 5-year-old`,
    //     ];
    // }
    // return [
    //     "A surprising discovery in the attic",
    //     "Planning a surprise party",
    //     "A memorable dream you had",
    // ];

    // 真实api调用
    // 要求返回三个字符串的数组 string[]，  当prompt 不为空， 返回相应话题， 为空返回随机话题
    // 以 后端api 返回下面样子的json 来写的。
    // {
    //     "topics": [
    //         "How technology changed communication",
    //         "The ethics of AI-generated content",
    //         "Explaining blockchain to a 5-year-old"
    //     ]
    // }
    try {
        const res = await apiClient.post<{ topics: string[] }>("/api/topics/generate", {
            prompt: prompt || "",
        });

        return res.data.topics;
    } catch (error) {
        console.error("Failed to generate topics:", error);
        return [];
    }
};
