[![Stories in Ready](https://badge.waffle.io/bekk/bekkboard.png?label=ready&title=Ready)](https://waffle.io/bekk/bekkboard)
# bekkboard

Statistikk og hardware for å holde orden på score for ping pong bord i Trondheim.

## rfduino
Mappen ``rfduino`` inneholder kode som kjører på de to rfduino enhetene.

Mappen ``Device0`` inneholder kode for enheten som er montert på bordtennisbordet. Denne enheten leser input fra knappene og sender dette videre via Bluetooth.

Mappen ``Host`` inneholder kode for enheten som leser lytter på data fra ``Device0``. Nye verdies skrives til serieporten, og kan dermed enkelt leses av node.js serveren. Du kan og se verdier skrevet til serieport med kommandoen ``screen /dev/tty.usbserial-DC008KBF 9600``.

For å jobbe med rfduino koden må du installere nyeste versjon av Arduino og så legge til rfduino som board. Se [https://github.com/RFduino/RFduino/](https://github.com/RFduino/RFduino/) for detaljer.

## server
Mappen ``server`` inneholder koden for en node.js server som leser data fra refduino Host enheten via serieporten. Den holder og oversikt over pågående kamp, spillere og ranking.

Installer avhengigheter ved å kjøre ``npm install`` i ``server`` mappa. Start serveren ved å kjøre ``npm run start``.

## GUI
Mappen ``GUI`` inneholder brukergrensesnittet som viser pågående kamp. All data informasjon leses fra server API-et.

Installer avhengigheter ved å kjøre ``npm install``i ``GUI``mappa. Starter serveren som hoster GUI-et ved å kjøre ``npm run start``.

## ssh til pi'en

Pien kjører på BEKK trådløsnettet og er tilgjengelig på `pi@bekkpi.local`.

Installer `ssh-copy-id` med `brew install ssh-copy-id`. Kjør `ssh-copy-id pi@bekkpi.local` og skriv passordet som står på pi'en.

Deretter kan du ssh'e inn uten passord.

## Deploy

### gui
```
cd GUI/
# dette bygger frontenden på DIN pc (da pien er sjukt treg) og scp'er det over til pien og restarter gui-serveren
./deploy
```

### server
```
git remote add pi pi@bekkpi.local:~/bekkboard.git
# dette sjekker ut bekkboard-repoet på pien, og kjører npm install i hardware/, GUI/ og server/ mappene.
git push pi master
ssh pi@bekkpi.local sudo restart bekkboard-api
```

## Logger

Både `api` og `gui` serverene logger til `/var/log/`, henholdsvis til `bekkboard-api.log` og `bekkboard-gui.log`.

## Oppstartsscripts på pien

Både `api` og `gui` serverene startes automatisk når pien booter. Oppstartsscripts fins i `/etc/init/bekkboard-api.conf` og `/etc/init/bekkboard-gui.conf`.
