# 詞人 Ci-Ren
Generative Chinese poetry.


## Overview
Ci-Ren is a python program for automatically generating Ci, a form of Classical Chinese Poetry.
Using the Markov chain algorithm, the program learns its wording from a database of poems by Song dynasty poets. It then generates a poem conforming to the tonal rules of Ci using Backtracking algorithm.
The goal of this project is to eventually replace poets in their role to write beautiful and expressive poetry.


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
