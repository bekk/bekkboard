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

  # bluetooth deps
  bluetooth \
  bluez-utils \
  blueman \

  # noble deps
  libglib2.0-dev \
  libdbus-1-dev \
  libusb-dev \
  libudev-dev \
  libical-dev \
  libreadline-dev \

  # bonjour, so bekkpi.local works
  libnss-mdns

sudo apt-get install upstart --force-yes

# install node version manager (nvm)
curl https://raw.githubusercontent.com/creationix/nvm/v0.17.1/install.sh | bash

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
