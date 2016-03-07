#!/bin/bash

# Following the guide found at this page
# http://programmingarehard.com/2014/03/17/behat-and-selenium-in-vagrant.html

echo "\r\nUpdating system ...\r\n"
sudo apt-get update


# Create folder to place selenium in
#
echo "\r\nCreating folder to place selenium in ...\r\n"
sudo mkdir ~/selenium
cd ~/selenium


# Get Selenium and install headless Java runtime
#
echo "\r\nInstalling Selenium and headless Java runtime ...\r\n"
sudo wget http://selenium-release.storage.googleapis.com/2.52/selenium-server-standalone-2.52.0.jar
sudo apt-get -y install openjdk-8-jre-headless


# Install Firefox
#
echo "\r\nInstalling Firefox ...\r\n"
sudo apt-get -y install firefox

# Install Chrome
#
echo "\r\nInstalling Chrome ...\r\n"
sudo apt-get install -y libappindicator1 fonts-liberation
sudo wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome*.deb

# Install headless GUI for firefox.  'Xvfb is a display server that performs graphical operations in memory'
#
echo "\r\nInstalling XVFB (headless GUI for Firefox) ...\r\n"
sudo apt-get -y install xvfb
sh -e /etc/init.d/xvfb start


# Finally, starting up Selenium server
#
echo "\r\nStarting up Selenium server ...\r\n"
DISPLAY=:1 xvfb-run java -jar ~/selenium/selenium-server-standalone-2.52.0.jar &