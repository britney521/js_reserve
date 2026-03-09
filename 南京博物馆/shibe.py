import json

import ddddocr
import requests

import layu_lib as ly
import os
from PIL import Image


def shibe(input_file_name):

    img = Image.open("data/input/"+input_file_name+".png")

    # 灰度化
    img_gray = ly.to_gray(img)
    img_gray.save("data/output/"+input_file_name+"_gray.png")

    # 降噪
    img_reduce_noise = ly.reduce_noise(img_gray)
    img_reduce_noise.save("data/output/" + input_file_name + "_reduce_noise.png")

    # 修复
    img_fix = ly.fix(img_reduce_noise)
    img_fix.save("data/output/" + input_file_name + "_fix.png")

    # 二值化
    img_binary = ly.to_binary(img_fix)
    img_binary.save("data/output/"+input_file_name+"_binary.png")

    # 切割
    img_crop = ly.crop(img_binary)
    img_crop.save("data/output/"+input_file_name+"_crop.png")

    # 用tesseract识别
    text = pytesseract.image_to_string("data/output/"+input_file_name+"_binary.png", config='--psm 7')
    print("TEXT=", text)

    return text


def recognize():
    ocr = ddddocr.DdddOcr()
    with open('data/input/VerifyCode.png', 'rb') as f:
        img_bytes = f.read()
    res = ocr.classification(img_bytes)
    print(res)
    return res

# shibe('VerifyCode')
# recognize()