import numpy as np
from PIL import Image


# 展示验证码
def show_captcha(file_path):
    img = Image.open(file_path)
    img.show()


# 灰度化
def to_gray(img):
    img_gray = img.convert('L')
    return img_gray


# 二值化
def to_binary(img, threshold=200):
    table = []
    for i in range(256):
        if i < threshold:
            table.append(0)
        else:
            table.append(1)
    img_binary = img.point(table, '1')
    return img_binary


# 降噪
def reduce_noise(img):
    img_data = np.array(img, dtype=np.uint8)
    row, col = img_data.shape
    for i in range(row):
        for j in range(col):
            count = 0
            if img_data[i, j] != 255:  # 255 white
                # up search
                up_i = i - 1
                while up_i - 1 >= 0 and img_data[up_i, j] != 255:
                    count += 1
                    up_i -= 1
                # down search
                down_i = i + 1
                while down_i + 1 <= row - 1 and img_data[down_i, j] != 255:
                    count += 1
                    down_i += 1
                # clean
                if count <= 3:
                    for tmp_i in range(up_i, down_i):
                        img_data[tmp_i, j] = 255
    img_reduce_noise = Image.fromarray(img_data.astype('uint8'))
    return img_reduce_noise


# 修复图片
def fix(img):
    img_data = np.array(img, dtype=np.uint8)
    row, col = img_data.shape
    for i in range(row):
        for j in range(col):
            if img_data[i, j] == 255:
                up_j = j - 1
                down_j = j + 1
                if up_j >= 0 and down_j <= col - 1 and img_data[i, up_j] != 255 and img_data[i, down_j] != 255:
                    # fix
                    img_data[i, j] = 0
    img_fix = Image.fromarray(img_data.astype('uint8'))
    return img_fix


def crop(img):
    img_data = np.array(img, dtype=np.uint8)
    row, col = img_data.shape
    visited = {}

    for j in range(col):
        for i in range(row):
            if img_data[i, j] == 0:
                dfs(img_data, i, j, visited)
                break
        else:
            continue
        break
    fx, fy = list(visited.keys())[0]
    print(fx, fy)
    up, down, left, right = fx, fx, fy, fy
    for x, y in visited:
        if y > right:
            right = y
        if y < left:
            left = y
        if x < up:
            up = x
        if x > down:
            down = x
    print(left, up, right, down)
    img_crop = img.crop((left, up, right, down))
    return img_crop


"""
img_data 二维数组
visited  {}
"""


def dfs(img_data, i, j, visited):
    # find first point
    row, col = img_data.shape
    visited[(i, j)] = 1
    if j - 1 >= 0 and img_data[i, j-1] == 0 and (i, j-1) not in visited:
        dfs(img_data, i, j-1, visited)
    if j + 1 <= col - 1 and img_data[i, j+1] == 0 and (i, j+1) not in visited:
        dfs(img_data, i, j+1, visited)
    if i - 1 >= 0 and img_data[i-1, j] == 0 and (i-1, j) not in visited:
        dfs(img_data, i-1, j, visited)
    if i + 1 <= row - 1 and img_data[i+1, j] == 0 and (i+1, j) not in visited:
        dfs(img_data, i+1, j, visited)
