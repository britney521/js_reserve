import requests
from bs4 import BeautifulSoup
import pandas as pd
from loguru import logger
import time
import random
import re
import numpy as np
import os  # 导入 os 库用于检查文件是否存在

# --------------------------
# 1. 配置
# --------------------------
logger.add("scraping_tianyancha.log", rotation="5 MB", retention="7 days", level="INFO")

# 长度阈值：小于等于 5 位视为人名
LEGAL_PERSON_LENGTH_THRESHOLD = 5
# 限制路径深度，最多支持 5 层路径
MAX_RECURSION_DEPTH = 3
PATH_COLUMNS = [f'路径{i}' for i in range(1, MAX_RECURSION_DEPTH + 1)]
CSV_OUTPUT_FILE = "tianyancha_results.csv"

# 目标 URL
BASE_URL = "https://www.tianyancha.com/nsearch"

# 您的请求头和 Cookie
BASE_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    # 'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-User': '?1',
    'Sec-Fetch-Dest': 'document',
    'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'Referer': 'https://www.tianyancha.com/nsearch?key=%E6%B7%B1%E5%9C%B3%E5%B8%82%E5%98%89%E4%BF%A1%E8%BE%BE%E4%B8%89%E5%8F%B7%E6%8A%95%E8%B5%84%E5%90%88%E4%BC%99%E4%BC%81%E4%B8%9A%EF%BC%88%E6%9C%89%E9%99%90%E5%90%88%E4%BC%99%EF%BC%89',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    # 'Cookie': 'HWWAFSESID=6198ff191e8bb13616; HWWAFSESTIME=1764812238330; csrfToken=GreFSOUiuyq9Ahlg_odJsVy4; CUID=f34869cc16062f6658042a2d8a9e5cd1; jsid=SEO-BAIDU-ALL-SY-000001; TYCID=c6d65750d0b111f0b05bc1b1ef9304d2; sajssdk_2015_cross_new_user=1; bdHomeCount=0; Hm_lvt_e92c8d65d92d534b0fc290df538b4758=1764812242; HMACCOUNT=834A0EEFB71A8422; bannerFlag=true; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22308462737%22%2C%22first_id%22%3A%2219ae701bc462f46-039550d6a1f52f2-17525637-2073600-19ae701bc471e2e%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E8%87%AA%E7%84%B6%E6%90%9C%E7%B4%A2%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Fwww.baidu.com%2Flink%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTlhZTcwMWJjNDYyZjQ2LTAzOTU1MGQ2YTFmNTJmMi0xNzUyNTYzNy0yMDczNjAwLTE5YWU3MDFiYzQ3MWUyZSIsIiRpZGVudGl0eV9sb2dpbl9pZCI6IjMwODQ2MjczNyJ9%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%22308462737%22%7D%2C%22%24device_id%22%3A%2219ae701bc462f46-039550d6a1f52f2-17525637-2073600-19ae701bc471e2e%22%7D; tyc-user-info=%7B%22state%22%3A%220%22%2C%22vipManager%22%3A%220%22%2C%22mobile%22%3A%2217315231596%22%2C%22userId%22%3A%22308462737%22%7D; tyc-user-info-save-time=1764825317594; auth_token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxNzMxNTIzMTU5NiIsImlhdCI6MTc2NDgyNTMxNywiZXhwIjoxNzY3NDE3MzE3fQ.sbBqBQJM2PCQkZeVDiSCQ65-XhxkIxPJ292qIyo9Txv-4Y11rmvBfS4-56Mu48xGiRdYK-CqF_4kJmOOLQ-kAA; searchSessionId=1764827475.63417789; Hm_lpvt_e92c8d65d92d534b0fc290df538b4758=1764827476',
}

# 您的 Cookie (直接放在 headers 中或作为 requests.cookies 参数传入都行，这里保留您的字典格式)
cookies = {
    'HWWAFSESID': '6198ff191e8bb13616',
    'HWWAFSESTIME': '1764812238330',
    'csrfToken': 'GreFSOUiuyq9Ahlg_odJsVy4',
    'CUID': 'f34869cc16062f6658042a2d8a9e5cd1',
    'jsid': 'SEO-BAIDU-ALL-SY-000001',
    'TYCID': 'c6d65750d0b111f0b05bc1b1ef9304d2',
    'sajssdk_2015_cross_new_user': '1',
    'bdHomeCount': '0',
    'Hm_lvt_e92c8d65d92d534b0fc290df538b4758': '1764812242',
    'HMACCOUNT': '834A0EEFB71A8422',
    'bannerFlag': 'true',
    'sensorsdata2015jssdkcross': '%7B%22distinct_id%22%3A%22308462737%22%2C%22first_id%22%3A%2219ae701bc462f46-039550d6a1f52f2-17525637-2073600-19ae701bc471e2e%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E8%87%AA%E7%84%B6%E6%90%9C%E7%B4%A2%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Fwww.baidu.com%2Flink%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTlhZTcwMWJjNDYyZjQ2LTAzOTU1MGQ2YTFmNTJmMi0xNzUyNTYzNy0yMDczNjAwLTE5YWU3MDFiYzQ3MWUyZSIsIiRpZGVudGl0eV9sb2dpbl9pZCI6IjMwODQ2MjczNyJ9%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%22308462737%22%7D%2C%22%24device_id%22%3A%2219ae701bc462f46-039550d6a1f52f2-17525637-2073600-19ae701bc471e2e%22%7D',
    'tyc-user-info': '%7B%22state%22%3A%220%22%2C%22vipManager%22%3A%220%22%2C%22mobile%22%3A%2217315231596%22%2C%22userId%22%3A%22308462737%22%7D',
    'tyc-user-info-save-time': '1764825317594',
    'auth_token': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxNzMxNTIzMTU5NiIsImlhdCI6MTc2NDgyNTMxNywiZXhwIjoxNzY3NDE3MzE3fQ.sbBqBQJM2PCQkZeVDiSCQ65-XhxkIxPJ292qIyo9Txv-4Y11rmvBfS4-56Mu48xGiRdYK-CqF_4kJmOOLQ-kAA',
    'searchSessionId': '1764827475.63417789',
    'Hm_lpvt_e92c8d65d92d534b0fc290df538b4758': '1764827476',
}


def append_results_to_csv(data_dict):
    """将单行结果追加写入 CSV 文件。"""

    # 确定文件是否存在，用于判断是否需要写入表头
    file_exists = os.path.isfile(CSV_OUTPUT_FILE)

    # 确定列顺序
    columns = ['公司'] + PATH_COLUMNS + ['最终实际控制人']

    # 将字典转换为 DataFrame
    df = pd.DataFrame([data_dict], columns=columns)

    try:
        df.to_csv(CSV_OUTPUT_FILE,
                  mode='a',  # 追加模式
                  header=not file_exists,  # 如果文件不存在，则写入表头
                  index=False,
                  encoding='utf_8_sig')  # 使用 utf_8_sig 确保中文在 Excel 中打开不乱码
        logger.info(f"💾 结果已追加写入 {CSV_OUTPUT_FILE}")
    except Exception as e:
        logger.error(f"写入 CSV 文件失败: {e}")


# --------------------------
# 2. 核心查询函数 (支持路径记录和递归)
# --------------------------

def query_legal_person_with_path(company_name, path_list, current_depth=1):
    """
    递归查询公司法定代表人，直到找到人名，并记录查询路径。
    返回: (最终控制人, 完整的路径列表)
    """

    # 路径记录：记录本次查询的对象
    path_list.append(company_name)

    if current_depth > MAX_RECURSION_DEPTH:
        logger.warning(f"超过最大路径深度 {MAX_RECURSION_DEPTH}，停止查询。")
        return company_name, path_list

    # 构造请求参数
    params = {'key': company_name}

    try:


        response = requests.get(BASE_URL, headers=BASE_HEADERS, params=params, timeout=10, cookies=cookies)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'lxml')

        # 尝试提取第一个搜索结果的法定代表人
        legal_person_tag = soup.select_one('.index_info-col__UVcZb .link-click')

        if not legal_person_tag:
            # 检查是否是反爬机制触发（如登录提示或验证码）
            if '请登录' in response.text or '验证' in response.text:
                logger.error(f"反爬机制触发！查询 {company_name} 失败。")
                return f"查询失败：反爬触发", path_list

            logger.warning(f"未能在 {company_name} 找到有效的法定代表人元素（CSS选择器可能失效或无结果）。")
            return company_name, path_list

        # 获取并清理文本
        legalPerson = legal_person_tag.get_text().strip()

        if not legalPerson:
            logger.warning(f"提取到空字符串，可能法人字段为空: {company_name}")
            return company_name, path_list

        # 3. 检查法人名称长度
        if len(legalPerson) <= LEGAL_PERSON_LENGTH_THRESHOLD:
            logger.success(f"[{'>>>' * current_depth}] 成功找到人名法人：{legalPerson}")
            return legalPerson, path_list
        else:
            logger.info(f"[{'>>>' * current_depth}] 找到法人（仍是公司）：{legalPerson} (长度: {len(legalPerson)})")
            # 法人仍是公司，进行递归查询。
            # 传入下一层级查询对象 (legalPerson) 和当前已有的路径 (path_list)
            return query_legal_person_with_path(legalPerson, path_list, current_depth + 1)

    except requests.exceptions.RequestException as e:
        logger.error(f"请求 {company_name} 时发生网络错误: {e}")
        return f"查询失败：网络错误", path_list
    except Exception as e:
        logger.error(f"处理 {company_name} 时发生未知错误: {e}")
        return f"查询失败：未知错误", path_list


# --------------------------
# 3. 主程序
# --------------------------
def main():
    try:
        original_df = pd.read_excel("data.xlsx")

        # ---------------------------
        # 遍历数据并处理
        # ---------------------------
        for index, row in original_df.iloc[255:].iterrows():
            company_raw = row['解禁名称']

            # 初始化结果字典，确保所有路径字段存在，初始为空
            result_row = {
                '公司': np.nan,
                '最终实际控制人': np.nan
            }
            for col in PATH_COLUMNS:
                result_row[col] = np.nan

            # 清理原始公司名中的 HTML 标签，确保查询准确
            if pd.isna(company_raw):
                company = ""
            else:
                soup = BeautifulSoup(str(company_raw), 'html.parser')
                company = soup.get_text().strip()

            # 检查是否为有效查询对象
            if not company or len(company) <= LEGAL_PERSON_LENGTH_THRESHOLD:
                logger.info(f"\n--- 跳过行 {index}: 非公司名或空值 ---")

                result_row['公司'] = company_raw  # 原始列内容
                # 如果原始就是人名，直接将其作为最终实际控制人
                if company:
                    result_row['最终实际控制人'] = company

                # 即使是跳过，也记录该行，方便追踪
                append_results_to_csv(result_row)
                continue

            logger.info(f"--- 开始处理 {index + 1}/{len(original_df)}: {company} ---")

            # ---------------------------
            # 执行带路径记录的查询
            # ---------------------------
            result_row['公司'] = company  # 记录清理后的公司名作为本次查询的起点
            path_list_initial = []
            final_controller, full_path = query_legal_person_with_path(company, path_list_initial)

            # 填充路径信息
            for i in range(len(full_path)):
                if i < MAX_RECURSION_DEPTH:
                    result_row[PATH_COLUMNS[i]] = full_path[i]

            # 填充实际控制人
            if len(final_controller) <= LEGAL_PERSON_LENGTH_THRESHOLD and "失败" not in final_controller:
                result_row['最终实际控制人'] = final_controller
            else:
                # 如果最终是查询失败信息或达到最大深度，填入链条上的最后一个元素
                result_row['最终实际控制人'] = full_path[-1] if full_path else final_controller

            # ---------------------------
            # 结果保存：立即追加写入 CSV
            # ---------------------------
            append_results_to_csv(result_row)

    except FileNotFoundError:
        logger.error("文件 data.xlsx 未找到。请确保文件存在。")
    except KeyError as e:
        logger.error(f"Excel 文件中缺少 '解禁名称' 列: {e}。")
    except Exception as e:
        logger.error(f"主程序发生未知错误: {e}")


if __name__ == "__main__":
    main()