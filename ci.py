# -*- coding: utf-8 -*-
import os
import random
import time
from collections import defaultdict
from dataclasses import dataclass
from typing import Dict, List, Optional

# GLOBAL

_cc = 1

# 四声
yun: Dict[str, List[List[str]]] = {"平": [], "上": [], "去": [], "入": []}

# 平水韵
lines = list(open("db/psy.txt"))

# minimum frequency requirement for characters
poplimit = 40
resultlimit = 30
maxtrial = 200


# 一首词的数据类型
@dataclass
class Poem:
    title: str
    author: str
    intro: str
    content: str
    prop = 1


poems: List[Poem] = []
CT = ""

# 整理平水韵
def makeyun():
    for i in range(len(lines)):
        if "声" in lines[i] and "：" in lines[i]:

            nl = (
                lines[i + 1]
                .replace("[", "@")
                .replace("]", "@")
                .replace("\n", "")
            )
            nl = "".join(
                [nl.split("@")[k] for k in range(0, len(nl.split("@")), 2)]
            )
            nt: List[str] = [nl[k : k + _cc] for k in range(0, len(nl), _cc)]
            yun[lines[i][:_cc]].append(nt)


# 在平水韵里找到一个字的平仄
def lookup(zi: str):
    for i, yuni in yun.items():
        for j in yuni:
            if zi in j:
                return (i, j)
    return None


# 分析数据库每一行信息类型
def linetype(sc: List[str], i: int):
    if "，" in sc[i] and "。" not in sc[i]:
        return "intro"
    if (
        len(sc[i]) <= _cc * 10
        and "全宋词" not in sc[i]
        and "，" not in sc[i]
        and "。" not in sc[i]
    ) or ("（" in sc[i] and len(sc[i]) <= _cc * 20):
        if sc[i - 1] != "\n":
            if len(sc[i - 1]) > _cc * 10 or len(sc[i - 1]) <= _cc * 3:
                return "title"
            else:
                return "intro"
        else:
            return "author"
    else:
        if sc[i] != "\n":
            return "content"
    return False


# 整理全宋词


def classify():
    sc = list(open("db/qsc.txt"))
    currauthor = ""
    for i in range(1, len(sc)):
        if linetype(sc, i) == "author":
            currauthor = sc[i]
        if linetype(sc, i) == "title":
            sci = sc[i].split("（")[0].replace("\n", "")
            con = ""
            intro = ""
            j = i + 1
            while linetype(sc, j) in ["content", "intro"]:
                if linetype(sc, j) == "intro":
                    intro += sc[j]
                if linetype(sc, j) == "content":
                    con += sc[j]
                j += 1
            poems.append(Poem(sci, currauthor, intro, con.replace("\n", "")))


# 一个字符是否是标点符号？
def ispunc(zi: str):
    return zi in {"，", "。", "、", "；", "）"}


# sorting dictionary by value
def sortdict(mydict: Dict):
    return sorted(mydict.items(), key=lambda x: x[::-1], reverse=True)


# 根据一个字猜下一个字
def guessnext(zi: str):
    D = defaultdict(int)
    for p in poems:
        c = p.content
        for i in range(0, len(c), _cc):
            if c[i : i + _cc] == zi and not ispunc(c[i + _cc : i + _cc * 2]):
                x = c[i + _cc : i + _cc * 2]
                D[x] += p.prop
    return D


# 根据一个字猜上一个字
def guesslast(zi: str, foo: str):
    D = defaultdict(int)
    for p in poems:
        c = p.content
        for i in range(0, len(c), _cc):
            if c[i : i + _cc] == zi and i > 0 and not ispunc(c[i - _cc : i]):
                x = c[i - _cc : i]
                D[x] += p.prop
    return D


def guesswithpos(zi, pos, dir):
    D = defaultdict(int)
    for p in poems:
        c = p.content
        for i in range(0, len(c), _cc):
            if (
                c[i : i + _cc] == zi
                and i > 0
                and not ispunc(c[i + dir * _cc : i + _cc + dir * _cc])
            ):
                pis = posinsent(c, i + _cc * dir)
                if midsent(
                    (pos[0] + (dir + 1) / 2) % pos[1], pos[1]
                ) == midsent((pis[0] + (-dir + 1) / 2) % pis[1], pis[1]):
                    x = c[i + dir * _cc : i + _cc + dir * _cc]
                    D[x] += p.prop
    return D


# 从现成词（字符串）中确定某个字在句子中的位置。
def posinsent(c, ind):
    start = 0
    end = len(c)
    for i in range(ind, 0, -_cc):
        if i == 0 or ispunc(c[i - _cc : i]):
            start = i
            break
    for i in range(ind, len(c), _cc):
        if i >= len(c) - 1 or ispunc(c[i : i + _cc]):
            end = i
            break
    return [(ind - start) / _cc, (end - start) / _cc]


# 根据字在句子中的位置判断他是否处于上下句承接处
def midsent(x: int, l: int):
    if x == 0:
        return True
    # 0123-456
    if l == 7 and x == 4:
        return True
    # 01-23-45
    if l == 6 and x in {2, 4}:
        return True
    # 01-234
    if l == 5 and x == 2:
        return True
    # 01-23
    if l == 4 and x == 2:
        return True
    return False


# 字在数据库中出现频率
def popularity(zi: str):
    po = 0
    for p in poems:
        c = p.content
        for i in range(0, len(c), _cc):
            if c[i : i + _cc] == zi:
                po += 1
    return po


# 检查字是否符合格律
def isOK(pai: List, z: str, i: int, yg: List, usedyg: List):
    while lookup(z) is None:
        return False
    lxj0 = lookup(z)[0]

    if (
        lxj0 == "平"
        and pai[i] in ["1", "0"]
        or lxj0 != "平"
        and pai[i] in ["2", "0"]
        and popularity(z) > poplimit / 2
    ):

        return True

    if (
        yg == []
        and int(pai[i]) >= 3
        and (
            (lxj0 == "平" and int(pai[i]) % 2 == 1)
            or (lxj0 != "平" and int(pai[i]) % 2 == 0)
        )
        and popularity(z) > poplimit
    ):
        usedyg.append(z)
        return True

    if (
        yg != []
        and int(pai[i]) >= 3
        and (
            (lxj0 == "平" and int(pai[i]) % 2 == 1)
            or (lxj0 != "平" and int(pai[i]) % 2 == 0)
        )
        and (z in yg)
        and z not in usedyg
        and popularity(z) > poplimit
    ):
        # print z
        # print "".join(usedyg)
        usedyg.append(z)
        return True
    return False


# 重复字出现位置是否合适
def repeatOK(zi, result, output, pai):

    if zi in output:
        for i in range(0, len(output), _cc):
            if output[i : i + _cc] == zi:
                if i != 0:
                    return False

                l = poswithstruct(getstruct(pai), len(result) // _cc)[1]
                if midsent(l - len(output) // _cc, l):
                    return False

    if zi in result:
        for i in range(0, len(result), _cc):

            if result[i : i + _cc] == zi:
                l = poswithstruct(getstruct(pai), len(result) // _cc)[1]
                if (
                    i != len(result) - _cc
                    or l - len(output) / _cc != 0
                    or (len(result) - i) / _cc > 20
                ):
                    return False
    return True


# 返回词牌中每句字数
def getstruct(pai: str):
    a = (
        pai.replace(",", "$")
        .replace(".", "$")
        .replace("`", "$")
        .replace("|", "")
        .replace("*", "")
    )
    b = a.split("$")[:-1]
    return [len(b[i]) for i in range(len(b))]


# 剔除词牌中标点符号
def unmark(pai: str):
    return (
        pai.replace(",", "")
        .replace(".", "")
        .replace("`", "")
        .replace("|", "")
        .replace("*", "")
        .replace("$", "")
    )


# 根据词牌，把标点符号加回一首词中
def mark(pai, ci):
    np = list(pai)
    j = 0
    _i = 0
    for i in range(len(np)):
        _i = i
        if np[i] not in [",", ".", "`", "|", "*"]:

            np[i] = ci[j : j + _cc]
            j += _cc
        elif ci[j : j + _cc] == "":
            i = i + 1
            _i = i
            break
        _i = i
    np = np[:_i]
    np = "".join(np)
    if "*" in np:
        rep = np.split("*")[0].split(".")[-1]
        # print rep
        np = np.replace("*", rep)
    return (
        np.replace(",", "，")
        .replace(".", "。")
        .replace("`", "、")
        .replace("|", "\n")
    )


# 根据韵脚把词牌分成句
def splitbyy(pai: str):
    upai = list(unmark(pai))
    nl: List[str] = []
    ne = ""
    for s in upai:
        ne += s
        if int(s) >= 3:
            nl.append(ne)
            ne = ""
    return nl


# 根据词牌每句字数和某字在词中位置判断该字在句子中位置
def poswithstruct(struct: List[int], ind: int):
    s = 0
    for item in struct:
        s = s + item
        if ind < s:
            return [ind - (s - item), item]


# 填词
def write(pai, ys, dir=-1):

    result = ""
    ygs: List[List[str]] = []
    yg: List[List[str]] = [[]]
    for y in ys:
        ygs.append(lookup(y)[1])
    usedyg = []
    trial = []
    # backtrack 递归部分
    def writeci(pai, col, strict=True):
        time.sleep(0)
        # _=os.system("clear")
        # print mark(PA,result+"".join(output))
        # print col, mark(PA,"".join(output))
        # print "".join(usedyg)

        if col == (len(pai) if dir == 1 else -1):
            return "".join(output)
        elif output[col] != "":
            return writeci(pai, col + dir)
        else:
            # 选韵脚
            if int(pai[col]) >= 3:
                yg[0] = ygs[int(pai[col]) - 3]
                if dir == -1:
                    x = yg[0]
                elif dir == 1:
                    sd = sortdict(
                        guesswithpos(
                            output[col - dir],
                            poswithstruct(
                                getstruct(PA), col - dir + len(result) / _cc
                            ),
                            dir,
                        )
                    )
                    sd = [k for k, v in sd]
                    x = list(set(sd) & set(yg[0]))

            else:
                # 选字
                sd = sortdict(
                    guesswithpos(
                        output[col - dir],
                        poswithstruct(
                            getstruct(PA), col - dir + len(result) / _cc
                        ),
                        dir,
                    )
                )
                # print sd

                nsd = []
                for ss in sd:
                    if len(sd) < 5 or (not strict) or ss[1] > poplimit / 10:
                        nsd.append(ss)

                x = [k for k, v in nsd]
                x = x[: min(len(x), resultlimit)]

                # print "".join(x)
            random.shuffle(x)
            # print len(x)
            # print trial
            for j in range(0, min(len(x), resultlimit)):

                if (not strict) or (
                    isOK(pai, x[j], col, yg[0], usedyg)
                    and repeatOK(x[j], result, "".join(output), PA)
                ):
                    # 填填看
                    trial[col] += 1
                    if dir == 1:
                        # print trial[col]
                        # print strict
                        if trial[col] > maxtrial + 10:
                            # strict = False
                            return None
                        elif trial[col] > maxtrial:

                            strict = False
                        else:
                            pass
                            # strict = True
                    output[col] = x[j]
                    # print strict
                    solution = writeci(pai, col + dir, strict)
                    if solution is not None:
                        return solution

                    if int(pai[col]) >= 3 and x[j] in usedyg:
                        usedyg.remove(x[j])
                    # 填不出，回去重填

                    output[col] = ""
            return None

    PA = pai

    # 填词

    if dir == -1:
        for s in splitbyy(pai):
            output = [""] * (len(s))
            trial = [0] * (len(s))
            nl = writeci(s, len(s) - 1)
            if nl is None:
                return ""

            result += nl
    elif dir == 1:
        # print unmark(pai)
        trial = [0] * (len(unmark(pai)))
        output = [""] * (len(unmark(pai)))
        output[0] = "烂"
        for i in range(len(CT) // _cc):
            if i < len(getstruct(pai)):
                output[sum(getstruct(pai)[:i])] = CT[i * _cc : i * _cc + _cc]
        nl = writeci(unmark(pai), 0)
        if nl is None:
            return ""
        result += nl
    return mark(pai, result)


# 随机选择韵脚
def getrandy(n: int, bounds: Optional[List[int]] = None):
    if bounds is None:
        bounds = [20, 1000]
    ze = yun["上"] + yun["去"] + yun["入"]
    ping = yun["平"]
    pick = ""
    while (
        pick == ""
        or len(lookup(pick)[1]) < bounds[0]
        or len(lookup(pick)[1]) > bounds[1]
    ):

        if n % 2 == 1:
            pick = random.choice(ping)[0]
        if n % 2 == 0:
            pick = random.choice(ze)[0]
    return pick
