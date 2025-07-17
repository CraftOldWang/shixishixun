import React from "react";
import type { Message } from "../types";

interface ConversationHistoryProps {
    messages: Message[]; // 对话消息数组
    characterName: string; // 当前角色的名字
    onClose: () => void; // 关闭按钮的回调函数（无参数、无返回值）
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({
    messages,
    characterName,
    onClose,
}) => {
    return (
        <div>
            <div>
                <h2>与{characterName}的对话历史</h2>
                <button onClick={onClose}>关闭</button>
            </div>

            <div>
                {messages.length === 0 ? (
                    <p>暂无对话记录</p>
                ) : (
                    // 在渲染前对消息进行排序
                    messages
                        .slice() // 创建一个浅拷贝，避免直接修改原始数组
                        .sort(
                            (a, b) =>
                                new Date(b.timestamp).getTime() -
                                new Date(a.timestamp).getTime()
                        ) // 降序排序
                        .map((message) => (
                            <div key={message.id}>
                                <div>
                                    <span>
                                        {message.isUser ? "你" : characterName}
                                    </span>
                                    <span>
                                        {new Date(
                                            message.timestamp
                                        ).toLocaleString()}
                                    </span>
                                </div>
                                <p>{message.content}</p>
                            </div>
                        ))
                )}
            </div>
        </div>
    );
};

export default ConversationHistory;
