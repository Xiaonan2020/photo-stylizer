
import requests
import base64
import json

url = "https://api.vveai.com/v1/images/edits"

# 替换为你的API密钥
api_key = "sk-XEaPcwV0Q1krnR6ABd18Fc27Dd0c41Bb86607641D1271f08"

# 图像路径
image_path = "./docs/testopenaiapi/1661926227043328.jpg"

# 设置请求头
headers = {
    "Authorization": f"Bearer {api_key}"
}

# 准备文件和数据
with open(image_path, 'rb') as image_file:
    files = {
        'image[]': image_file
    }
    data = {
        'model': 'gpt-image-1',
        # 'model': 'gpt-4o',
        'prompt': '改变图片风格为黏土风格'
    }
    
    # 发送POST请求
    response = requests.post(url, headers=headers, files=files, data=data)
    
    # 检查响应状态
    if response.status_code == 200:
        result = response.json()
        
        # 获取base64编码的图像数据
        if 'data' in result and len(result['data']) > 0:
            b64_json = result['data'][0]['b64_json']
            
            # 解码并保存图像
            image_data = base64.b64decode(b64_json)
            with open('gift-basket.png', 'wb') as output_file:
                output_file.write(image_data)
            
            print("图像已成功保存为 gift-basket.png")
        else:
            print("响应中没有找到图像数据")
    else:
        print(f"请求失败，状态码: {response.status_code}")
        print(f"错误信息: {response.text}")

