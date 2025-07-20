import json
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# 测试数据
test_user = {
    "username": "testuser",
    "password": "testpass123",
    "email": "test@example.com"
}

test_character = {
    "name": "测试角色",
    "description": "这是一个测试角色",
    "avatar": "https://example.com/avatar.jpg"
}

def test_root():
    """测试根路径"""
    response = client.get("/")
    assert response.status_code == 200
    print("\n根路径响应:", json.dumps(response.json(), indent=2, ensure_ascii=False))

# 模块五：用户认证测试
class TestAuth:
    def test_register(self):
        """测试用户注册"""
        response = client.post("/api/auth/register", json=test_user)
        assert response.status_code in [201, 400]  # 400表示用户可能已存在
        print("\n注册响应:", json.dumps(response.json(), indent=2, ensure_ascii=False))

    def test_login(self):
        """测试用户登录"""
        response = client.post(
            "/api/auth/login",
            data={
                "username": test_user["username"],
                "password": test_user["password"]
            }
        )
        assert response.status_code == 200
        print("\n登录响应:", json.dumps(response.json(), indent=2, ensure_ascii=False))
        return response.json()["access_token"]

    def test_get_current_user(self, auth_token):
        """测试获取当前用户信息"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = client.get("/api/users/me", headers=headers)
        assert response.status_code == 200
        print("\n当前用户信息:", json.dumps(response.json(), indent=2, ensure_ascii=False))

# 模块二：角色管理测试
class TestCharacters:
    def test_get_default_characters(self):
        """测试获取默认角色列表"""
        response = client.get("/api/characters/default")
        assert response.status_code == 200
        print("\n默认角色列表:", json.dumps(response.json(), indent=2, ensure_ascii=False))

    def test_get_user_characters(self, auth_token):
        """测试获取用户自定义角色"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = client.get("/api/characters/user", headers=headers)
        assert response.status_code == 200
        print("\n用户自定义角色:", json.dumps(response.json(), indent=2, ensure_ascii=False))

# 模块三：对话管理测试
class TestConversations:
    def test_create_conversation(self, auth_token):
        """测试创建新对话"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        data = {
            "characterId": "test-char-id",
            "topic": "测试话题"
        }
        response = client.post("/api/conversations", json=data, headers=headers)
        assert response.status_code == 201
        print("\n新建对话:", json.dumps(response.json(), indent=2, ensure_ascii=False))
        return response.json()["id"]

    def test_get_conversation(self, auth_token, conversation_id):
        """测试获取单个对话"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = client.get(f"/api/conversations/{conversation_id}", headers=headers)
        assert response.status_code == 200
        print("\n对话详情:", json.dumps(response.json(), indent=2, ensure_ascii=False))

    def test_get_messages(self, auth_token, conversation_id):
        """测试获取对话消息列表"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = client.get(
            f"/api/conversations/{conversation_id}/messages",
            headers=headers
        )
        assert response.status_code == 200
        print("\n对话消息列表:", json.dumps(response.json(), indent=2, ensure_ascii=False))

# 模块四：话题测试
class TestTopics:
    def test_get_predefined_topics(self):
        """测试获取预定义话题"""
        response = client.get("/api/topics/predefined")
        assert response.status_code == 200
        print("\n预定义话题:", json.dumps(response.json(), indent=2, ensure_ascii=False))

    def test_generate_topics(self, auth_token):
        """测试AI生成话题"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        data = {"prompt": "科技发展"}
        response = client.post("/api/topics/generate", json=data, headers=headers)
        assert response.status_code == 200
        print("\nAI生成话题:", json.dumps(response.json(), indent=2, ensure_ascii=False))

# 模块一：AI交互测试
class TestAI:
    def test_get_ai_options(self, auth_token):
        """测试获取AI追问建议"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        data = {"reply": "人工智能正在快速发展。"}
        response = client.post("/api/ai/options", json=data, headers=headers)
        assert response.status_code == 200
        print("\nAI追问建议:", json.dumps(response.json(), indent=2, ensure_ascii=False))

    def test_save_user_message(self, auth_token, conversation_id):
        """测试保存用户消息"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        data = {
            "content": "这是一条测试消息",
            "conversationId": conversation_id
        }
        response = client.post("/api/messages", json=data, headers=headers)
        assert response.status_code == 201
        print("\n保存的用户消息:", json.dumps(response.json(), indent=2, ensure_ascii=False))

    def test_get_ai_response(self, auth_token, conversation_id):
        """测试获取AI回复"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        data = {
            "userInput": "你好，请介绍一下人工智能。",
            "conversationId": conversation_id
        }
        response = client.post("/api/ai/response", json=data, headers=headers)
        assert response.status_code == 200
        print("\nAI回复:", json.dumps(response.json(), indent=2, ensure_ascii=False))

def run_all_tests():
    """运行所有测试"""
    print("\n=== 开始测试 ===")
    
    print("\n--- 测试根路径 ---")
    test_root()
    
    print("\n--- 测试用户认证 ---")
    auth = TestAuth()
    auth.test_register()
    token = auth.test_login()
    auth.test_get_current_user(token)
    
    print("\n--- 测试角色管理 ---")
    chars = TestCharacters()
    chars.test_get_default_characters()
    chars.test_get_user_characters(token)
    
    print("\n--- 测试对话管理 ---")
    convs = TestConversations()
    conv_id = convs.test_create_conversation(token)
    convs.test_get_conversation(token, conv_id)
    convs.test_get_messages(token, conv_id)
    
    print("\n--- 测试话题管理 ---")
    topics = TestTopics()
    topics.test_get_predefined_topics()
    topics.test_generate_topics(token)
    
    print("\n--- 测试AI交互 ---")
    ai = TestAI()
    ai.test_get_ai_options(token)
    ai.test_save_user_message(token, conv_id)
    ai.test_get_ai_response(token, conv_id)
    
    print("\n=== 测试完成 ===")

if __name__ == "__main__":
    run_all_tests()
