import os
import torch
import cv2
import numpy as np
from PIL import Image
import torch.nn.functional as F
from torch import nn
from torchvision import transforms
import warnings

# 导入你训练时定义的模型类 (建议将类定义放在一个单独的 py 文件中，这里假设直接引用)
# from train_siamese import SiameseNetwork

warnings.filterwarnings("ignore")


# ===================== 1. 核心配置 =====================
class Config:
    # 模型路径
    yolo_weights = "/Users/britlee/Desktop/pythonProject/jiqixuexi/shenduxuexi/yolo_test/极验点选/runs/detect/train2/weights/best.pt"
    siamese_weights = "icon_similarity_model_final.pth"  # 你刚才保存的模型

    # 匹配配置
    # 注意：欧氏距离越小越好。如果距离 > 2.0 通常认为不是同一个图标
    dist_threshold = 2.0
    img_size = (50, 50)  # 必须与训练时的 50x50 一致

    # 路径配置
    template_dir = "template_icons"
    test_img_path = "image/bg.png"

    device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")


# --- 训练时定义的模型结构（必须完全一致） ---
class SiameseNetwork(nn.Module):
    def __init__(self):
        super(SiameseNetwork, self).__init__()
        self.cnn = nn.Sequential(
            nn.Conv2d(1, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.Flatten()
        )
        self.fc = nn.Sequential(
            nn.Linear(128 * 12 * 12, 512),
            nn.ReLU(inplace=True),
            nn.Linear(512, 128)
        )

    def forward_once(self, x):
        return self.fc(self.cnn(x))


# ===================== 2. 图像预处理（关键：处理透明度和灰度） =====================
def preprocess_for_siamese(pil_img):
    """匹配训练时的预处理逻辑：填充白底 + 灰度 + Resize"""
    # 1. 处理透明度
    img = pil_img.convert("RGBA")
    white_bg = Image.new("RGBA", img.size, (255, 255, 255))
    white_bg.paste(img, mask=img)

    # 2. 灰度化与尺寸缩放
    transform = transforms.Compose([
        transforms.Grayscale(num_output_channels=1),
        transforms.Resize(Config.img_size),
        transforms.ToTensor(),
    ])
    return transform(white_bg.convert("L")).unsqueeze(0).to(Config.device)


# ===================== 3. 加载模型 =====================
def load_models():
    from ultralytics import YOLO
    yolo_model = YOLO(Config.yolo_weights)

    siamese_model = SiameseNetwork().to(Config.device)
    siamese_model.load_state_dict(torch.load(Config.siamese_weights, map_location=Config.device))
    siamese_model.eval()

    print("✅ 所有模型加载完成")
    return yolo_model, siamese_model


# ===================== 4. 检测与提取 =====================
def get_detected_icons(yolo_model):
    results = yolo_model(Config.test_img_path, conf=0.5)  # 适当降低检测阈值防止漏检
    img_bgr = cv2.imread(Config.test_img_path)
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

    icon_list = []
    for box in results[0].boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0].cpu().numpy())
        # 裁剪
        crop = Image.fromarray(img_rgb[y1:y2, x1:x2])
        # 预处理成 Tensor
        tensor = preprocess_for_siamese(crop)
        center = ((x1 + x2) / 2, (y1 + y2) / 2)
        icon_list.append({"tensor": tensor, "coord": center})

    return icon_list


# ===================== 5. 核心匹配逻辑 =====================
def match_icons():
    yolo_model, siamese_model = load_models()

    # 1. 获取检测到的图标
    detected_icons = get_detected_icons(yolo_model)

    # 2. 加载模板并按序处理
    template_files = sorted([f for f in os.listdir(Config.template_dir) if f.endswith(('.png', '.jpg'))])

    click_coords = []
    used_indices = set()

    for t_name in template_files:
        t_path = os.path.join(Config.template_dir, t_name)
        t_img = Image.open(t_path)
        t_tensor = preprocess_for_siamese(t_img)

        best_dist = float('inf')
        best_coord = None
        best_idx = -1

        with torch.no_grad():
            v_template = siamese_model.forward_once(t_tensor)

            for i, det in enumerate(detected_icons):
                if i in used_indices: continue

                v_det = siamese_model.forward_once(det["tensor"])
                # 计算距离
                dist = F.pairwise_distance(v_template, v_det).item()
                print(dist,'dist')
                if dist < best_dist and dist < Config.dist_threshold:
                    best_dist = dist
                    best_coord = det["coord"]
                    best_idx = i

        if best_coord:
            used_indices.add(best_idx)
            click_coords.append(best_coord)
            print(f"✅ 模板 [{t_name}] -> 匹配成功! 距离: {best_dist:.3f} -> 坐标: {best_coord}")
        else:
            click_coords.append(None)
            print(f"❌ 模板 [{t_name}] -> 未找到匹配图标")

    return click_coords


if __name__ == "__main__":
    coords = match_icons()
    print("\n最终点击顺序：", coords)