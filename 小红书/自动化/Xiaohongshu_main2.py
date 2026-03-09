import time
import tkinter as tk
from tkinter import messagebox
import random
from DrissionPage import ChromiumPage
from track import Track
from datetime import datetime
from loguru import logger


page = ChromiumPage(9523)
# 创建一个隐藏的主窗口
root = tk.Tk()
root.withdraw()  # 隐藏主窗口

class Xiaohongshu:
    def __init__(self):
        self.url = 'https://www.xiaohongshu.com'
        self.login_url = 'https://www.xiaohongshu.com/login'
        self.wds = ['苏菲卫生巾',]
        self.phone_list = ['17315231596']
        # self.phone_list = []

        # 人类滚动行为特征 - 简化但保留关键特性
        self.SCROLL_BEHAVIOR = {
            "hover_chance": 0.6,  # 鼠标悬浮概率
            "scroll_back_chance": 0.3,  # 回滚概率
            "scroll_range": (150, 800),  # 正常滚动距离范围(像素)
            "min_pause": 0.8,  # 最小暂停时间(秒)
            "max_pause": 3.5  # 最大暂停时间(秒)
        }


    def show_message(self):
        # 弹出消息框，显示指定内容
        response = messagebox.askokcancel("提示", "请登录跳转后点击确认")
        if response:  # 如果用户点击了“确定”
            print("用户点击了确认，程序继续执行")
            # 在这里继续执行后续代码
            return True
        else:
            print("用户取消操作，程序终止")
            # 如果用户点击了“取消”，可以在这里处理取消逻辑
            return False

    def login(self):
        page.set.window.max()
        page.get(self.login_url)
        #最大化窗口界面
        #等待登录输入框
        page.wait.eles_loaded('x://*[@id="app"]/div[1]/div/div[1]/div[2]/div[2]/form/label[1]/input')  # 等待 id 为 div1 的元素加载
        #随机获取一个电话号码
        random_phone = random.choice(self.phone_list)
        page.ele('x://*[@id="app"]/div[1]/div/div[1]/div[2]/div[2]/form/label[1]/input').input(random_phone)
        #点击获取验证码
        page.ele('x://*[@id="app"]/div[1]/div/div[1]/div[2]/div[2]/form/label[2]/span').click()
        # 登录后点击确认
        if self.show_message() == True:
            print('登录成功')
            return True
        else:
            print('登录失败')
            return True
    def get_page_list(self,url):
        page.get(url)
        #最大化窗口界面
        page.set.window.max()
        #等待筛选按钮
        page.wait.eles_loaded('x://*[@id="global"]/div[2]/div[2]/div/div/div[1]/div[2]')
        # 将鼠标移动到筛选目标元素上
        target_element = page.ele('x://*[@id="global"]/div[2]/div[2]/div/div/div[1]/div[2]')
        page.actions.move_to(target_element)
        page.wait.ele_displayed('x://*[@class="tag-container"]', timeout=3)

        #鼠标移动到一周内元素上
        hover_element = page.ele('x://*[@id="global"]/div[2]/div[2]/div/div/div[1]/div[2]/div/div/div[1]/div[3]/div/div[3]/span')
        if hover_element:
            print('找到了。')
        if not hover_element:
            print('没有找到。')

        #监听
        page.listen.start('edith.xiaohongshu.com/api/sns/web/v1/search/notes')  # 开始监听，指定获取包含该文本的数据包

        #移动到一周内并点击
        page.actions.move_to(hover_element)
        page.ele('x://*[@id="global"]/div[2]/div[2]/div/div/div[1]/div[2]/div/div/div[1]/div[3]/div/div[3]/span').click()

        num1 = 0
        index_num = 0

        while True:
            res = page.listen.wait()  # 等待并获取一个数据包
            response = res.response.body
            data_items = response['data']['items']
            for data_item in data_items:
                article_id = data_item['id']
                try:
                    note_card = data_item['note_card']
                except:
                    continue
                try:
                    title = note_card['display_title']
                except:
                    title = ''
                user_name = note_card['user']['nick_name']
                user_id = note_card['user']['user_id']
                xsec_token = data_item['xsec_token']
                pubdate = note_card['corner_tag_info'][0]['text']
                href = f'https://www.xiaohongshu.com/explore/{article_id}?xsec_token={xsec_token}&xsec_source='
                print(article_id,title,user_name,pubdate,user_id,xsec_token,href)
                #清空监听

                # page.listen.stop()
                self.get_comments(index_num)
                index_num+=1

            #列表页面滑动 到底部
            page.set.scroll.smooth()
            page.set.scroll.wait_complete(on_off=True)
            current_height = page.run_js("return document.body.scrollHeight")
            page.scroll(30)
            # page.scroll.to_bottom()
            time.sleep(random.uniform(0.5,2))
            # # page.scroll.to_bottom()
            new_height = page.run_js("return document.body.scrollHeight")
            # time.sleep(random.uniform(0.5,2))

            if num1 ==1:
                break
            if new_height == current_height:
                print("已经滚动到底部")
                num1 = 1
                continue


    def get_comments(self,index_num):
        #监听
        data_indexs = page.eles('x://*[@class="feeds-container"]/section')
        for data_index in data_indexs:

            data_num = data_index.attrs.get('data-index')
            if index_num == int(data_num):
                #不是博文的没有这个元素 判断为none就跳过
                data_height = data_index.attrs.get('data-height')
                if data_height ==None:
                    continue
                page.listen.start(['edith.xiaohongshu.com/api/sns/web/v2/comment/page','edith.xiaohongshu.com/api/sns/web/v1/feed'])  # 开始监听，指定获取包含该文本的数据包 评论

                #点击列表博文
                page.actions.move_to(data_index).click()
                # 等待博文按钮展示
                page.ele('x://*[@class="chat-wrapper"]').wait.displayed()
                time.sleep(random.uniform(1, 2))

                resp = page.listen.wait(2)               # 等待捕获数据包:ml-citation{ref="1" data="citationList"}
                resp_item = {}
                for res in resp:
                    #获取到博文信息数据
                    if 'https://edith.xiaohongshu.com/api/sns/web/v1/feed' == res.url:
                        resp_item['feed'] = res
                    #获取评论信息数据
                    else:
                        resp_item['page'] = res

                feed_res = resp_item['feed']
                feed_response = feed_res.response.body
                title_id = feed_response['data']['items'][0]['id']
                title = feed_response['data']['items'][0]['note_card']['title']
                user_name = feed_response['data']['items'][0]['note_card']['user']['nickname']
                user_id = feed_response['data']['items'][0]['note_card']['user']['user_id']
                desc = feed_response['data']['items'][0]['note_card']['desc']
                label_datas = feed_response['data']['items'][0]['note_card']['tag_list']
                label_data = ''.join([tag['name'] for tag in label_datas])
                ip_location = feed_response['data']['items'][0]['note_card']['ip_location']
                create_times = feed_response['data']['items'][0]['note_card']['last_update_time']
                timestamp_s = int(create_times / 1000)
                date_time = datetime.fromtimestamp(timestamp_s)
                last_update_time = date_time.strftime('%Y-%m-%d %H:%M:%S')

                print(title_id, title, user_name, user_id, desc, label_data, ip_location, last_update_time)


                # 无评论处理
                hover_element = page.ele('x://*[@class="no-comments-text"]', timeout=0.5)
                if hover_element:
                    print('无评论')
                    # 设置随机浏览时常模拟真人
                    scroll_behavior = random.choice(["细读", "快速浏览", "跳过"])
                    if scroll_behavior == "细读":
                        time.sleep(random.uniform(5, 10))
                    elif scroll_behavior == "快速浏览":
                        time.sleep(random.uniform(4, 8))
                    else:
                        time.sleep(random.uniform(3, 5))
                    logger.debug(f"[无评论阅读模式]  ({scroll_behavior}模式) ")
                    # 关闭列表窗口
                    page.ele('x:/html/body/div[5]/div[2]/div').click()
                    # 隐式等待
                    page.ele('x://*[@class="chat-wrapper"]').wait.hidden(timeout=3)

                    # 当没有评论的时候 这里需写入博文保存
                    return




                # 滑动评论进行翻页
                num = 0
                page_num = 0
                while True:
                    if num ==0:
                        if page_num == 0:
                            page_res = resp_item['page']
                        else:
                            resp = page.listen.wait()  # 等待捕获数据包:ml-citation{ref="1" data="citationList"}
                            page_res = resp
                        if page_res != False:
                            response = page_res.response.body
                            comments = response['data']['comments']
                            for comment in comments:
                                comment_user_name = comment['user_info']['nickname']
                                comment_user_id = comment['user_info']['user_id']
                                comment_user_ip_location = comment['ip_location']
                                sub_comment_cursor = comment['sub_comment_cursor']
                                sub_comment_has_more = comment['sub_comment_has_more']  # 是否有二级评论
                                note_id = comment['note_id']
                                comment_id = comment['id']
                                create_times = comment['create_time']
                                timestamp_s = int(create_times / 1000)
                                date_time = datetime.fromtimestamp(timestamp_s)
                                create_time = date_time.strftime('%Y-%m-%d %H:%M:%S')
                                content = comment['content']
                                print(comment_user_name, comment_user_id, comment_user_ip_location, sub_comment_has_more,
                                      comment_id, create_time, content)

                        down_element = page.ele('x://*[@class="end-container"]')
                        if down_element:
                            print('- THE END -')
                            num = 1
                            continue
                    if num == 1:
                        if page_num <= 1:
                            # 设置随机浏览时常模拟真人
                            scroll_behavior = random.choice(["细读", "快速浏览", "跳过"])
                            if scroll_behavior == "细读":
                                time.sleep(random.uniform(5, 8))
                            elif scroll_behavior == "快速浏览":
                                time.sleep(random.uniform(3, 5))
                            else:
                                time.sleep(random.uniform(1, 3))
                            logger.debug(f"[一页评论阅读模式]  ({scroll_behavior}模式)  当前页面: {page.url}")
                        break

                    page_num += 1
                    Track.scroll_in_container(page, page.ele("@class=note-scroller"))


                time.sleep(random.uniform(0.05, 0.5))
                # 关闭列表窗口
                page.ele('x:/html/body/div[5]/div[2]/div').click()
                # 隐式等待
                page.ele('x://*[@class="chat-wrapper"]').wait.hidden(timeout=3)
                time.sleep(random.uniform(1,2))



    # 模拟鼠标轨迹滑动页面
    def scroll_with_mouse_behavior(self,page):
        # 获取页面初始高度
        initial_height = page.run_js("return document.body.scrollHeight")
        # 设置滑动的总时间，单位为秒
        total_scroll_time = 4
        # 设置滑动的间隔时间范围，单位为秒
        min_interval = 0.1
        max_interval = 0.5
        # 设置滑动的距离范围，单位为像素
        min_scroll_distance = 50
        max_scroll_distance = 300

        # 记录开始时间
        start_time = time.time()
        # 当前滑动的总距离
        total_scrolled_distance = 0

        while True:
            # 计算剩余时间
            remaining_time = total_scroll_time - (time.time() - start_time)
            if remaining_time <= 0:
                break

            # 随机生成滑动距离
            scroll_distance = random.randint(min_scroll_distance, max_scroll_distance)
            # 确保滑动距离不会超过页面剩余高度
            if total_scrolled_distance + scroll_distance > initial_height:
                scroll_distance = initial_height - total_scrolled_distance

            # 随机生成滑动间隔时间
            interval_time = random.uniform(min_interval, max_interval)

            # 执行滑动操作
            page.run_js(f"window.scrollBy(0, {scroll_distance});")
            time.sleep(interval_time)

            # 更新滑动总距离
            total_scrolled_distance += scroll_distance

            # 检查是否已经滑动到底部
            if total_scrolled_distance >= initial_height:
                return None

    def main(self):
        for wd in self.wds:
            self.login()
            url = 'https://www.xiaohongshu.com/search_result?keyword='+wd+'&source=web_search_result_notes'
            self.get_page_list(url)


if __name__ == '__main__':
    xiaohongshu = Xiaohongshu()
    xiaohongshu.main()