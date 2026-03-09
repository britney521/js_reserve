import random
import time
from abc import ABC
from DrissionPage import WebPage
from DrissionPage._elements.chromium_element import ChromiumElement
from loguru import logger


class Track(ABC):
    SCROLL_BEHAVIOR = {
        "hover_chance": 0.6,
        "scroll_back_chance": 0.05,  # 极大减少向上滚动的概率
        "scroll_range": (500, 2000),  # 大幅增加向下滚动的距离范围
        "min_pause": 0.05,  # 进一步减少最小停顿时间
        "max_pause": 0.2  # 进一步减少最大停顿时间
    }

    @classmethod
    def scroll_in_container(cls, page: WebPage, target_scroll_ele: ChromiumElement):
        scroll_ele_rect = target_scroll_ele.rect.viewport_corners
        [zsx, zsy] = scroll_ele_rect[0]
        [yxx, yxy] = scroll_ele_rect[-2]
        container_height = yxy - zsy

        logger.debug(f"[轨迹] 当前页面: {page.url}")

        if cls._should_hover():
            cls._hover_mouse(zsx, yxx, zsy, container_height, page)

        # 增加多次滚动逻辑，确保页面被充分滚动
        for _ in range(3):  # 每次调用 _scroll_in_segments 都会滚动一大段距离
            scroll_distance = cls._choose_scroll_distance()
            cls._scroll_in_segments(page, target_scroll_ele, scroll_distance)
            after_scroll_pause = cls._calculate_pause_time(scroll_distance)
            logger.debug(f"[轨迹] 滚动后暂停: {after_scroll_pause:.1f}秒")
            time.sleep(after_scroll_pause)

        cls._ensure_element_in_viewport(page, target_scroll_ele)

        if random.random() < 0.35:
            adjustment = random.randint(-50, 50)
            adjust_js = f"document.querySelector('{target_scroll_ele.css_path}').scrollTop += {adjustment};"
            page.run_js(adjust_js)
            logger.debug(f"[轨迹] 微调滚动位置: {adjustment}px")

    @classmethod
    def _should_hover(cls):
        return random.random() < cls.SCROLL_BEHAVIOR["hover_chance"]

    @classmethod
    def _hover_mouse(cls, zsx, yxx, zsy, container_height: int, page: WebPage):
        hover_x = random.uniform(zsx + 50, yxx - 50)
        hover_y = random.uniform(zsy + container_height * 0.2, zsy + container_height * 0.7)
        page.actions.move_to((hover_x, hover_y), duration=random.uniform(0.1, 0.2))  # 进一步减少鼠标移动时间
        hover_time = random.uniform(0.05, 0.1)  # 进一步减少鼠标停留时间
        time.sleep(hover_time)

    @classmethod
    def _choose_scroll_distance(cls):
        if random.random() < cls.SCROLL_BEHAVIOR["scroll_back_chance"]:
            return -random.randint(50, 100)  # 极大减少向上滚动的距离
        return random.randint(500, 2000)  # 大幅增加向下滚动的距离

    @classmethod
    def _scroll_in_segments(cls, page: WebPage, target_scroll_ele: ChromiumElement, scroll_distance: int):
        is_long_scroll = abs(scroll_distance) > 1000
        if is_long_scroll:
            # 对于长滚动，分两段进行
            first_part = scroll_distance * random.uniform(0.6, 0.8)
            second_part = scroll_distance - first_part
            segments = [first_part, second_part]
        else:
            # 对于短滚动，直接一次性完成
            segments = [scroll_distance]

        for segment in segments:
            scroll_js = cls._create_natural_scroll_js(target_scroll_ele.css_path, segment, random.randint(200, 300))  # 减少滚动动画时间
            page.run_js(scroll_js)
            time.sleep(random.uniform(0.05, 0.1))  # 减少分段停顿时间

    @classmethod
    def _calculate_pause_time(cls, scroll_distance):
        base_pause = random.uniform(cls.SCROLL_BEHAVIOR["min_pause"], cls.SCROLL_BEHAVIOR["max_pause"])
        if abs(scroll_distance) < 500:
            base_pause *= 0.5
        return base_pause

    @classmethod
    def _ensure_element_in_viewport(cls, page: WebPage, target_scroll_ele: ChromiumElement):
        show_more_selector = ".show-more"
        if (show_more_ele := page.ele(show_more_selector)) and show_more_ele.states.is_whole_in_viewport:
            max_attempts = 3
            for attempt in range(max_attempts):
                in_viewport = page.run_js(f'''
                    (function() {{
                        const ele = document.querySelector('{show_more_selector}');
                        if (!ele) return false;
                        const rect = ele.getBoundingClientRect();
                        return (
                            rect.top >= 0 &&
                            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
                        );
                    }})();
                ''')
                if in_viewport:
                    logger.debug("[轨迹] .show-more 元素已进入视口")
                    break
                else:
                    extra_scroll = cls._create_natural_scroll_js(target_scroll_ele.css_path,
                                                                 distance=random.randint(150, 300),
                                                                 duration=random.randint(200, 300))
                    page.run_js(extra_scroll)
                    time.sleep(random.uniform(0.05, 0.1))

    @staticmethod
    def _create_natural_scroll_js(element_selector, distance, duration):
        return f"""
        (function() {{
            const element = document.querySelector('{element_selector}');
            if (!element) return false;

            const startPos = element.scrollTop;
            const startTime = performance.now();
            const duration = {duration};
            const distance = {distance};

            const easeMode = Math.random() < 0.7 ? 'smooth' : 'quickStart';

            function scrollStep(timestamp) {{
                const elapsed = timestamp - startTime;
                let progress = Math.min(elapsed / duration, 1);

                if (easeMode === 'smooth') {{
                    progress = progress < 0.5 
                        ? 2 * progress * progress 
                        : -1 + (4 - 2 * progress) * progress;
                }} else {{
                    progress = 1 - Math.pow(1 - progress, 2);
                }}

                const jitter = (Math.random() - 0.5) * 2;
                const adjustedProgress = Math.max(0, Math.min(1, progress + jitter * 0.01));

                element.scrollTop = startPos + (distance * adjustedProgress);

                if (elapsed < duration) {{
                    requestAnimationFrame(scrollStep);
                }}
            }}

            requestAnimationFrame(scrollStep);
            return true;
        }})();
        """