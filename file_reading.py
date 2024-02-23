import json
import os
import re

# 定义一个函数来提取文件名中的日期
def extract_date(filename):
    # 使用正则表达式匹配日期，考虑了年月日（YYYYMMDD）、年月（YYYYMM）或仅年（YYYY）的格式
    match = re.search(r'(\d{4})(\d{2})(\d{2})?|(\d{4})(\d{2})?|(\d{4})', filename)
    if match:
        # 构建一个可以排序的日期字符串
        if match.group(1):  # YYYYMMDD格式
            year, month, day = match.group(1, 2, 3)
            return f"{year}-{month}-{day if day else '01'}"  # 如果没有日，则默认为月的第一天
        elif match.group(4):  # YYYYMM格式
            year, month = match.group(4, 5)
            return f"{year}-{month}-01"
        else:  # 仅YYYY格式
            year = match.group(6)
            return f"{year}-01-01"  # 默认为该年的第一月第一天
    return "0000-00-00"  # 如果没有找到日期，返回一个默认值

# 假设您的图片存储在本地的./images目录
images_dir = './images'
images_list = [f for f in os.listdir(images_dir) if f.lower().endswith('.jpg') and f != '.DS_Store']

# 按提取的日期从早到晚排序
sorted_images_list = sorted(images_list, key=lambda x: extract_date(x))

# 生成JSON文件
with open('images.json', 'w') as f:
    json.dump(sorted_images_list, f)
