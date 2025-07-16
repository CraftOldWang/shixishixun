import os
from dotenv import load_dotenv
from langchain_community.llms import Tongyi

# 加载环境变量
load_dotenv("app.env")

def test_tongyi():
    """测试通义千问API连接"""
    try:
        # 获取API密钥
        tongyi_api_key = os.getenv("TONGYI_API_KEY")
        
        if not tongyi_api_key:
            print("错误: 未设置TONGYI_API_KEY环境变量")
            return False
        
        # 初始化通义千问LLM
        llm = Tongyi(
            model_name="qwen-turbo", # 或者使用 "qwen-plus"
            dashscope_api_key=tongyi_api_key,
            temperature=0.7,
        )
        
        # 测试生成
        prompt = "你好，请用一个二次元角色的语气自我介绍"
        print(f"发送提示: {prompt}")
        
        response = llm(prompt)
        print(f"通义千问回复: {response}")
        
        return True
    except Exception as e:
        print(f"测试失败: {e}")
        return False

if __name__ == "__main__":
    print("开始测试通义千问API...")
    success = test_tongyi()
    if success:
        print("测试成功! 通义千问API连接正常")
    else:
        print("测试失败! 请检查API密钥和网络连接") 