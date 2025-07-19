import type { Character, Conversation } from "../types"; // 假设你的类型定义在 '

// TODO 这里的预定义话题需要存在后端， 不过也需要自己想想可以有什么话题 。 其实存前端也行。。。。。
export const getPredefinedTopics = async (): Promise<
    Record<string, string[]>
> => {
    const PREDEFINED_TOPICS = {
        "Daily Life": [
            "Ordering coffee",
            "Talking about the weather",
            "Making plans for the weekend",
            "Grocery shopping",
        ],
        "Work & Career": [
            "Preparing for a job interview",
            "Discussing a project with a colleague",
            "Asking for a raise",
        ],
        Travel: [
            "Booking a hotel room",
            "Asking for directions",
            "Checking in at the airport",
            "Sharing travel experiences",
        ],
        Hobbies: [
            "Talking about your favorite movie",
            "Discussing a book you've read",
            "Planning a hiking trip",
        ],
    };
    console.log("Fetching predefined topics...");
    await new Promise((resolve) => setTimeout(resolve, 500));
    return PREDEFINED_TOPICS;
};

export const generateTopics = async (prompt?: string): Promise<string[]> => {
    console.log(`Generating topics with prompt: "${prompt || "random"}"`);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (prompt) {
        return [
            `Discussing "${prompt}" on a podcast`,
            `Debating the pros and cons of "${prompt}"`,
            `How to explain "${prompt}" to a 5-year-old`,
        ];
    }
    return [
        "A surprising discovery in the attic",
        "Planning a surprise party",
        "A memorable dream you had",
    ];

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
        const response = await fetch("/api/topics", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: prompt || "" }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.topics; // 假设返回 { topics: [...] }
    } catch (error) {
        console.error("Failed to generate topics:", error);
        return [];
    }
};

// 需要在后端创建 新的conversation 、 让ai来第一条回复、然后进入这个conversation
//TODO 还没写
export const createConversation = async (
    characterId: string,
    topic: string
): Promise<Conversation> => {
    console.log(
        `Creating conversation for character ${characterId} with topic: "${topic}"`
    );
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
        id: `conv_${Date.now()}`,
        characterId,
        userId: "user-123",
        title: topic,
        topic,
        summary: `A new conversation about ${topic}.`,
        updatedAt: new Date().toISOString(),
    };
};
