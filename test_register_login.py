import requests

API = 'http://127.0.0.1:8000'
username = 'testuser1'
email = 'testuser1@example.com'
password = 'testpass123'

print('--- 测试注册 ---')
reg_resp = requests.post(f'{API}/users/register', json={
    'username': username,
    'email': email,
    'password': password
})
if reg_resp.status_code == 200:
    print('注册成功:', reg_resp.json())
else:
    print('注册失败:', reg_resp.status_code, reg_resp.text)

print('\n--- 测试登录 ---')
login_resp = requests.post(f'{API}/users/token', data={
    'username': username,
    'password': password
})
if login_resp.status_code == 200:
    print('登录成功:', login_resp.json())
    token = login_resp.json()['access_token']
    # 测试获取用户信息
    print('\n--- 测试获取用户信息 ---')
    me_resp = requests.get(f'{API}/users/me', headers={'Authorization': f'Bearer {token}'})
    print('用户信息:', me_resp.status_code, me_resp.json())
else:
    print('登录失败:', login_resp.status_code, login_resp.text) 