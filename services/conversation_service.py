from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain_community.llms import Tongyi
from langchain.prompts import (
    ChatPromptTemplate,
    MessagesPlaceholder,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.schema import HumanMessage, AIMessage

from core.config import settings
from models.models import Character

class CharacterConversationService:
    def __init__(self):
        self.llm = Tongyi(
            model_name="qwen-turbo",  # 或者使用 "qwen-plus"
            dashscope_api_key=settings.TONGYI_API_KEY,
            temperature=0.7,
        )
        
    def get_character_prompt(self, character: Character):
        """根据角色信息生成系统提示"""
        return f"""你是一个名为{character.name}的二次元角色，你的性格是：{character.personality}。
你正在与一个正在学习英语的学生进行对话，你的目标是帮助他们练习英语会话。
当前场景是：{character.scenario}

你应该：
1. 使用适合{character.language_level}英语水平的语言
2. 保持你的角色性格特点
3. 用英语回应用户的消息，但可以在回复后用中文添加简短的解释或翻译
4. 如果用户用中文提问，鼓励他们尝试用英语表达，但仍然用英语回答
5. 纠正用户明显的语法或表达错误，但要友好且不打断对话流程
6. 保持对话自然流畅

记住，你是一个二次元角色，应该表现出相应的语言风格和个性特点。"""

    def create_conversation_chain(self, character: Character):
        """为特定角色创建对话链"""
        system_prompt = self.get_character_prompt(character)
        
        prompt = ChatPromptTemplate.from_messages([
            SystemMessagePromptTemplate.from_template(system_prompt),
            MessagesPlaceholder(variable_name="history"),
            HumanMessagePromptTemplate.from_template("{input}")
        ])
        
        memory = ConversationBufferMemory(return_messages=True)
        
        conversation = ConversationChain(
            memory=memory,
            prompt=prompt,
            llm=self.llm,
            verbose=True
        )
        
        return conversation
    
    def get_response(self, character: Character, message: str, conversation_history=None):
        """获取角色对用户消息的回应"""
        conversation = self.create_conversation_chain(character)
        
        # 如果有对话历史，添加到记忆中
        if conversation_history:
            for msg in conversation_history:
                if msg.is_user:
                    conversation.memory.save_context({"input": msg.content}, {"output": ""})
                else:
                    conversation.memory.save_context({"input": ""}, {"output": msg.content})
        
        # 获取回应
        response = conversation.predict(input=message)
        
        return response 