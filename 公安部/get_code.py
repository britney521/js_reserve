import ddddocr


def recognize(path):
    ocr = ddddocr.DdddOcr()
    with open(path, 'rb') as f:
        img_bytes = f.read()
    res = ocr.classification(img_bytes)
    print(res)
    return res