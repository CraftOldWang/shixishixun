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
            return "抱歉，我现在无法回答这个问题。"
    except Exception as e:
        logger.error(f"调用通义千问模型异常: {str(e)}")
        return "抱歉，我现在遇到了一些技术问题。"

def format_messages_for_prompt(messages: List[Message], character: Character, topic: str = None) -> str:
    """将消息格式化为提示"""
    prompt = f"你是{character.name}，{character.description}\n"
    
    if topic:
        prompt += f"当前对话的主题是：{topic}\n"
    
    prompt += "以下是对话历史：\n"
    
    for msg in messages:
        if msg.is_user:
            prompt += f"用户: {msg.content}\n"
        else:
            prompt += f"{character.name}: {msg.content}\n"
    
    return prompt

def get_ai_options(messages: List[Message], character: Character, topic: str = None) -> List[str]:
    """获取AI推荐问题"""
    prompt = format_messages_for_prompt(messages, character, topic)
    prompt += "\n根据以上对话历史，请生成3个用户可能想问的问题，直接以JSON数组格式返回，不要有其他内容。格式为: [\"问题1\", \"问题2\", \"问题3\"]"
    
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
        "你能告诉我更多关于这个话题的信息吗？",
        "你对这个问题有什么看法？",
        "我们可以换个话题吗？"
    ]

def get_ai_response(messages: List[Message], character: Character, topic: str = None) -> str:
    """获取AI回复"""
    prompt = format_messages_for_prompt(messages, character, topic)
    prompt += f"\n请以{character.name}的身份回复用户的最后一条消息，保持角色特点，不要说你是AI或模型。"
    
    response = call_qwen_model(prompt)
    return response

def generate_topics(prompt: str, num_topics: int = 5) -> List[str]:
    """根据提示生成话题"""
    system_prompt = f"根据用户的提示，生成{num_topics}个相关的对话话题，直接以JSON数组格式返回，不要有其他内容。格式为: [\"话题1\", \"话题2\", ...]"
    
    full_prompt = f"{system_prompt}\n\n用户提示: {prompt}"
    
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
        f"{prompt}的基础知识",
        f"关于{prompt}的常见问题",
        f"{prompt}的应用场景",
        f"{prompt}的发展历史",
        f"{prompt}的未来趋势"
    ][:num_topics]