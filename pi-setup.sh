# chmod u+x pi-setup.sh

# useful packages, needed to run bekkboard
sudo apt-get install \
  chromium-browser \
  ttf-mscorefonts-installer \
  git \
  vim \
  build-essential \
  openssl \
  libssl-dev \
  bluetooth \
  bluez-utils \
  blueman

# install node version manager (nvm)
curl https://raw.githubusercontent.com/creationix/nvm/v0.17.1/install.sh | bash

# 0.10.28 is the last version with a prebuilt arm-pi binary for node
nvm install v0.10.28
