# -*- coding: utf-8 -*-
import random
import ci
import cpm

if __name__ == "__main__":
    ci.makeyun()
    ci.classify()
    for _ in range(3):
        k = random.choice(list(cpm.CPM.keys()))
        print(k)
        print(ci.write(cpm.CPM[k],[ci.getrandy(3),ci.getrandy(4),ci.getrandy(5),ci.getrandy(6)],-1))
        print("\n")
