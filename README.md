# 詞人 Ci-Ren
Generative Chinese poetry.


## Overview
Ci-Ren is a python program for automatically generating Ci, a form of Classical Chinese Poetry.<br><br>
Using the Markov chain algorithm, the program learns its grammar and vocabulary from a database of poems by Song Dynasty poets. It then generates a poem conforming to the tonal rules of Ci using Backtracking algorithm.


## Example Output
蝶恋花<br>
指点绛纱窗户悄，苔院重来、只有燕娇小。光欲送将游倦鸟，杳无双鬓霜风袅。<br>
襟泪流年人窈窕，芳酒殷勤、为作新音少。愁对横江波浩渺，六千翠幕轻飞绕。<br><br>
浣溪沙<br>
正是少留残酒醒，分吴兴佐鼎调停。香红妆映烛荧荧。<br>
意气与人看鹤舞，衣香七十载刘伶。水横孤映小蜻蜓。<br>


## Dependencies
- Python 2
- Pypy (recommanded)


## How to run
In terminal, type:
```bash
$ cd path/to/ci-ren
$ python main.py
```
or, if using pypy,
```bash
$ pypy main.py
```
Currently generating a poem with python takes around a minute, and with pypy around 3 seconds.



## To-do
- Web version with GUI
- Speed optimization
- User interaction
