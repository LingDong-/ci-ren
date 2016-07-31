# -*- coding: utf-8 -*-
import random


# GLOBAL

# 四声
yun = {"平":[],"上":[],"去":[],"入":[]}

# 平水韵
lines = list(open("db/psy.txt"))

# minimum frequency requirement for characters
poplimit = 40

poems = []

# 一首词的数据类型
class Poem():
    def __init__(self,title,author,intro,content,prop=1):
        self.title = title
        self.author = author
        self.intro = intro
        self.content = content
        self.prop = prop


# 整理平水韵
def makeyun():
    for i in range (0, len(lines)):
        if "声" in lines[i] and "：" in lines[i]:

            nl = lines[i+1].replace("[","@").replace("]","@").replace("\n","")
            nl = "".join([nl.split("@")[k] for k in range (0, len(nl.split("@")),2)])
            nt = []
            for k in range(0,len(nl),3):
                nt.append(nl[k:k+3])
            yun[lines[i][0:3]].append(nt)

# 在平水韵里找到一个词的格律
def lookup(zi):
    for i in yun.keys():
        for j in yun[i]:
            if zi in j:
                return [i,j]
    return None


# 分析数据库每一行信息类型
def linetype(sc,i):
    if "，" in sc[i] and not("。" in sc[i]):
        return "intro"
    if (len(sc[i])<=3*10 and "全宋词" not in sc[i] and "，" not in sc[i] and "。" not in sc[i]) or ("（" in sc[i] and len(sc[i])<=3*20):
        if sc[i-1] != "\n":
            if (len(sc[i-1])>3*10 or len(sc[i-1])<=3*3):
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
        if linetype(sc,i) == "author":
            currauthor = sc[i]
        if linetype(sc,i) == "title":
            sci = sc[i].split("（")[0].replace("\n","")
            con = ""
            intro = ""
            j = i+1
            while linetype(sc,j) == "content" or linetype(sc,j) == "intro":
                if linetype(sc,j) == "intro":
                    intro += sc[j]
                if linetype(sc,j) == "content":
                    con += sc[j]
                j += 1
            poems.append(Poem(sci,currauthor,intro,con.replace("\n","")))

# 整理菜谱
def classifyCP():
    sc = list(open("db/cp.txt"))
    for i in range(1,len(sc)):
        if sc[i] != "\n":
            poems.append(Poem("","","",sc[i]))

# 整理党章
def classifyDZH():
    sc = list(open("db/dzh.txt"))
    for i in range(1,len(sc)):
        if sc[i] != "\n":
            poems.append(Poem("","","",sc[i],prop=100))

# 一个字符是否是标点符号？
def ispunc(zi):
    if zi !="，" and zi !="。" and zi !="、" and zi !="；"  and zi !="）":
        return False
    return True

# sorting dictionary by value
def sortdict(mydict):
    return sorted(mydict.iteritems(), key=lambda (k,v): (v,k), reverse = True)

# 根据一个字猜下一个字
def guessnext(zi):
    D = {}
    for p in poems:
        c = p.content
        for i in range(0,len(c),3):
            if c[i:i+3] == zi:
                if not ispunc(c[i-3:i]):
                    x =  c[i+3:i+6]
                    if x not in D:
                        D[x] = 0
                    D[x] += p.prop
    return D

# 根据一个字猜上一个字
def guesslast(zi,foo):
    D = {}
    for p in poems:
        c = p.content
        for i in range(0,len(c),3):
            if c[i:i+3] == zi and i > 0:
                if not ispunc(c[i-3:i]):
                    x =  c[i-3:i]
                    if x not in D:
                        D[x] = 0
                    D[x] += p.prop
    return D

# 根据一个字猜上一个字，并考虑词语在句子中的位置合理性
def guesslastwithpos(zi,pos):
    D = {}
    for p in poems:
        c = p.content
        for i in range(0,len(c),3):
            if c[i:i+3] == zi and i > 0:
                if not ispunc(c[i-3:i]):
                    pis = posinsent(c,i-3)
                    if midsent(pos[0],pos[1]) == midsent((pis[0]+1)%pis[1],pis[1]):
                        x =  c[i-3:i]
                        if x not in D:
                            D[x] = 0
                        D[x] += p.prop
    return D

# 从现成词（字符串）中确定某个字在句子中的位置。
def posinsent(c,ind):
    start = 0
    end = len(c)
    for i in range(ind,0,-3):
        if i == 0 or ispunc(c[i-3:i]):
            start = i
            break
    for i in range(ind,len(c),3):
        if i >= len(c)-1 or ispunc(c[i:i+3]):
            end = i
            break
    if end-start <= 0:
        pass
    return [(ind-start)/3,(end-start)/3]

# 根据字在句子中的位置判断他是否处于上下句承接处
def midsent(x,l):
    if x == 0:
        return True
    # 0123-456
    if l == 7 and x == 4:
        return True
    # 01-23-45
    if l == 6 and (x == 2 or x == 4):
        return True
    # 01-234
    if l == 5 and x == 2:
        return True
    # 01-23
    if l == 4 and x == 2:
        return True
    return False

# 字在数据库中出现频率
def popularity(zi):
    po = 0
    for p in poems:
        c = p.content
        for i in range(0,len(c),3):
            if c[i:i+3] == zi:
                po += 1
    return po


# 检查字是否符合格律
def isOK(pai,z,i,yg,usedyg):
    while lookup(z) == None:
        return False
    lxj0 = lookup(z)[0]

    if (lxj0 == "平" and (pai[i] == "1" or pai[i] == "0")) or\
       (lxj0 != "平" and (pai[i] == "2" or pai[i] == "0")) and popularity(z) > poplimit/2:

       return True

    if yg == [] and int(pai[i]) >= 3 and(
       (lxj0 == "平" and int(pai[i])%2 == 1 ) or\
       (lxj0 != "平" and int(pai[i])%2 == 0 )\
       ) and popularity(z) > poplimit:
       usedyg.append(z)
       return True

    if yg != [] and int(pai[i]) >= 3 and(\
       (lxj0 == "平" and int(pai[i])%2 == 1 ) or\
       (lxj0 != "平" and int(pai[i])%2 == 0 )\
       ) and(\
       z in yg\
       ) and z not in usedyg and popularity(z) > poplimit:
       #print z
       #print "".join(usedyg)
       usedyg.append(z)
       return True
    return False

# 重复字出现位置是否合适
def repeatOK(zi,result,output,pai):

    if zi in output:
        for i in range(0,len(output),3):
            if output[i:i+3] == zi:
                if i != 0 :
                    return False

                l = poswithstruct(getstruct(pai),len(result)/3)[1]
                if midsent(l-len(output)/3,l):
                    return False

    if zi in result:
        for i in range(0,len(result),3):

            if result[i:i+3] == zi:
                l = poswithstruct(getstruct(pai),len(result)/3)[1]
                if (not (i == len(result)-3 and l-len(output)/3 == 0)) or (len(result)-i)/3>20:
                    return False
    return True

# 返回词牌中每句字数
def getstruct(pai):
    a = pai.replace(",","$").replace(".","$").replace("`","$").replace("|","").replace("*","")
    b = a.split("$")[0:-1]
    return [len(b[i]) for i in range(0,len(b))]

# 剔除词牌中标点符号
def unmark(pai):
    return pai.replace(",","").replace(".","").replace("`","").replace("|","").replace("*","").replace("$","")

# 根据词牌，把标点符号加回一首词中
def mark(pai,ci):
    np = list(pai)
    j = 0
    for i in range(0,len(np)):
        if np[i] not in [",",".","`","|","*"]:
            np[i] = ci[j:j+3]
            j += 3

    np = ("".join(np))
    if "*" in np:
        rep = np.split("*")[0].split(".")[-1]
        #print rep
        np = np.replace("*",rep)
    np = np.replace(",","，").replace(".","。").replace("`","、").replace("|","\n")
    return np

# 根据韵脚把词牌分成句
def splitbyy(pai):
    upai = list(unmark(pai))
    nl = []
    ne = ""
    for s in upai:
        ne += s
        if int(s) >= 3:
            nl.append(ne)
            ne = ""
    return nl

# 根据词牌每句字数和某字在词中位置判断该字在句子中位置
def poswithstruct(struct,ind):
    s = 0
    for i in range(0,len(struct)):
        s = s + struct[i]
        if ind < s:
            return [ind - (s - struct[i]), struct[i]]

# 从后往前填词法
def method1(pai,ys):
    result = ""
    ygs = []
    yg = [[]]
    for y in ys:
        ygs.append(lookup(y)[1])
    usedyg = []

    # backtrack 递归部分
    def writeci(pai,col):

        if col == -1:
            return "".join(output)
        else:
            # 选韵脚
            if int(pai[col])>= 3:
                yg[0] = ygs[int(pai[col])-3]
                x = yg[0]
            else:
                # 选字
                sd = sortdict(guesslastwithpos(output[col+1],
                                            poswithstruct(getstruct(PA),col+1 + len(result)/3)))
                nsd = []
                for ss in sd:
                    if ss[1] > poplimit/10:
                        nsd.append(ss)

                x = [k for k,v in nsd]
                x = x[0:min(len(x),30)]

            random.shuffle(x)

            for j in range(0,min(len(x),30)):

                if isOK(pai,x[j],col,yg[0],usedyg) and repeatOK(x[j],result,"".join(output),PA):
                    # 填填看
                    output[col] = x[j]

                    solution = writeci(pai,col-1)
                    if (solution != None):
                        return solution

                    # 填不出，回去一个字重新填
                    output[col] = ""
            return None
    PA = pai

    # 把填出来的句子粘到一起
    for s in splitbyy(pai):
        output = [""]*len(s)

        nl = writeci(s,len(s)-1)
        if nl == None:
            return ""

        result+=nl
    return mark(pai,result)

# 随机选择词牌
def getrandy(n,bounds=[20,1000]):
    ze = yun["上"]+yun["去"]+yun["入"]
    ping = yun["平"]
    pick = ""
    while pick == "" or len(lookup(pick)[1])<bounds[0] or len(lookup(pick)[1])>bounds[1]:

        if n%2 == 1:
            pick = random.choice(ping)[0]
        if n%2 == 0:
            pick = random.choice(ze)[0]
    return pick
