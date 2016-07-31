import random
import ci
import cpm

if __name__ == "__main__":
    ci.makeyun()
    ci.classify()
    for i in range(0,3):

        k = random.choice(cpm.CPM.keys())
        print k
        print ci.method1(cpm.CPM[k],[ci.getrandy(3),ci.getrandy(4),ci.getrandy(5),ci.getrandy(6)])
        print "\n"
