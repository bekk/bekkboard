# - perform these manually to start the installation
# sudo apt-get clean
# sudo apt-get update
# sudo apt-get install -y git
# git clone https://github.com/bekk/bekkboard
# cd bekkboard
# ./pi-setup.sh

sudo apt-get clean
sudo apt-get update

sudo apt-get install -y vim \
  build-essential \ # node deps
  openssl \
  libssl-dev \
  libnss-mdns \ # bonjour, so bekkpi.local works
  xautomation  # to be able to send f11 to the browser to make it go fullscreen

sudo apt-get install upstart --force-yes

# go to the home folder
cd

# create a folder well host the bare repo in
mkdir bekkboard.git && cd bekkboard.git
git init --bare
ln -s /home/pi/bekkboard/pi/post-receive /home/pi/bekkboard.git/hooks/post-receive
chmod u+x /home/pi/bekkboard.git/hooks/post-receive

# on you personal computer, add a remote to it, and push away!
# git remote add pi pi@bekkpi2.local:~/bekkboard.git
# git push pi master

# go to the home folder
cd

# install node
  # to be able to send f11 to the browser to make it go fullscreen

sudo apt-get install upstart --force-yes

# go to the home folder
cd

# create a folder well host the bare repo in
rm -rf bekkboard.git
mkdir bekkboard.git && cd bekkboard.git
git init --bare
ln -s /home/pi/bekkboard/pi/post-receive /home/pi/bekkboard.git/hooks/post-receive
chmod u+x /home/pi/bekkboard.git/hooks/post-receive

# on you personal computer, add a remote to it, and push away!
# git remote add pi pi@bekkpi2.local:~/bekkboard.git
# git push pi master

# go to the home folder
cd

# install node
# rm node-v4.1.0-linux-armv7l.tar.gz
# rm -rf node-v4.1.0-linux-armv7l
# wget https://nodejs.org/dist/v4.1.0/node-v4.1.0-linux-armv7l.tar.gz
# tar xvfz node-v4.1.0-linux-armv7l.tar.gz
# cd node-v4.1.0-linux-armv7
# sudo cp -R * /usr/local/
rm -r iojs-v2.5.0-linux-armv7l.tar.gz
wget https://iojs.org/dist/v2.5.0/iojs-v2.5.0-linux-armv7l.tar.gz
sudo tar -C /usr/local --strip-components 1 -xzf iojs-v2.5.0-linux-armv7l.tar.gz

# install launch-on-boot scripts
sudo rm -rf /etc/init/bekkboard-api.conf
sudo rm -rf /etc/init/bekkboard-gui.conf

cd /etc/init/
sudo ln -s /home/pi/bekkboard/pi/bekkboard-api.conf
sudo ln -s /home/pi/bekkboard/pi/bekkboard-gui.conf

# install start as kiosk mode
sudo rm -rf /etc/xdg/lxsession/LXDE/autostart
cd /etc/xdg/lxsession/LXDE/
sudo ln -sf /home/pi/bekkboard/pi/autostart

# make folder for epiphany profile
mkdir -p /home/pi/epiphany

# npm install stuff
rm -rf /home/pi/bekkboard/GUI/node_modules
rm -rf /home/pi/bekkboard/server/node_modules
rm -rf /home/pi/bekkboard/hardware/node_modules
cd /home/pi/bekkboard/GUI && npm install
cd /home/pi/bekkboard/server && npm install
cd /home/pi/bekkboard/hardware && npm install

echo "Run this to restart: sudo shutdown -r now"
