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
  xautomation \ # to be able to send f11 to the browser to make it go fullscreen
  epiphany

sudo apt-get install upstart --force-yes

# to name `serialport` work on node 4 on the pi
sudo apt-get install gcc-4.8 g++-4.8
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.6 20
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.8 50
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.6 20
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.8 50

# go to the home folder
cd

# create a folder well host the bare repo in
mkdir -p bekkboard.git && cd bekkboard.git
git init --bare
ln -s /home/pi/bekkboard/pi/post-receive /home/pi/bekkboard.git/hooks/post-receive
chmod u+x /home/pi/bekkboard.git/hooks/post-receive

# on you personal computer, add a remote to it, and push away!
# git remote add pi pi@bekkpi2.local:~/bekkboard.git
# git push pi master

# go to the home folder
cd

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

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash
source ~/.nvm/nvm.sh
NODE=4.2.2
nvm install $NODE
nvm alias default $NODE

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
sudo rm -rf /etc/xdg/lxsession/LXDE-pi/autostart
cd /etc/xdg/lxsession/LXDE-pi/
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
