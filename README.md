# PM2 Dashboard REST API

## Description

PM2 module to monitor and manage PM2 processes with REST api.

## Install

`pm2 install ahmad10244/pm2-dashrest`

## Configure

- `port` (Defaults to `5050`): Set the port of app server
- `sioport` (Defaults to `5051`): Set the port of socket.io server

After having installed the module you have to type:

`pm2 set pm2-dashrest:port <value>`

`pm2 set pm2-dashrest:sioport <value>`

Get live logs from socketio by sending process name with 'logs:processName' event name.

``` javascript
const socket = io("http://<host>:<sioport>");
socket.emit("logs:processName", "<pm2 process name>")
socket.on("logs:msg", function (msg) {
    console.log(msg)
})
```

## Uninstall

`pm2 uninstall pm2-dashrest`
