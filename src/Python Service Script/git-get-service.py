import time
import os
import sys
from subprocess import call

#The routine to run, every 120 seconds it pulls from GitHub
def start():
  #This should execute the pull into the shared directory folder
  var repoPath = "/home/shared/QM-Lab_Repo"
  if len(sys.argv) == 2:
    displayBranchOnVM(str(sys.argv[1]))
  #First make sure that the top level set of repos exist.
  call(["mkdir", "-p", repoPath])
  os.chdir(repoPath)
  while True:
    gitPull()
    time.sleep(120)

def gitPull():
  call(["git", "pull"])
 
# TODO: routine to create a new directory in /var/www/html/ based on input
def displayBranchOnVM(branchName, curPath):
  #TODO: call([])
  return curPath + "/" + branchName


start()