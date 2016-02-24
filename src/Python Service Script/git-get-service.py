import time
import os
from subprocess import call

#The routine to run, every 120 seconds it pulls from GitHub
def start():
  #This should execute the pull into the shared directory folder
  os.chdir("/home/saw056/QM-Lab")
  while True:
    gitPull()
    time.sleep(120)

def gitPull():
  call(["git", "pull", "https://371GitBot:gitbot371@github.com/ShaneWilliamson/QM-Lab.git"])

start()