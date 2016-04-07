sudo apt-get purge nodejs npm
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm cache clean -g # cleaning global cache
sudo npm cache clean # clean cache in project
sudo rm -rf node_modules # remove project node modules
