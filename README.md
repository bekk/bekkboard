# bekkboard

Statistikk og hardware for å holde orden på score for ping pong bord i Trondheim.

## rfduino

Mappen ``rfduino`` inneholder kode som kjører på de to rfduino enhetene.

Mappen ``Device0`` inneholder kode for enheten som er montert på bordtennisbordet. Denne enheten leser input fra knappene og sender dette videre via Bluetooth.

Mappen ``Host`` inneholder kode for enheten som leser lytter på data fra ``Device0``. Nye verdies skrives til serieporten, og kan dermed enkelt leses av node.js serveren. Du kan og se verdier skrevet til serieport med kommandoen ``screen /dev/tty.usbserial-DC008KBF 9600``.

For å jobbe med rfduino koden må du installere nyeste versjon av Arduino og så legge til rfduino som board. Se [https://github.com/RFduino/RFduino/](https://github.com/RFduino/RFduino/) for detaljer.
