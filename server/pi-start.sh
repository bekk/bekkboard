. /home/pi/.nvm/nvm.sh
cd /home/pi/bekkboard/server
nvm use v0.10.28

node server.js >> /var/log/bekkboard/api.log 2>> /var/log/bekkboard/api.err
