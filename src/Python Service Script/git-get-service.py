import time
import os
import git
from subprocess import call

#The routine to run, every 120 seconds it pulls from GitHub
def start():
  #This should execute the pull into the shared directory folder
  os.chdir("/home/shared/QM-Lab_Repo")
  while True:
    gitPull()
    time.sleep(120)

def gitPull():
  call(["git", "pull"])
 

start()