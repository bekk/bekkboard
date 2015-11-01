name: head
class: center, middle, inverse
---
template: head
# Internet-enabled bordtennisbord
## Fagdag 6. nov - HANDS ON
### [github.com/bekk/bekkboard](https://github.com/bekk/bekkboard)

---
template: head
class: left
# Agenda
## - Komponenter
## - Kode
## - Demo
## - Idemyldring
## - ..HANDS ON!
---
template: head
# Komponenter
---

# Komponenter

TODO bilde
https://www.lucidchart.com/invitations/accept/a552ed26-cc39-46ae-a059-e95c9f01e212

???
eirik foklarer

- Hardware (hw)
- server
- GUI

---
template: head
# Kode
---

# Kode

## RFduino (nesten Arduino)

TODO bilde

### - `setup()`
### - `loop()`

???
- vis arduino-koden

---

# Kode

## Server

### - javascript, node.js
### - node-serialport
### - express
### - SSE

TODO versjon: iojs....)

---

# Kode

## Klient

### - javascript, ractive.js
### - ajax

TODO torgeir

???
torgeir forklarer
- dum klient
- får all state, rendrer på nytt
- Ractive? ikke React?! laget før react

---

# Raspberry PI

## init.d startupscript

### - server-kode
### - klient-kode
### - hvordan deploye server-kode
### - hvordan deploye klient-kode

---
template: head

# Demo

---

# Bluetooth Low Energy

## kommunikasjon mellom rfduino <=> rfduino

### GaZeLL (GZZL)

> Gazell , or GZLL, is a proprietary packet radio protocol released by Nordic Semiconductor. The protocol defines a star topology with one HOST and up to seven DEVICE's

[GaZeLL Protocol Testing](http://thomasolson.com/PROJECTS/GZLL/)

---

# Idemyldring

- QR-kode innlogging
- Lagre bruker + qr-kode
- Generere qr-kode som kan festes på adgangskort
- Oppslag av spillere i adresselista til BEKK
- Lagre scrores i database (igjen)
- Exception håndtering
- Logging
- Stabilitet
- Forbedre hw-kode mtp. strømforbruk
- Vise gjenværende batterispenning?
- Rankingsystem
- Realtime grafer og statistikk
- Turnering!
