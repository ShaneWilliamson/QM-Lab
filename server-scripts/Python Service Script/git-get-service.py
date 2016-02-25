import time
import os
import sys
from subprocess import call

#The routine to run, every 120 seconds it pulls from GitHub
#This causes everything in the src folder to be put on display on the webserver
def start():
  if len(sys.argv) != 2:
    #Improper input, we need exactly 1 additional argument to the script.
    #  - Additional argument: name of new branch to pull the VM's page
    sys.exit()

  #This should execute the pull into the shared directory folder
  repoPath = "/home/shared/QM-Lab_Repos/" + str(sys.argv[1])
  #Otherwise it's business as normal
  #Set up the branch repository
  webPath = setupBranch(repoPath, str(sys.argv[1]))

  #Pre Condition: directories set up, content is on webpage

  #Loop forever!
  while True:
    gitPull()
    pushContentToWeb(repoPath + "/QM-Lab/", webPath)
    time.sleep(120)

def gitPull():
  call(["git", "pull"])

def pushContentToWeb(curPath, targetPath):
  #Delete the contents of targetPath
  call(["rm", "-rf", targetPath + "/*"])
  #Copy new src/ contents into targetPath
  call(["cp", curPath + "src/*", targetPath])

# Routine to create a new directory in /var/www/html/ based on input
def setupBranch(newPath, branchName):
  #First make sure that the top level set of repos exist.
  call(["mkdir", "-p", newPath])
  #If the working directory is not empty... make it empty!
  if os.listdir(newPath) != []:
    call(["rm", "-rf", newPath])
    #Remake the directory
    call(["mkdir", "-p", newPath])
  #Change our working directory to the path
  os.chdir(newPath)
  #Clone the remote repo
  call(["git", "clone", "https://371GitBot:gitbot371@github.com/ShaneWilliamson/QM-Lab.git"])
  #Move into the repo
  os.chdir(newPath + "QM-Lab")
  #Checkout the desired branch
  call(["git", "checkout", branchName])
  #Set up the webpage directory:
  webPath = "/var/www/html/demo/" + branchName
  call(["mkdir", "-p", webPath])
  #If the working directory is not empty... make it empty!
  if os.listdir(webPath) != []:
    call(["rm", "-rf", webPath])
    #Remake the directory
    call(["mkdir", "-p", webPath])
  return webPath


start()