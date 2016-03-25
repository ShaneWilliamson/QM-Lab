import sys
from subprocess import call

#The routine to run, every hour it pulls from GitHub
#This causes everything in the src folder to be put on display on the webserver
def start():
  global branchName

  #Get user input on which branch to deploy.
  flag = 0
  while flag == 0:
    #Init values
    promptFlag = 0
    response = 'n'
    #Prompt the user for which branch they want to deploy.
    branchName = raw_input('Which branch do you wish to deploy? ')
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

  #Now execute the deployment script
  call(['sudo', 'screen', '-dmS', branchName, 'python', 'deployWorker.py', branchName])
  print("To connect to the session run 'sudo screen -r " + branchName + "'.")

start()
