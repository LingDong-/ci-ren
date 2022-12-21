from typing import List, Set
import ci
import random

dzb: List[List[str]] = []


def classifyDZ():
    dzj = list(open("db/dzj.txt"))
    for d in dzj:
        if d != "\n" and "】" not in d:
            d = (
                d.replace("？", "；")
                .replace("（", "@")
                .replace("）", "@")
                .split("@")
            )
            d = "".join(d[k] for k in range(0, len(d), 2))
            d = d.split("。")[:-1]
            for e in d:
                if "；" in e:
                    dzb.append(e.split("；"))
                elif "对" in e:
                    if "，" in e:
                        f = e.split("，")
                        for g in f:
                            dzb.append(g.split("对"))
                    else:
                        dzb.append(e.split("对"))
                else:
                    dzb.append(e.split("，"))


def dui(st: str):
    xls: Set[str] = set()
    for d in dzb:
        for i in range(2):
            if st == d[i]:
                xls.add(d[not i])
            if st in d[i]:
                for j in range(0, len(d[i]), 3):
                    if d[i][j : j + len(st)] == st:
                        xls.add(d[not i][j : j + len(st)])
    return xls


def duiju(st: str) -> List[Set[str]]:
    if st == "":
        return []
    for i in range(len(st), 0, -3):
        d = dui(st[:i])
        if len(d) != 0:
            return [d] + duiju(st[i:])
    return [set()] + duiju(st[3:])
    print(st[:3])

    if ci.lookup(st[:3])[0] == "平":
        randz = ci.getrandy(4)
    else:
        randz = ci.getrandy(3)
    return [set(ci.lookup(randz)[1])] + duiju(st[3:])


def getduiju(st: str):
    r = ""
    a = duiju(st)
    for i in range(len(a)):
        if len(a[i]) == 0:
            if i == 0:
                a[i] = set(ci.lookup(ci.getrandy(random.randint(1, 10)))[1])
            else:
                a[i] = set(ci.guessnext(r[-3:]))
        if len(a[i]) == 0:
            print(st[i * 3 : i * 3 + 3])
        r = r + random.choice(list(a[i]))
    return r


ci.makeyun()
ci.classify()
classifyDZ()

td = "夜月一帘幽梦"
print(td)
print(getduiju(td))
