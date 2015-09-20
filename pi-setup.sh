# - perform these manually to start the installation
# sudo apt-get clean
# sudo apt-get update
# sudo apt-get install -y git
# git clone https://github.com/bekk/bekkboard
# cd bekkboard
# chmod u+x pi-setup.sh
# ./pi-setup.sh

sudo apt-get install -y \

  vim \

  # node deps
  build-essential \
  openssl \
  libssl-dev \

  # bonjour, so bekkpi.local works
  libnss-mdns \

  # to be able to send f11 to the browser to make it go fullscreen
  xautomation

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

# install node
wget https://nodejs.org/dist/v4.1.0/node-v4.1.0-linux-armv7l.tar.gz
tar -xvf node-v4.1.0-linux-armv7l.tar.gz
cd node-v4.1.0-linux-armv7
sudo cp -R * /usr/local/

# install launch-on-boot scripts
cd /etc/init/
sudo ln -s /home/pi/bekkboard/pi/bekkboard-api.conf
sudo ln -s /home/pi/bekkboard/pi/bekkboard-gui.conf

# install start as kiosk mode
cd /etc/xdg/lxsession/LXDE/
sudo ln -sf /home/pi/bekkboard/pi/autostart

# install shortcut to starting the browser, launched by the autostart file
sudo ln -s /home/pi/bekkboard/pi/launch-bekkboard-browser /usr/bin/launch-bekkboard-browser
