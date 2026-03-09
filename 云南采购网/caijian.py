import cv2
import ddddocr

# 创建 DdddOcr 实例，启用目标检测功能
ocr = ddddocr.DdddOcr(det=True,beta=True, show_ad=False)

# 读取图片
image_path = "img/captcha.png"
image = cv2.imread(image_path)

# 确保图像正确读取
if image is not None:
    # 将 OpenCV 图像转换为字节流
    _, image_bytes = cv2.imencode('.jpg', image)

    # 使用 ddddocr 进行目标检测，获取文字坐标
    poses = ocr.detection(image_bytes.tobytes())

    # 打印识别的文字坐标
    print("识别的文字坐标：", poses)

    # 遍历坐标，裁剪文字
    for pose in poses:
        x1, y1, x2, y2 = pose
        # 裁剪字符
        char_image = image[y1:y2, x1:x2]
        # 保存裁剪的字符图片
        cv2.imwrite(f"img/char_{x1}_{y1}.png", char_image)
else:
    print("Error: Image not loaded.")