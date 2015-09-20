# chmod u+x pi-setup.sh

sudo apt-get clean
sudo apt-get update

# useful packages, needed to run bekkboard
sudo apt-get install -y \
  git \
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

# create a folder where we'll run bekkboard from
mkdir bekkboard

# create a folder well host the bare repo in
mkdir bekkboard.git && cd bekkboard.git
git init --bare
ln -s /home/pi/bekkboard/pi/post-receive /home/pi/bekkboard.git/hooks/post-receive
chmod +x /home/pi/bekkboard.git/hooks/post-receive

# on you personal computer, add a remote to it, and push away!
# git remote add pi pi@bekkpi.local:~/bekkboard.git
# git push pi master

# move back to home
cd

# install node version manager (nvm)
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.26.1/install.sh | bash

# 0.10.28 is the last version with a prebuilt arm-pi binary for node
nvm install v0.10.28

# install bluez 4.101 - https://github.com/sandeepmistry/noble/wiki/Getting-started#linux-specific
wget https://www.kernel.org/pub/linux/bluetooth/bluez-4.101.tar.bz2
tar xvjf bluez-4.101.tar.bz2
cd bluez-4.101
./configure --disable-systemd
make
sudo make install

# install launch-on-boot scripts
cd /etc/init/
sudo ln -s /home/pi/bekkboard/pi/bekkboard-api.conf
sudo ln -s /home/pi/bekkboard/pi/bekkboard-gui.conf

# install start as kiosk mode
cd /etc/xdg/lxsession/LXDE/
sudo ln -sf /home/pi/bekkboard/pi/autostart

# install shortcut to starting the browser, launched by the autostart file
sudo ln -s /home/pi/bekkboard/pi/launch-bekkboard-browser /usr/bin/launch-bekkboard-browser
