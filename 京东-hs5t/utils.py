import json
import pandas as pd
import re
from datetime import datetime
import warnings

warnings.filterwarnings('ignore')


class JDProductParser:
    def __init__(self):
        self.products = []
        # 生成带时间戳的输出文件名
        self.timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        self.csv_path = f"jd_apple_products_{self.timestamp}.csv"
        self.excel_path = f"jd_apple_products_{self.timestamp}.xlsx"

    def parse_single_product(self, product):
        """解析单个商品的核心数据"""
        try:
            # 1. 基础标识信息
            sku_id = product.get('skuId', '')
            ware_id = product.get('wareId', '')
            product_name = product.get('wareName', '').strip()

            # 去除HTML标签
            product_name = re.sub(r'<[^>]+>', '', product_name) if product_name else ''

            # 2. 商品核心属性提取
            # 型号提取（iPhone 13/14/15/16/17系列）
            model = ''
            model_pattern = r'(iPhone\s?\d+[a-zA-Z]*\s?(Pro)?\s?(Max)?|苹果\s?\d+[a-zA-Z]*\s?(Pro)?\s?(Max)?)'
            model_match = re.search(model_pattern, product_name, re.IGNORECASE)
            if model_match:
                model = model_match.group(1).strip()

            # 存储容量提取
            storage = ''
            storage_pattern = r'(\d+GB|\d+TB)'
            storage_match = re.search(storage_pattern, product_name, re.IGNORECASE)
            if storage_match:
                storage = storage_match.group(1)

            # 颜色提取
            color = product.get('color', '').strip()

            # 3. 价格信息处理
            def format_price(price_str):
                """统一价格格式为浮点数"""
                if not price_str:
                    return 0.0
                price_str = str(price_str).replace('¥', '').replace(',', '').strip()
                return float(price_str) if price_str.replace('.', '').isdigit() else 0.0

            jd_price = format_price(product.get('jdPrice', ''))
            real_price = format_price(product.get('realPrice', ''))
            original_price = format_price(product.get('oriPrice', ''))

            # 计算折扣率（保留2位小数）
            discount_rate = round((1 - real_price / original_price) * 100, 2) if original_price != 0 else 0.0

            # 4. 销售与评价信息
            total_sales = product.get('totalSales', '').strip()
            comment_fuzzy = product.get('commentFuzzy', '').strip()
            good_rate = product.get('good', '')
            good_rate = f"{good_rate}%" if good_rate and str(good_rate).isdigit() else ''

            # 5. 店铺信息
            shop_name = product.get('shopName', '').strip()
            shop_id = product.get('shopId', '').strip()
            is_self_support = 1 if product.get('selfSupport', 0) == 1 else 0  # 1=自营，0=第三方
            is_ad = 1 if product.get('isAdv', 0) == 1 else 0  # 1=广告商品

            # 6. 核心卖点与标签
            selling_points = product.get('sellingPoint', [])
            selling_points_str = ' | '.join(filter(None, selling_points)) if selling_points else ''

            # 提取优惠信息
            promotion = ''
            for icon in product.get('iconList2', []):
                if icon.get('type') == '24' and icon.get('text'):
                    promotion = icon.get('text').strip()
                    break

            # 7. 其他关键属性
            support_5g = 1 if '5G' in product_name or '5G' in selling_points_str else 0
            dual_card = 1 if '双卡' in product_name or '双卡' in selling_points_str else 0

            return {
                'sku_id': sku_id,
                'ware_id': ware_id,
                'product_name': product_name,
                'model': model,
                'storage': storage,
                'color': color,
                'original_price': original_price,
                'jd_price': jd_price,
                'real_price': real_price,
                'discount_rate': discount_rate,
                'total_sales': total_sales,
                'comment_count_fuzzy': comment_fuzzy,
                'good_rate': good_rate,
                'shop_name': shop_name,
                'shop_id': shop_id,
                'is_self_support': is_self_support,
                'is_ad': is_ad,
                'promotion': promotion,
                'selling_points': selling_points_str,
                'support_5g': support_5g,
                'dual_card': dual_card,
                'parse_time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
        except Exception as e:
            print(f"解析商品失败（SKU: {product.get('skuId', '未知')}）: {str(e)}")
            return None

    def deduplicate_products(self):
        """根据SKU去重，保留第一条数据"""
        seen_skus = set()
        unique_products = []
        for product in self.products:
            if product['sku_id'] not in seen_skus and product['sku_id']:
                seen_skus.add(product['sku_id'])
                unique_products.append(product)
        return unique_products

    def load_and_parse(self, json_data):
        """加载JSON数据并批量解析"""
        # 处理JSON数据（支持字符串或字典格式）
        if isinstance(json_data, str):
            try:
                data = json.loads(json_data)
            except json.JSONDecodeError:
                print("JSON格式错误，请检查输入数据")
                return False
        elif isinstance(json_data, dict):
            data = json_data
        else:
            print("仅支持JSON字符串或字典格式")
            return False

        # 提取商品列表
        ware_list = data.get('wareList', [])
        print(f"共发现 {len(ware_list)} 个商品记录")

        # 批量解析
        for product in ware_list:
            parsed_data = self.parse_single_product(product)
            if parsed_data:
                self.products.append(parsed_data)

        # 去重处理
        self.products = self.deduplicate_products()
        print(f"去重后剩余 {len(self.products)} 个有效商品")
        return True

    def export_to_csv(self):
        """导出数据到CSV文件（Excel兼容）"""
        df = pd.DataFrame(self.products)
        # 调整列顺序，让核心信息在前
        core_columns = [
            'parse_time', 'sku_id', 'product_name', 'model', 'storage', 'color',
            'original_price', 'real_price', 'discount_rate', 'promotion',
            'total_sales', 'comment_count_fuzzy', 'good_rate',
            'shop_name', 'is_self_support', 'support_5g', 'dual_card'
        ]
        # 补充剩余列
        all_columns = core_columns + [col for col in df.columns if col not in core_columns]
        df = df[all_columns]

        # 保存CSV（UTF-8编码，支持中文）
        df.to_csv(self.csv_path, index=False, encoding='utf-8-sig')
        print(f"CSV文件已保存至: {self.csv_path}")
        return self.csv_path

    def export_to_excel(self):
        """导出数据到Excel文件"""
        df = pd.DataFrame(self.products)
        # 使用openpyxl引擎保存，支持xlsx格式
        with pd.ExcelWriter(self.excel_path, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='苹果手机数据', index=False)
        print(f"Excel文件已保存至: {self.excel_path}")
        return self.excel_path

    def print_summary(self):
        """打印数据提取摘要"""
        if not self.products:
            print("无有效解析数据")
            return

        df = pd.DataFrame(self.products)
        print("\n" + "=" * 50)
        print("数据提取摘要")
        print("=" * 50)
        print(f"1. 商品总量: {len(df)} 个")
        print(f"2. 自营商品: {df[df['is_self_support'] == 1].shape[0]} 个")
        print(f"3. 广告商品: {df[df['is_ad'] == 1].shape[0]} 个")
        print(f"4. 价格范围: ¥{df['real_price'].min():.0f} - ¥{df['real_price'].max():.0f}")
        print(f"5. 平均折扣: {df[df['discount_rate'] > 0]['discount_rate'].mean():.1f}%")
        print(f"6. 支持5G商品: {df[df['support_5g'] == 1].shape[0]} 个")
        print(f"7. 热门型号分布:")
        model_dist = df['model'].value_counts().head(5)
        for model, count in model_dist.items():
            if model:
                print(f"   - {model}: {count} 个")


# 使用示例
if __name__ == "__main__":
    # 1. 准备JSON数据（替换为你的实际数据）
    # 方式1：从文件读取（推荐）
    # with open('你的京东数据文件.json', 'r', encoding='utf-8') as f:
    #     json_input = json.load(f)

    # 方式2：直接传入JSON字符串
    json_input = """{
        "resultCount":586507,
        "wareList":[
            // 此处替换为你的完整商品列表数据
        ]
    }"""

    # 2. 初始化解析器并执行
    parser = JDProductParser()

    # 3. 加载并解析数据
    if parser.load_and_parse(json_input):
        # 4. 导出文件
        parser.export_to_csv()
        parser.export_to_excel()

        # 5. 打印摘要
        parser.print_summary()
    else:
        print("数据解析失败")