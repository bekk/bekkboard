# chmod u+x pi-setup.sh

# useful packages, needed to run bekkboard
sudo apt-get install \
  chromium-browser \
  ttf-mscorefonts-installer \
  git \
  vim \
  build-essential \
  openssl \
  libssl-dev

# install node version manager (nvm)
curl https://raw.githubusercontent.com/creationix/nvm/v0.17.1/install.sh | bash

nvm install v0.10.32
