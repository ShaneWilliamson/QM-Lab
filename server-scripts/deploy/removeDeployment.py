import sys
from subprocess import call

#The routine to run
#This causes everything deployed for a branch to be removed.
def start():
  global repoPath
  global webPath
  branchName = ""
  #Get user input on which deployed branch to remove.
  flag = 0
  while flag == 0:
    #Init values
    promptFlag = 0
    response = 'n'
    #Prompt the user for which branch they want to remove.
    branchName = raw_input('Which deployed branch do you wish to remove? ')
    while promptFlag == 0:
      response = raw_input(''.join('Is ' + branchName + ' correct? (y/n, or exit) '))
      if response == 'y' or response == 'n':
        promptFlag = 1
      elif response == 'exit':
        sys.exit()
      else:
        print('You dun goofed on your typing, please try again.')
    #If the user has accepted the input, try and pull this shiz.
    if response == 'y':
      flag = 1

  #Set the path to the deployed repository and branch
  repoPath = "/home/shared/QM-Lab_Repos/" + branchName + "/"
  webPath = "/var/www/html/" + branchName + "/"
  #Now execute the removal script
  cleanUp()

#Executes the clean up routine for both the stored repository on the testing server, and the
#  deployed sections on the public space of the server.
def cleanUp():
  #Kill the target screen running the deployment
  call(["sudo", "screen", "-X", "-S", branchName, "kill"])
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

start()
