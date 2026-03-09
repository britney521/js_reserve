const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;
const fs = require("fs");

// =================配置区域=================
// 🔥 真正的解密函数名 (你在文件里看到的那个函数定义)
const REAL_DECRYPT_FUNC_NAME = 'a0e04adq';



const decryptCode = `
    function a0e04adW() {
        var Sa = ['zxjYB3jZ', 'q2HYB21L', 'y29UC3rYDwn0', 'CMvMzxjLCG', 'DMfSDwvZ', 'z2v0t3DUuhjVCgvYDhLoyw1LCW', 'lcbZAwDUzwrtDhi6', 'C3rHDgu', 'ANnVBG', 'z2v0vg9Rzw5F', 'ChaX', 'ENHJyxnK', 'zxH0zw5K', 'v0vcs0Lux0vyvf90zxH0DxjLx2zPBhrLCL9HBMLZB3rYB3bPyW', 'CMv0DxjU', 'rxzLBNq', 'w29IAMvJDcbpyMPLy3rD', 'igLZig5VDcbPDgvYywjSzq', 'x19Nzw5tAwDUlcbWyxjHBxntDhi6', 'mhGXnG', 'DZi0', 'B25YzwfKExn0yxrLy2HHBMDL', 'x19Yzxf1zxn0rgvWCYbZDgfYDc4', 'iZqYztfHmG', 'ChjVDg90ExbL', 'y2rJx2fKB1fWB2fZBMzHnZzWzMnAtg1JzMXFuhjVBwLZzq', 'mc4XlJC', 'BNvTyMvY', 'qxn5BMngDw5JDgLVBG', 'ChDKDf9Pza', 'v1fFz2f0AgvYx3DNBde', 'zNvUy3rPB250B1n0CMLUzYGPE1TUyxrPDMvJB2rLxx0', 'CMvQzwn0Aw9UAgfUzgXLza', 'q2fUBM90igrLBgv0zsbWCM9Wzxj0Esa', 'igLZig5VDcbHigz1BMn0Aw9U', 'CgfYyw1ZignVBNrHAw5ZihjLC2vYDMvKihbHCMfTig5HBwuU', 'qMfKifbYB21PC2uGy29UC3rYDwn0B3i', 'ChbP', 'sgvHzgXLC3ndAhjVBwu', 'igLZig5VDcbHignVBNn0CNvJDg9Y', 'iLX1zgyWnLX1zdGZnci', 'CMvWBgfJzq', 'yxbWBgLJyxrPB24VEc13D3CTzM9YBs11CMXLBMnVzgvK', 'CMvWBgfJzufSBa', 'Ahr0Chm6lY9Jywn0DxmUAMqUy29Tl3jLCxvLC3rFywXNBW', 'Dg9qCMLTAxrPDMu', 'u3LTyM9SlG', 'zxHWzxjPBwvUDgfSlxDLyMDS', 'uhjVBwLZzsbJyw4NDcbIzsbYzxnVBhzLzcbPDhnLBgy', 'Ahr0Chm6lY9NAxrODwiUy29Tl3PSB2LYB2nRl2nVCMuTANm', 'C3rYAw5N', 'x19WCM90B19F', 'zgvMyxvSDa', 'zw52q29SBgvJDa', 'u3rYAw5NieL0zxjHDg9Y', 'vvrtuLfqt05nteTksuHhrKveq0jblv85odC2ntqZmJeWENL4D3z1DhnYCxbVBM1SA2PPAgDMzwrJyMfAwvHxvG', 'nhWXFdj8nxWWFdz8mW', 'x19Yzxf1zxn0qwXNB3jPDgHTihn0yxj0lG', 'AxnszwDPC3rLCMvKu3LTyM9S', 'yNuY', 'zg9JDw1LBNrfBgvTzw50', 'm3W0Fdb8mNWX', 'AgvHza', 'mxWWFdv8mNWZFdq', 'BwvZC2fNzq', 'Dw5Oyw5KBgvKuMvQzwn0Aw9U', 'CMv2zxjZzq', 'uMvMBgvJDa', 'BM9Uzq', 'qxjYyxK', 'rgf0zq', 'BM9YBwfS', 'Bg9Hza', 'DZiY', 'lY4V', 'ChrFCgLU', 'x19Yzxf1zxn0qwXNB3jPDgHTigvUDKnVBgXLy3q9', 'Dg9Rzw4GAxmGzw1WDhK', 'u3LTyM9SigLZig5VDcbHignVBNn0CNvJDg9Y', 'C29TzxrOAw5N', 'DgLTzw91Da', 'x19TywTLu2LNBIWGCMvZDwX0oG', 'mJrYA25uuxK', 'tNvSBa', 'x19LC01VzhvSzq', 'u3rYAw5N', 'zJnYzhy', 'Dg9mB2nHBgvtDhjPBMC', 'u3LTyM9S', 'CgLU', 'lcbLpq', 'v1fFzhKXx3zR', 'lcbHBgDVoG', 'ChjVy2vZCW', 'x3n0zq', 'qxjNDw1LBNrZ', 'D2vI', 'yNu0', 'DZeW', 'kf58w14', 'yxbWBgLJyxrPB24VANnVBG', 'sw5JB3jYzwn0igLUDM9JyxrPB24', 'zNvUy3rPB25xAw5KB3COkxTBBMf0AxzLy29Kzv19', 'x19Nzw5ezwzHDwX0s2v5igLUChv0pq', 'ntfMsLDzq1u', 'y2fUDMfZ', 'kd86psHBxJTDkIKPpYG7FcqP', 'BM9Kzq', 'mdeYmZq1nJC4owfIy2rLzMDOAwPRBg1UB3bXCNn0Dxz3seLks0XntK9quvjtvfvwv1HzwL8T', 'zNvSzMLSBgvK', 'tM/PQPC', 'kf58icK', 'BwfPBI5ZAwDUi19Fzgv0zwn0Aw5N', 'D2HPDgu', 'lcb0B2TLBJO', 'qujdrevgr0HjsKTmtu5puffsu1rvvLDywvPHyMnKzwzNAgLQA2XTBM9WCxjZDhv2D3H5EJaXmJm0nty3odKRlZ0', 'sLnptG', 'Dw5Zy29WywjSzxm', 'DZe3', 'zgf0ys5Yzxn1BhqGzM9YBwf0igvYCM9YlG', 'z2vUzxjHDguGA2v5igzHAwXLza', 'C3vJy2vZCW', 'CgfYC2vYzxjYB3i', 'C3rHy2S', 'yxn5BMneAxnWB3nL', 'Bwf0y2HLCG', 'CMvQzwn0zwq', 'BwfW', 'x19JB2XSzwn0igvUDKnVBgXLy3q9', 'yNuX', 'DgHLBG', 'lcbFBg9HzgvKx2nHy2HLCZO', 'Ahr0Chm6lY9ZDg9YywDLlJm2mgj1EwLTzY5JB20VD2vIy29UDgfPBMvYl21HAw4VANmTC2vJDxjPDhKTDJmTCMfJlMPZp3y9', 'AxndB25JyxrtChjLywrHyMXL', 'rNvUy3rPB24', 'q29UDgvUDc1uExbL', 'w29IAMvJDcb6xq', 'B2jZzxj2ywjSzq', 'ChjVCgvYDhLjC0vUDw1LCMfIBgu', 'sKrZDf9IzwHHDMLVCL9MBgfN', 'DMfSDwvpzG', 'rvHux3rLEhr1CMvFzMLSDgvYx2fUAxnVDhjVCgLJ', 'A2v5CW', 'vw5Oyw5KBgvKihbYB21PC2uGCMvQzwn0Aw9U', 'DZeX', 'DZiZ', 'sw5JB21WyxrPyMXLihjLy2vPDMvYlca', 'D2vIz2XgCde', 'x19Yzxf1zxn0qwXNB3jPDgHTihjLCxvLC3qGC3vJy2vZCYeSignOzwnRig1LBw9YEsbMCdO', 'DZe2', 'xsSK', 'Bwf0y2HbBgW', 'zg9JDw1LBNq', 'C3bSAwnL', 'qxn5BMnhzw5LCMf0B3jgDw5JDgLVBG', 'Bwv0ywrHDge', 'CMDIysGWlcaWlcaYmdaSidaUnsK', 'C3rYAw5NAwz5', 'BgfZDeLUzgv4t2y', 'Bg9JywXFA2v5xW', 'v0vcr0XFzgvIDwDFCMvUzgvYzxjFAw5MBW', 'C3rYAw5NAwz5igrLDgvJDgLVBG', 'twf4Aw11BsbHBgXVD2vKigLUzgv4igv4y2vLzgvK', 'AxnqCM90B3r5CgvpzG', 'Aw9U', 'Dw5JDa', 'ChvWCgv0zwvY', 'Dw5RBM93BIbLCNjVCG', 'yxr0CLzLCNrLEa', 'D3vYoG', 'x19JB3jLlwPZx3nOyxjLzf9F', 'zgLZCg9Zzq', 'qwnJzxb0', 'C3LTyM9SigrLDgvJDgLVBG', 'q2fUj3qGC2v0ia', 'zMLSDgvY', 'nJbWEcaNtM90igeGCMvHBcbMB250jW', 'q2fUj3qGy2fSBcbTzxrOB2qGB24G', 'y2nU', 'reDcruziqunjsKS', 'B2jQzwn0', 'BMfTzq', 'Dw5PzM9YBu9MzNnLDa', 'twfSzM9YBwvKifvurI04igrHDge', 'x19Yzxf1zxn0qwXNB3jPDgHTt25JzsbRzxK6', 'v1fFz2f0AgvYx2n2mq', 'y2f1C2u', 'lgTLEt0', 'tw96AwXSys81lJaGxcGOlIO/kvWP', 'Dgv4Dc9QyxzHC2nYAxb0', 'C2XPy2u', 'B3aTC3LTyM9SCW', 'CxvLCNLtzwXLy3rVCG', 'C2nYAxb0', 'y2rJx2fKB1fWB2fZBMzHnZzWzMnAtg1JzMXFu3LTyM9S', 'tM8GB25LihbYB21PC2uGCMvZB2X2zwq', 'mc4XlJK', 'BgvUz3rO', 'igLZig5VDcbHihn5BwjVBa', 'nhbjEKDACW', 'lcbJAgvJAYbZDg9YywDLigzWoG', 'Ahr0Chm6lY9NAxrODwiUy29Tl3PSB2LYB2nRl2nVCMuTANmVyMXVyI92mY4ZnI4Xl0Xjq0vou0u', 'AxrLCMf0B3i', 'w25HDgL2zsbJB2rLxq', 'Dw5Oyw5KBgvKCMvQzwn0Aw9U', 'lcbYzxrYEsbUzxH0ihrPBwuU', 'CgfYyw1ZigLZigvTChr5', 'CMv0DxjUihrOAxm', 'Bg9JywXFA2v5xZm', 'zxH0zw5ZAw9UCZO', 'BwfPBI5ZAwDUi19FCMvXDwvZDerLChm', 'C3LTyM9SCW', 'C3LTyM9SlxrVlxn0CMLUzY1YzwDPC3rYEq', 'ywXWAgfIzxrPyW', 'C2nYB2XSsw50B1zPzxDjzK5LzwrLza', 'y29Uy2f0', 'u3LTyM9Ska', 'lcbMCdO', 'D2vIz2W', 'ChvYzq', 'jgnKy19HC2rQzMXHC3v0B3bMAhzJwKXTy2zSxW', 'Bg9HzgvK', 'jgnOCM9Tzv9HC3LUy1nJCMLWDeLUzM8', 'mtG3mJeWmJfqwKfOz2q', 'CMfUzg9T', 'D2L0Ag91DfnLDhrLCG', 'EwvZ', 'CM91BMq', 'DgHYB3C', 'uhjVDg90ExbL', 'cqOlda0GWQdHMOdIGidIGihIGilIGipIGitIGixIGiBIGiFIGiJIGiNIGiRIGk/IGz/JGidIGkJIGkNVU78', 'DZe4', 'CMvQzwn0Aw9UsgfUzgXLza', 'DZeZ', 'x19Yzxf1zxn0rgvWCYbYzxf1zxn0ihrVA2vUigzHAwXLzcWGzxjYB3i6ia', 'yxn5BMnjDgvYyxrVCG', 'AdvZDa', 'pt09', 'mhWXFdr8nxWZFdi', 'igLZig5VDcbHBIbVyMPLy3q', 'y29UzMLNDxjHyMXL', 'DMfSDwu', 'zgL2', 'x19Yzxf1zxn0rgvWCYbLBMqU', 'v1fFzhKXx3rRx2fSz28', 'CgLKoMe', 'zw51BwvYywjSzq', 'CMvXDwvZDcbWyxjHBxmGzxjYB3iU', 'v3jVBMCGBNvTyMvYig9MihjLCgv0AxrPB25Z', 'C3vH', 'C3LTyM9S', 'yxr0CMLIDxrLihzLyZiGyxr0CLzLCNrLEdT2yxj5Aw5NihzLyZiGDMfYEwLUvgv4q29VCMrPBMf0ztT1BMLMB3jTihzLyZiGDw5PzM9YBu9MzNnLDdT2B2LKig1HAw4OkxT2yxj5Aw5uzxHdB29YzgLUyxrLpwf0Dhjwzxj0zxGRDw5PzM9YBu9MzNnLDdTNBf9qB3nPDgLVBJ12zwm0kgf0Dhjwzxj0zxGSmcWXktT9', 'qebPDgvYyxrVCG', 'AMf2yq', 'w29IAMvJDca', 'CMvXDwvZDcbLCNjVCIWG', 'D3v2oG', 'CgfYyw1ZigLZig5VDcbHihbSywLUig9IAMvJDa', 'DxjS', 'CgHHBNrVBwPZ', 'mJy5mtCYouHQC2L1sq', 'Dg9ju09tDhjPBMC', 'xsLB', 'y29TCgXLDgu', 'ieL0zxjHDg9Y', 'tMf0AxzLignYExb0BYbTB2r1BguGy291BgqGBM90igjLihvZzwqGDg8Gz2v0ihnLy3vYzsbYyw5KB20GBNvTyMvYlG', 'DZi1', 'D2vIzhjPDMvY', 'Aw5PDa', 'yNuZ', 'Bwv0ywrHDgflzxK', 'q2fUj3qGy29UDMvYDcbVyMPLy3qGDg8GChjPBwL0AxzLihzHBhvL', 'qwnJzxnZB3jZig5VDcbZDxbWB3j0zwq', 'D2TZ', 'DZe0', 'ihrVA2vUoG', 'uMvNrxHW', 'Dg9tDhjPBMDuywC', 'svq8zxXc', 't2jQzwn0igfSCMvHzhKGAw5PDgLHBgL6zwq', 'ExL5Eu1nzgq', 'DZiX', 'AhrTBgzPBgu', 'zMLSztO', 'z2v0q29TChv0zwrtDhLSzq', 'C2v0', 'zgvZy3jPChrPB24', 'D2vIz2XgCa', 'w3nPz25Dia', 'mdaW', 'w29IAMvJDcbbCNjHEv0', 'y29UC3rYDwn0B3i', 'Aw5JBhvKzxm', 'nhWYFdv8mxWZFda', 'ExL5Eu1nzgrOAg1TC3ntu1m', 'zg9JDw1LBNqUrJ1pyMPLy3q', 'igfZigeGChjVDg90ExbL', 'ns4Y', 'Bg9HzgvYlNv0AwXZi2XVywrsywnty3jPChrpBMnL', 'tu9Ax0vyvf90zxH0DxjLx2zPBhrLCL9HBMLZB3rYB3bPyW', 'mtq3nty2t01xCxzf', 'ndy3ndGZmhDiDgnZCq', 'CgfYyw1ZigLZigvTChr5igfMDgvYigv4y2X1zgLUzYaIDw5ZywzLiIbWyxjHBxm', 'AwzYyw1L', 'z2v0', 'DdzKmgPOCxCZCa', 'CMv0DxjUia', 'Dg9tDhjPBMC', 'D2LUzg93', 'CMvK', 'ndC1odK1nu1cCejVAG', 'Aw5KzxHpzG', 'C2vHCMnO', 'oteXmtjcA09br2e', 'x19Yzxf1zxn0rgvWCYWGx19WyxjZzufSz29YAxrOBsbYzxn1Bhq6', 'yM9VBgvHBG', 'sw52ywXPzcb0Aw1LihzHBhvL', 'r0vu', 'x3n0AW', 'Cgf0DgvYBK1HDgnO', 'ugHHBNrVBuPt', 'mY4ZnI4X', 'AdvFzMLSzv92ns4YlJK', 'jxrLC3rdywzLrhjPDMvYjq', 'tNvTyMvY', 'w251BgXD', 'AgfZt3DUuhjVCgvYDhK', 'BMLK', 'uhjVBwLZzs1JAgfPBIbJEwnSzq', 't2jQzwn0', 'q2fUBM90ihnLDcbYzwfKig9UBhKGlMXLBMD0Aa', 'AgfZsw5ZDgfUy2u', 'qxjYyxKGsxrLCMf0B3i', 'DxnLig5VCM1HBfrVA2vU', 'y2rJx2fKB1fWB2fZBMzHnZzWzMnAtg1JzMXFqxjYyxK', 'C3bLy2LLCW', 'C3bSAxq', 'C29YDa', 'iZfHm2jJmq', 'lcbZDg9YywDLrNa6', 'mtuUnhb4icDbCMLHBcC', 'jMq3ncz5', 'DgvZDcbLCNi', 'AgLKzgvU', 'v2LUzg93', 'x19Yzxf1zxn0rgvWCYb1C2uGzNaSigzWoG', 'suvFufjpve8', 'CMvXDwvZDcb0B2TLBIbMywLSzwqGA2v5oG', 'tM90igvUB3vNAcbHCMD1BwvUDhm', 'D3jPDgfIBgu', 'y2fUDMfZmq', 'DZe5', 'q2fUBM90ignVBNzLCNqGysbtEw1IB2WGDMfSDwuGDg8GysbZDhjPBMC', 'uhjVBwLZzq', 'C3rYAw5NlxrVlxn5BwjVBc1YzwDPC3rYEq', 'qwDNCMvNyxrLrxjYB3i', 'ntK0wwPACKL2', 'x19Yzxf1zxn0rgvWCYbMCM9TignHy2HLlcbLBMqU', 'AgDMzwrJyMfAwvHxvLvuu1jrue9otuXlsKLir0zfrencqs1FotG3nJu0mZiXmhP5EhD2DxrZCNfWB25TBgTQAq', 'C2LNBIbLBgfWC2vKihrPBwuH', 'BM9KztPPBNrLCM5HBc8', 'DZe1', 'ig9Mia', 'mhWXFdr8m3WY', 'mtq3mZK0nu1utMjKva', 'BMv4Da', 'w14/xsO', 'rxjYB3i', 'DZiW', 'lgv4ChjLC3m9', 'ue9tva', 'Bwf0y2G', 'DZeY', 'ChjLy2LZAw9Uig1LzgL1BxaGzMXVyxq7DMfYEwLUzYb2zwmYihzHCNLPBLrLEenVB3jKAw5HDgu7DM9PzcbTywLUkcKGE2DSx0zYywDdB2XVCJ12zwm0khzHCNLPBLrLEenVB3jKAw5HDguSmcWXktT9', 'WQKGmJaXnc0Ymdi0ierLBMLZifb1C2HRyxjLDIaOEMXVAxjVy2SUCNuP', 'C2HHBq', 'iLX1zgvHzci', 'ufiGzMXHy2TZihf1AxOGz3LToIbuvIbesIbIB3GGD2HLBJ8G4PIG', 'AxnxzwXSs25VD25tEw1IB2W', 'mdm4ns0WnY0YnvqWnZOWnJOZos45otLA', 'r2vUzxjHDg9YrNvUy3rPB24', 'B3DUs2v5CW', 'CxvLDwvnAwnYB3rHC2S', 'vgHLig1LDgHVzcbKB2vZBID0igfJy2vWDcbYzwD1BgfYigv4ChjLC3nPB25Z', 'ExL5Es1nts1Kza', 'mNWXFdb8nxW0Fdm', 'x19Nzw5tAwDUrgvMyxvSDcWGCgfYyw1Zu3rYoG', 'zw50CMLLCW', 'y3jLyxrLigLUC3rHBMnLihDPDgGGyxbWswq9'];
        a0e04adW = function() {
            return Sa;
        }
        ;
        return a0e04adW();
    }
        (function(_$W, _$q) {
        var VC = a0e04adq
          , _$j = _$W();
        while (!![]) {
            try {
                var _$w = -parseInt(VC(0x10a)) / (-0x1 * 0x1e71 + 0x17e1 * -0x1 + 0x1 * 0x3653) + -parseInt(VC(0xca)) / (0x10c * -0xd + 0x77c + 0x622) * (-parseInt(VC(0x18b)) / (-0x1d29 + -0x2 * -0xcd7 + -0x95 * -0x6)) + -parseInt(VC(0x1ea)) / (-0x26f8 + 0x3 * -0xc45 + 0x4bcb) * (-parseInt(VC(0xd4)) / (-0x2a * 0x7b + -0x1 * -0x161a + -0x1 * 0x1e7)) + parseInt(VC(0x102)) / (0x1 * 0xb5d + -0x44f + 0xf * -0x78) * (parseInt(VC(0xd7)) / (0xa0a + -0x7af + -0x254)) + -parseInt(VC(0x175)) / (-0xc9 * 0x14 + 0x13f1 + -0x435) * (-parseInt(VC(0xa2)) / (-0x455 + -0x1 * -0x8b + 0x3d3)) + -parseInt(VC(0xcb)) / (-0x6b3 * 0x1 + 0x137d + -0xcc0) + -parseInt(VC(0x202)) / (-0x19f8 + -0xa * 0x228 + 0x2f93);
                if (_$w === _$q)
                    break;
                else
                    _$j['push'](_$j['shift']());
            } catch (_$t) {
                _$j['push'](_$j['shift']());
            }
        }
    }(a0e04adW, -0x16a983 * 0x1 + 0x113b2 + 0x2101ff));
    function a0e04adq(_$W, _$q) {
        var _$j = a0e04adW();
        return a0e04adq = function(_$w, _$t) {
            _$w = _$w - (0x17 * -0x113 + 0xd5 * -0x12 + 0x2848);
            var _$b = _$j[_$w];
            if (a0e04adq.wjQXqe === undefined) {
                var _$E = function(_$I) {
                    var _$X = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
                    var _$a = ''
                      , _$O = '';
                    for (var _$Y = 0x1003 * 0x2 + -0xf * -0xcd + -0x2c09 * 0x1, _$D, _$y, _$i = -0xce8 + -0x1 * -0x21fa + -0x1512; _$y = _$I.charAt(_$i++); ~_$y && (_$D = _$Y % (0x1 * -0xbdb + -0xf4a + 0x11 * 0x199) ? _$D * (0x1b8 + -0xa3 + -0xd5) + _$y : _$y,
                    _$Y++ % (0x2 * 0x4fd + -0xfba + 0x5c4)) ? _$a += String.fromCharCode(0x2184 + -0x3b * -0x76 + -0x3bb7 & _$D >> (-(0x1808 + -0xd96 + 0x538 * -0x2) * _$Y & -0x3c7 + 0x1541 * 0x1 + 0x45d * -0x4)) : 0x38 * 0x5e + -0x3 * 0x4d1 + -0x61d) {
                        _$y = _$X.indexOf(_$y);
                    }
                    for (var _$V = 0x121b + 0xfc8 * -0x2 + 0xd75, _$T = _$a.length; _$V < _$T; _$V++) {
                        _$O += '%' + ('00' + _$a.charCodeAt(_$V).toString(-0x1db * -0x5 + -0x1bfe * -0x1 + -0x2535)).slice(-(0x3 * -0xa9 + -0x4e1 + 0x3 * 0x24a));
                    }
                    return decodeURIComponent(_$O);
                };
                a0e04adq.dTGreA = _$E,
                _$W = arguments,
                a0e04adq.wjQXqe = !![];
            }
            var _$P = _$j[0x1837 * -0x1 + -0x1 * 0xc1b + -0x2452 * -0x1].substring(0x10 * -0x48 + -0x1521 + 0x19a1, -0x1999 + 0x1c84 + -0x2e9)
              , _$h = _$w + _$P
              , _$m = _$W[_$h];
            return !_$m ? (_$b = a0e04adq.dTGreA(_$b),
            _$W[_$h] = _$b) : _$b = _$m,
            _$b;
        }
        ,
        a0e04adq(_$W, _$q);
    }
    global['${REAL_DECRYPT_FUNC_NAME}'] = ${REAL_DECRYPT_FUNC_NAME}
`;



// 3. 输入和输出文件
const INPUT_FILE = 'hs5t.js';      // 源文件
const OUTPUT_FILE = 'hs5t_fixed.js'; // 还原后的文件

// =================逻辑区域=================

// 1. 加载解密函数到当前内存
//    使用 eval 或者 new Function 将解密代码加载到 global 上下文中
//    这样我们就可以在脚本里直接调用 _3klle(0x123) 拿到结果
try {
    eval(decryptCode);
    console.log("✅ 解密环境加载成功！");
} catch (e) {
    console.error("❌ 解密代码加载失败，请检查粘贴的代码是否完整 (缺少变量定义?):", e);
    process.exit(1);
}


// ================= 3. AST 遍历还原 =================

const sourceCode = fs.readFileSync(INPUT_FILE, "utf-8");
const ast = parser.parse(sourceCode, { sourceType: "module" });

// ================= 自动别名分析 =================

// 1. 初始化：放入你知道的那个根解密函数名
const ROOT_FUNC_NAME = 'a0e04adq'; // 这里填你代码里真实的函数名
let targetCallers = new Set([ROOT_FUNC_NAME]);

console.log("🔍 开始自动分析函数别名...");

// 2. 循环扫描，直到没有新别名被发现为止
// (处理链式赋值 var C = B; var B = A; 的情况)
let lastSize = 0;
while (targetCallers.size > lastSize) {
    lastSize = targetCallers.size;

    traverse(ast, {
        // 情况 A: 变量声明 (var T0 = VM)
        VariableDeclarator(path) {
            const { id, init } = path.node;
            // 检查格式: var 变量 = 变量;
            if (t.isIdentifier(init) && t.isIdentifier(id)) {
                // 如果右边的变量(init)是我们已知的解密函数，那左边(id)也是
                if (targetCallers.has(init.name)) {
                    if (!targetCallers.has(id.name)) {
                        console.log(`🔗 发现别名(Decl): var ${id.name} = ${init.name}`);
                        targetCallers.add(id.name);
                    }
                }
            }
        },

        // 情况 B: 赋值表达式 (T0 = VM) - 有些混淆会先定义 var T0; 后赋值
        AssignmentExpression(path) {
            const { left, right } = path.node;
            // 检查格式: 变量 = 变量;
            if (t.isIdentifier(right) && t.isIdentifier(left)) {
                if (targetCallers.has(right.name)) {
                    if (!targetCallers.has(left.name)) {
                        console.log(`🔗 发现别名(Assign): ${left.name} = ${right.name}`);
                        targetCallers.add(left.name);
                    }
                }
            }
        }
    });
}

// 转换为数组供后续使用
const TARGET_CALLERS = Array.from(targetCallers);
console.log("✅ 最终锁定的调用函数列表:", TARGET_CALLERS);

console.log("🔄 开始 AST 遍历与替换...");

let replaceCount = 0;
traverse(ast, {
    CallExpression(path) {
        const { callee, arguments: args } = path.node;

        // 1. 过滤：函数名在目标列表里 (VM, S7...)
        if (t.isIdentifier(callee) && TARGET_CALLERS.includes(callee.name)) {

            // 2. 过滤：参数必须是字面量 (0x123 或 "xxx")
            // 注意：有些混淆是 2 个参数，比如 VM(0x123, 'key')，这里简单处理1个参数的情况
            // 如果你的函数需要2个参数，需要修改这里的逻辑获取 args[1].value
            if (args.length >= 1 && (t.isNumericLiteral(args[0]) || t.isStringLiteral(args[0]))) {

                const arg1 = args[0].value;
                let arg2 = null;
                if (args.length > 1 && t.isStringLiteral(args[1])) {
                    arg2 = args[1].value;
                }

                try {
                    // 🔥【核心修正】：不再 eval(callee.name)，而是强制调用 REAL_DECRYPT_FUNC_NAME
                    // 无论源码写的是 VM(0x1) 还是 S7(0x1)，我们都用 a0e04adq(0x1) 去跑

                    let result;
                    if (args.length === 2) {
                        result = global[REAL_DECRYPT_FUNC_NAME](arg1, arg2);
                    } else {
                        result = global[REAL_DECRYPT_FUNC_NAME](arg1);
                    }

                    // 只有算出字符串才替换
                    if (typeof result === 'string') {
                        console.log(`🔨 [${callee.name}] ${arg1} -> "${result}"`);
                        path.replaceWith(t.stringLiteral(result));
                        replaceCount++;
                    } else if (typeof result === 'number') {
                        path.replaceWith(t.numericLiteral(result));
                        replaceCount++;
                    }

                } catch (err) {
                    // console.log(`⚠️ 计算失败: ${callee.name}(${arg1})`);
                }
            }
        }
    }
});
console.log(`✅ 还原完成，共替换 ${replaceCount} 处。`);

// ================= 还原ob混淆 =================


const { code } = generator(ast, { jsescOption: { minimal: true } });
fs.writeFileSync(OUTPUT_FILE, code, "utf-8");
console.log(`📂 文件已保存为: ${OUTPUT_FILE}`);