import requests
import json

api_key = "Milh2QdD1Pus1Q7vTY57wsbq6F8uxWRKXIMvPg8DqW8EVKY0EZy3KaN3NPru"
url = "https://modelslab.com/api/v7/images/text-to-image"

headers = {
    "key": api_key,
    "Content-Type": "application/json"
}

data = {
    "model_id": "imagen-3",  # 确保模型支持透明背景生成
    "prompt": """
        masterpiece, best quality, anime style, 2D character, 
        transparent background, sharp lines, flat colors, 
        cute anime girl with blue hair, wearing a school uniform, 
        glowing eyes, intricate details, cel-shaded, studio ghibli style, 
        clean composition, no background, alpha channel
    """,
    "negative_prompt": "low quality, blurry, 3D, photorealistic, complex background",  # 抑制不想要的元素
    "width": 512,
    "height": 512,
    # 如果API支持透明格式，添加以下参数（参考文档）：
    "output_format": "png"  # 或检查API是否支持"transparent"选项
}

try:
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    result = response.json()
    print("API Response:")
    print(json.dumps(result, indent=2))
except requests.exceptions.HTTPError as http_err:
    print(f"HTTP error occurred: {http_err} - {response.text}")
except Exception as err:
    print(f"Other error occurred: {err}")
