import os
from dotenv import load_dotenv
from langchain_community.llms import QianfanLLM

# 加载环境变量
load_dotenv("app.env")

def test_qianfan():
    """测试通义千问API连接"""
    try:
        # 获取API密钥
        qianfan_ak = os.getenv("QIANFAN_AK")
        qianfan_sk = os.getenv("QIANFAN_SK")
        
        if not qianfan_ak or not qianfan_sk:
            print("错误: 未设置QIANFAN_AK或QIANFAN_SK环境变量")
            return False
        
        # 初始化通义千问LLM
        llm = QianfanLLM(
            qianfan_ak=qianfan_ak,
            qianfan_sk=qianfan_sk,
            model="ERNIE-Bot-4",
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
    success = test_qianfan()
    if success:
        print("测试成功! 通义千问API连接正常")
    else:
        print("测试失败! 请检查API密钥和网络连接") 