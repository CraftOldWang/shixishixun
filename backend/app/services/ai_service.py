from typing import List, Dict, Any
import json
import logging
from langchain.prompts import ChatPromptTemplate
from langchain.schema import HumanMessage, AIMessage
from dashscope import Generation

from app.core.config import settings
from app.models.models import Message, Character

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 通义千问模型配置
MODEL_NAME = "qwen-max"

def call_qwen_model(prompt: str) -> str:
    """调用通义千问模型"""
    try:
        response = Generation.call(
            model=MODEL_NAME,
            prompt=prompt,
            api_key=settings.DASHSCOPE_API_KEY,
            temperature=0.7,
            top_p=0.8,
            result_format='message',
        )
        
        if response.status_code == 200:
            return response.output.choices[0].message.content
        else:
            logger.error(f"调用通义千问模型失败: {response.code}, {response.message}")
            return "Sorry, I'm unable to answer that right now."
    except Exception as e:
        logger.error(f"调用通义千问模型异常: {str(e)}")
        return "Sorry, I'm experiencing some technical difficulties."

def format_messages_for_prompt(messages: List[Message], character: Character, topic: str = None) -> str:
    """将消息格式化为提示"""
    prompt = (
        f"You are {character.name}, {character.description}.\n"
        "Important: You must always reply only in fluent English. Never use any other language.\n"
    )
    if topic:
        prompt += f"Current conversation topic: {topic}\n"
    
    prompt += "Conversation history:\n"
    
    for msg in messages:
        if msg.is_user:
            prompt += f"User: {msg.content}\n"
        else:
            prompt += f"{character.name}: {msg.content}\n"
    
    return prompt

def get_ai_options(messages: List[Message], character: Character, topic: str = None) -> List[str]:
    """获取AI推荐问题"""
    prompt = format_messages_for_prompt(messages, character, topic)
    prompt += "\nBased on the conversation history, generate 3 possible follow-up questions the user might ask. Return ONLY a JSON array format with English questions. Format: [\"question1\", \"question2\", \"question3\"]"
    
    response = call_qwen_model(prompt)
    
    try:
        # 尝试解析JSON响应
        options = json.loads(response)
        if isinstance(options, list) and len(options) > 0:
            return options[:3]  # 最多返回3个选项
    except Exception as e:
        logger.error(f"解析AI推荐问题失败: {str(e)}")
    
    # 如果解析失败，返回默认选项
    return [
        "Can you tell me more about this topic?",
        "What are your thoughts on this matter?",
        "Could we discuss something else?"
    ]

def get_ai_response(messages: List[Message], character: Character, topic: str = None) -> str:
    """获取AI回复"""
    prompt = format_messages_for_prompt(messages, character, topic)
    prompt += f"\nRespond as {character.name} to the user's last message. Maintain character traits, speak naturally in English, and never mention being an AI or model."
    
    response = call_qwen_model(prompt)
    return response

def generate_topics(prompt: str, num_topics: int = 5) -> List[str]:
    """根据提示生成话题"""
    system_prompt = f"Generate {num_topics} relevant conversation topics in English based on the user's prompt. Return ONLY a JSON array format. Format: [\"topic1\", \"topic2\", ...]"
    
    full_prompt = f"{system_prompt}\n\nUser prompt: {prompt}"
    
    response = call_qwen_model(full_prompt)
    
    try:
        # 尝试解析JSON响应
        topics = json.loads(response)
        if isinstance(topics, list) and len(topics) > 0:
            return topics[:num_topics]  # 返回指定数量的话题
    except Exception as e:
        logger.error(f"解析生成话题失败: {str(e)}")
    
    # 如果解析失败，返回默认话题
    return [
        f"Fundamentals of {prompt}",
        f"Common questions about {prompt}",
        f"Practical applications of {prompt}",
        f"Historical development of {prompt}",
        f"Future trends in {prompt}"
    ][:num_topics]

def generate_conversation_title(messages: List[Message], character: Character, topic: str) -> str:
    """根据对话内容生成标题"""
    # 构建提示词
    prompt = f"Generate a concise English title (max 15 words) for this conversation:\n\n"
    
    # 添加对话内容
    for msg in messages:
        role = "User" if msg.is_user else character.name
        prompt += f"{role}: {msg.content}\n"
    
    # 添加话题信息
    if topic:
        prompt += f"\nTopic: {topic}"
    
    # 调用AI生成标题
    try:
        response = call_qwen_model(prompt)
        return response.strip()
    except Exception as e:
        print(f"生成标题失败: {str(e)}")
        return f"与{character.name}的对话"  # 返回默认标题

def get_dashscope_response(prompt: str) -> str:
    """调用通义千问模型生成内容"""
    return call_qwen_model(prompt)