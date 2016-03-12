import time
import os
import sys
from subprocess import call

#The routine to run, every hour it pulls from GitHub
#This causes everything in the src folder to be put on display on the webserver
def start():
  #Using global variables repoPath, webPath
  global repoPath
  global webPath
  #If we do not have correct input amount
  if len(sys.argv) != 2:
    #Improper input, we need exactly 1 additional argument to the script.
    #  - Additional argument: name of new branch to pull the VM's page
    sys.exit()

  #Otherwise it's business as normal; assign to the global variables
  repoPath = "/home/shared/QM-Lab_Repos/" + str(sys.argv[1]) + "/"
  webPath = "/var/www/html/demo/" + str(sys.argv[1]) + "/"
  #This should execute the pull into the shared directory folder
  #Set up the branch repository
  setupBranch(repoPath, str(sys.argv[1]))

  #Pre Condition: directories set up, content is on webpage

  #Loop forever!
  while True:
    gitPull()
    pushContentToWeb()
    time.sleep(3600)


def gitPull():
  call(["git", "pull"])


def pushContentToWeb():
  #Global vars
  global repoPath
  global webPath
  #Delete the contents of webPath
  cleanUpWebPath()
  call(["mkdir", "-p", webPath])
  #Copy new src/ contents into webPath
  call(["cp", "-r", repoPath + "QM-Lab/src/", webPath])


# Routine to create a new directory in /var/www/html/ based on input
def setupBranch(newPath, branchName):
  #Global vars
  global webPath
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
  os.chdir(newPath + "/QM-Lab")
  #Checkout the desired branch
  call(["git", "checkout", branchName])
  call(["mkdir", "-p", webPath])
  #If the working directory is not empty... make it empty!
  if os.listdir(webPath) != []:
    call(["rm", "-rf", webPath])
    #Remake the directory
    call(["mkdir", "-p", webPath])


def cleanUp():
  cleanUpRepoPath()
  cleanUpWebPath()


def cleanUpRepoPath():
  #Global vars
  global repoPath
  #Clean up the repository
  call(["rm", "-rf", repoPath])


def cleanUpWebPath():
  #Global vars
  global webPath
  #Clean up the apache directory
  call(["rm", "-rf", webPath])


try:
  #Run the program until a keyboard interrupt is caught.
  start()
except KeyboardInterrupt:
  #Global vars
  global repoPath
  global webPath
  if repoPath != "" and webPath != "":
    print("Interrupt received, cleaning up...")
    cleanUp()
    print("Clean up complete, exiting program.")
  else:
    print("Interrupt received, exiting program.")