. /home/pi/.nvm/nvm.sh
cd /home/pi/bekkboard/GUI
nvm use v0.10.28

npm run start-prod >> /var/log/bekkboard/gui.log 2>> /var/log/bekkboard/gui.err
