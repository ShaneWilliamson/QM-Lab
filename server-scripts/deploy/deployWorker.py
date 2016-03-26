import time
import os
import sys
import signal
from subprocess import call

#The routine to run, every hour it pulls from GitHub
#This causes everything in the src folder to be put on display on the webserver
def start():
  #Using global variables branchName, repoPath, webPath
  #
  #branchName contains the argument passed to this script, which is the name of the desired
  #  branch for deployment.
  #repoPath contains the new path where we will store our targeted branch for deployment.
  #  This targeted branch will be stored as its own repository in a subdirectory of where all
  #  the deployed branches are kept. (inside /home/shared/QM_Lab_Repos/)
  #webPath is the new path to where we are actually deploying to inside the server. We will
  #  copy our src/ and doc/js_docs/ folders into this path.
  global branchName
  global repoPath
  global webPath
  #If we do not have correct input amount
  if len(sys.argv) != 2:
    #Improper input, we need exactly 1 additional argument to the script.
    #  - Additional argument: name of new branch to pull the VM's page
    sys.exit()

  #Otherwise it's business as normal; assign to the global variables
  branchName = str(sys.argv[1])
  repoPath = "/home/shared/QM-Lab_Repos/" + branchName + "/"
  webPath = "/var/www/html/" + branchName + "/"
  #This should execute the pull into the shared directory folder
  #Set up the branch repository
  setupBranch()

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
  #As well, copy new /doc/js_docs/ contents into webPath
  call(["cp", "-r", repoPath + "QM-Lab/doc/js_docs/", webPath])

# Routine to create a new directory in /var/www/html/ based on input
def setupBranch():
  #Global vars
  global branchName
  global repoPath
  global webPath
  #First make sure that the top level set of repos exist.
  call(["mkdir", "-p", repoPath])
  #If the working directory is not empty... make it empty!
  if os.listdir(repoPath) != []:
    call(["rm", "-rf", repoPath])
    #Remake the directory
    call(["mkdir", "-p", repoPath])
  #Change our working directory to the path
  os.chdir(repoPath)
  #Clone the remote repo
  call(["git", "clone", "https://371GitBot:gitbot371@github.com/ShaneWilliamson/QM-Lab.git"])
  #Move into the repo
  os.chdir(repoPath + "/QM-Lab")
  #Checkout the desired branch
  call(["git", "checkout", branchName])
  call(["mkdir", "-p", webPath])
  #If the working directory is not empty... make it empty!
  if os.listdir(webPath) != []:
    call(["rm", "-rf", webPath])
    #Remake the directory
    call(["mkdir", "-p", webPath])


#Executes the clean up routine for both the stored repository on the testing server, and the
#  deployed sections on the public space of the server.
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

def interruptRoutine():
  #Global vars
  global repoPath
  global webPath
  if repoPath != "" and webPath != "":
    print("Interrupt received, cleaning up...")
    cleanUp()
    print("Clean up complete, exiting program.")
  else:
    print("Interrupt received, exiting program.")

try:
  #Run the program until a keyboard interrupt or a terminate signal is caught.
  
  #Sets the handler for a SIGTERM signal to be the interruptRoutine function.
  signal.signal(signal.SIGTERM, interruptRoutine)
  start()
except KeyboardInterrupt:
  interruptRoutine()