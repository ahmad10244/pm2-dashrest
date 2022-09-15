# PM2 Dashboard REST API

## Description

PM2 module to monitor and manage PM2 processes with REST api.

## Install

`pm2 install ahmad10244/pm2-dashrest`

## Configure

- `port` (Defaults to `5050`): Set the port of app server
- `sioport` (Defaults to `5051`): Set the port of socket.io server

After having installed the module you have to type:

``` bash
pm2 set pm2-dashrest:port <value>
pm2 set pm2-dashrest:sioport <value>
```

Get live logs from socketio by sending process name with 'logs:processName:<output_type>' event name.

``` javascript
const socket = io("http://<host>:<sioport>");

// To get 'err' logs
socket.emit("logs:processName:err", "<pm2 process name>")
socket.on("logs:msg:err", function (msg) {
    console.log(msg)
})

// To get 'out' logs
socket.emit("logs:processName:out", "<pm2 process name>")
socket.on("logs:msg:out", function (msg) {
    console.log(msg)
})
```

## Uninstall

`pm2 uninstall pm2-dashrest`
