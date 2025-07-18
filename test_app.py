from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from typing import List, Optional
import random
import json
import httpx
import asyncio
from tenacity import retry, stop_after_attempt, wait_fixed
from sqlalchemy.orm import Session
from datetime import timedelta
from core.config import settings
from core.auth import authenticate_user, create_access_token, get_password_hash, get_current_active_user
from db.database import get_db
from models.models import User
from schemas.schemas import UserCreate, UserResponse, Token

# 加载环境变量
load_dotenv("app.env")

# 获取通义千问API密钥
DASHSCOPE_API_KEY = os.getenv("DASHSCOPE_API_KEY")
if not DASHSCOPE_API_KEY:
    raise ValueError("通义千问API密钥未设置，请在app.env文件中设置DASHSCOPE_API_KEY")

app = FastAPI(
    title="二次元AI英语学习助手测试版",
    description="测试二次元角色对话功能",
    version="0.1.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    character: str = "友好的二次元少女"

class OptionSelectRequest(BaseModel):
    selected_option: int
    conversation_id: str

class ChatResponse(BaseModel):
    reply: str
    options: List[str] = []
    correct_option: Optional[int] = None
    has_options: bool = False
    conversation_id: str = ""

# 存储对话状态的简单内存数据库
conversations = {}

# 语法错误类型和主题库
grammar_error_types = [
    "时态错误", "主谓一致", "冠词使用", "介词使用", "比较级", 
    "情态动词", "不定式", "被动语态", "条件句", "代词", 
    "动名词", "数量词", "形容词副词", "连词", "名词单复数"
]

conversation_topics = [
    "学校生活", "日常活动", "旅行经历", "电影评论", "音乐爱好", 
    "美食烹饪", "体育运动", "科技产品", "环境保护", "职业规划",
    "动漫讨论", "游戏体验", "读书心得", "时尚潮流", "健康生活"
]

# 通义千问API调用函数
@retry(stop=stop_after_attempt(3), wait=wait_fixed(2))
async def call_tongyi_api(prompt, model="qwen-max"):
    """调用通义千问API"""
    try:
        print(f"尝试调用通义千问API，提示词: {prompt[:100]}...")
        # 启用真实API调用
        url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation"
        headers = {
            "Authorization": f"Bearer {DASHSCOPE_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": model,
            "input": {
                "messages": [
                    {
                        "role": "system",
                        "content": "你是一个专业的英语教师，擅长创建英语语法练习题。"
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            },
            "parameters": {}
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            result = response.json()
            if "output" in result and "text" in result["output"]:
                return result["output"]["text"]
    except Exception as e:
        print(f"API调用失败: {str(e)}")
        return None

# 新增：角色风格回复API调用
async def call_character_reply_api(character, user_message, topic=None, options=None, is_feedback=False, is_correct=None):
    """
    通过大模型生成角色风格的回复。
    - character: 角色设定
    - user_message: 用户消息
    - topic: 当前主题
    - options: 语法选项
    - is_feedback: 是否为答题反馈
    - is_correct: 答题是否正确
    """
    if is_feedback:
        if is_correct:
            prompt = f"""
你是一个{character}，请用你的风格鼓励用户，告诉他语法选择题答对了。可以简单点评一下用户的表现，并鼓励继续学习。请用英文和适当的二次元语气。
"""
        else:
            prompt = f"""
你是一个{character}，请用你的风格安慰用户，告诉他语法选择题答错了。可以简单指出有语法错误，并鼓励用户继续努力。请用英文和适当的二次元语气。
"""
    else:
        prompt = f"""
你是一个{character}，请用你的风格和用户进行英语学习对话。用户刚刚说："{user_message}"。当前主题是"{topic}"。请用英文和适当的二次元语气回复用户，欢迎他并引导他参与语法练习。
"""
    response = await call_tongyi_api(prompt)
    if response and len(response.strip()) > 0:
        return response.strip()
    # 兜底
    return f"[{character}] 很高兴和你交流！"

@app.get("/")
async def root():
    return {"message": "欢迎使用二次元AI英语学习助手测试版"}

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}

@app.post("/chat", response_model=ChatResponse)
async def chat_with_character(request: ChatRequest):
    """与二次元角色对话（大模型版）"""
    character = request.character
    user_message = request.message or ""
    # 生成一个会话ID
    conversation_id = f"conv_{random.randint(10000, 99999)}"
    # 基于用户消息或随机选择一个主题
    selected_topic = extract_topic_from_message(user_message.lower()) or random.choice(conversation_topics)
    # 选择一个语法错误类型
    error_type = random.choice(grammar_error_types)
    # 生成三个选项，其中一个正确，两个包含语法错误
    options, correct_option = await generate_ai_options(selected_topic, error_type)
    # 存储会话状态
    conversations[conversation_id] = {
        "options": options,
        "correct_option": correct_option,
        "character": character,
        "topic": selected_topic,
        "error_type": error_type,
        "user_message": user_message
    }
    # 角色风格回复（通过大模型）
    reply = await call_character_reply_api(character, user_message, selected_topic, options)
    reply += f"\n\nLet's practice English grammar! Here's a sentence about '{selected_topic}'. Please choose the grammatically correct option:"
    return {
        "reply": reply,
        "options": options,
        "has_options": True,
        "conversation_id": conversation_id
    }

@app.post("/select_option", response_model=ChatResponse)
async def select_option(request: OptionSelectRequest):
    """处理用户选择的选项（大模型版反馈）"""
    conversation_id = request.conversation_id
    selected_option = request.selected_option
    if conversation_id not in conversations:
        raise HTTPException(status_code=404, detail="对话不存在")
    conversation = conversations[conversation_id]
    options = conversation["options"]
    correct_option = conversation["correct_option"]
    character = conversation["character"]
    topic = conversation["topic"]
    error_type = conversation["error_type"]
    user_message = conversation["user_message"]
    is_correct = (selected_option == correct_option)
    # 角色风格正误反馈（通过大模型）
    feedback = await call_character_reply_api(character, user_message, topic, options, is_feedback=True, is_correct=is_correct)
    # 语法解释
    explanation = ""
    if not is_correct:
        explanation = await get_error_explanation(options[selected_option], options[correct_option], error_type)
    reply = feedback
    if explanation:
        reply += f"\n\n{explanation}"
    # 推荐下一个主题和新题目
    new_topic = suggest_next_topic(topic, user_message)
    new_error_type = random.choice(grammar_error_types)
    new_options, new_correct_option = await generate_ai_options(new_topic, new_error_type)
    # 更新会话
    conversations[conversation_id] = {
        "options": new_options,
        "correct_option": new_correct_option,
        "character": character,
        "topic": new_topic,
        "error_type": new_error_type,
        "user_message": user_message
    }
    reply += f"\n\nLet's continue! Here's a sentence about '{new_topic}'. Please choose the grammatically correct option:"
    return {
        "reply": reply,
        "options": new_options,
        "correct_option": correct_option if not is_correct else None,  # 只有在用户选错时才返回正确选项
        "has_options": True,
        "conversation_id": conversation_id
    }

def extract_topic_from_message(message):
    """从用户消息中提取可能的主题"""
    # 这里可以接入AI模型进行主题提取，目前使用简单的关键词匹配
    keywords_topics = {
        "school": "学校生活",
        "class": "学校生活",
        "teacher": "学校生活",
        "study": "学校生活",
        "daily": "日常活动",
        "life": "日常活动",
        "travel": "旅行经历",
        "trip": "旅行经历",
        "movie": "电影评论",
        "music": "音乐爱好",
        "food": "美食烹饪",
        "cook": "美食烹饪",
        "sport": "体育运动",
        "tech": "科技产品",
        "computer": "科技产品",
        "phone": "科技产品",
        "environment": "环境保护",
        "job": "职业规划",
        "work": "职业规划",
        "anime": "动漫讨论",
        "game": "游戏体验",
        "book": "读书心得",
        "fashion": "时尚潮流",
        "health": "健康生活"
    }
    
    for keyword, topic in keywords_topics.items():
        if keyword in message:
            return topic
    
    return None

def suggest_next_topic(current_topic, user_message):
    """基于当前主题和用户消息推荐下一个主题"""
    # 排除当前主题
    available_topics = [t for t in conversation_topics if t != current_topic]
    
    # 尝试从用户消息中提取主题
    extracted_topic = extract_topic_from_message(user_message)
    if extracted_topic and extracted_topic != current_topic:
        return extracted_topic
    
    # 否则随机选择一个新主题
    return random.choice(available_topics)

async def generate_ai_options(topic, error_type):
    """生成基于主题和错误类型的选项"""
    prompt = f"""
    请为英语学习者创建一个语法选择题，主题是"{topic}"，错误类型是"{error_type}"。
    
    请生成三个选项：一个语法正确的句子和两个包含"{error_type}"的语法错误句子。
    所有选项都应该与"{topic}"相关，并且长度相似，难度适中。
    
    请以JSON格式返回结果，格式如下：
    {{
        "correct": "语法正确的句子",
        "error1": "包含语法错误的句子1",
        "error2": "包含语法错误的句子2",
        "explanation": "解释为什么正确选项是正确的，以及错误选项的语法错误在哪里"
    }}
    
    只返回JSON格式的内容，不要有其他文字。
    """
    
    # 调用通义千问API
    response_text = await call_tongyi_api(prompt)
    
    if response_text:
        try:
            # 提取JSON部分
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            if json_start >= 0 and json_end > json_start:
                json_str = response_text[json_start:json_end]
                data = json.loads(json_str)
                
                # 提取选项
                options = [data["correct"], data["error1"], data["error2"]]
                
                # 随机打乱选项顺序
                shuffled_options = options.copy()
                random.shuffle(shuffled_options)
                
                # 找出正确选项在打乱后的索引
                correct_option = shuffled_options.index(data["correct"])
                
                return shuffled_options, correct_option
        except Exception as e:
            print(f"解析API响应时出错: {str(e)}")
    
    # 如果API调用失败或解析错误，使用备用选项
    return generate_backup_options(topic, error_type)

async def get_error_explanation(wrong_option, correct_option, error_type):
    """生成语法错误解释"""
    prompt = f"""
    请分析以下英语句子中的语法错误，并提供详细解释：
    
    错误句子: "{wrong_option}"
    正确句子: "{correct_option}"
    错误类型: "{error_type}"
    
    请解释错误句子中的语法问题，为什么它是错误的，以及为什么正确句子是正确的。
    解释应该清晰、简洁，并适合英语学习者理解。
    
    只返回解释内容，不要有其他文字。
    """
    
    # 调用通义千问API
    response_text = await call_tongyi_api(prompt)
    
    if response_text and len(response_text.strip()) > 0:
        return response_text.strip()
    
    # 如果API调用失败，使用备用解释
    return f"Grammar error: '{wrong_option}' contains a {error_type}. The correct expression should be '{correct_option}'."

def generate_backup_options(topic, error_type):
    """生成备用选项，当API调用失败时使用"""
    # 基于主题的备用句子模板
    topic_templates = {
        "学校生活": [
            {"correct": "I study English at school every day.", 
             "errors": ["I studying English at school every day.", "I studies English at school every day."]}
        ],
        "日常活动": [
            {"correct": "I usually wake up at 7 o'clock in the morning.", 
             "errors": ["I usual wake up at 7 o'clock in the morning.", "I usually waking up at 7 o'clock in the morning."]}
        ],
        "旅行经历": [
            {"correct": "I went to Japan last summer.", 
             "errors": ["I go to Japan last summer.", "I have been to Japan last summer."]}
        ],
        "电影评论": [
            {"correct": "The movie was directed by a famous director.", 
             "errors": ["The movie was direct by a famous director.", "The movie directed by a famous director."]}
        ],
        "音乐爱好": [
            {"correct": "I enjoy listening to classical music.", 
             "errors": ["I enjoy to listen to classical music.", "I enjoy listen to classical music."]}
        ]
    }
    
    # 如果有主题模板，使用它
    if topic in topic_templates:
        sentence_set = random.choice(topic_templates[topic])
    else:
        # 默认模板
        sentence_set = {
            "correct": "This sentence is grammatically correct.",
            "errors": ["This sentence have grammar error.", "This sentence containing grammar error."]
        }
    
    correct_sentence = sentence_set["correct"]
    error_sentences = sentence_set["errors"]
    
    # 组合选项并随机排序
    options = [correct_sentence] + error_sentences
    
    # 随机打乱选项顺序
    shuffled_options = options.copy()
    random.shuffle(shuffled_options)
    
    # 找出正确选项在打乱后的索引
    correct_option = shuffled_options.index(correct_sentence)
    
    return shuffled_options, correct_option

@app.get("/characters")
async def get_characters():
    """获取可用角色列表"""
    return [
        {"id": 1, "name": "友好的二次元少女", "description": "热情开朗，乐于助人"},
        {"id": 2, "name": "傲娇的二次元少女", "description": "表面冷淡，内心温柔"},
        {"id": 3, "name": "知性的二次元大姐姐", "description": "成熟稳重，知识渊博"},
        {"id": 4, "name": "元气满满的运动少女", "description": "活力四射，积极向上"},
        {"id": 5, "name": "害羞内向的文学少女", "description": "安静温柔，喜欢阅读"}
    ]

@app.post("/users/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """注册新用户"""
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="用户名已存在")
    db_user_email = db.query(User).filter(User.email == user.email).first()
    if db_user_email:
        raise HTTPException(status_code=400, detail="邮箱已被注册")
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/users/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """用户登录获取令牌"""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_active_user)):
    """获取当前用户信息"""
    return current_user

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("test_app:app", host="0.0.0.0", port=8000, reload=True) 