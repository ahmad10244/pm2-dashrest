# PM2 Dashboard REST API

## Description

PM2 module to monitor and manage PM2 processes with REST api.

## Install

`pm2 install ahmad10244/pm2-dashrest`

## Configure

- `port` (Defaults to `5050`): Set the port of app server
- `sioport` (Defaults to `5051`): Set the port of socket.io server

You can change module default ports with:

``` bash
pm2 set pm2-dashrest:port <value>
pm2 set pm2-dashrest:sioport <value>
```

## PM2 Bus

Get pm2 bus events from socketio by emiting 'events:bus' event with eventName(optional) and processName(optional).\
`eventName` is equal to event names from pm2 bus, like: `log:err`, `log:out`, `process:event`\

### Usage Examples

``` javascript
const socket = io("http://<host>:<sioport>");

// To get all events emit the following message
socket.emit("events:bus")


// handle all incoming events
socket.onAny((eventName, msg) => { 
    console.log(eventName, msg)
})

// handle 'log:err' events
socket.on("log:err", function (msg) {
    console.log(msg)
})

// handle 'log:out' events
socket.on("log:out", function (msg) {
    console.log(msg)
})
```

``` javascript
const socket = io("http://<host>:<sioport>");

// To get special event emit the following message
socket.emit("events:bus", {"eventName": "log:err"})


// handle 'log:err' events
socket.on("log:err", function (msg) {
    console.log(msg)
})
```

``` javascript
const socket = io("http://<host>:<sioport>");

// To get special events for special process emit the following message:
socket.emit("events:bus", {"eventName": "log:err", "processName": "<pm2 process name>"})


// handle 'log:err' events
socket.on("log:err", function (msg) {
    console.log(msg)
})
```

``` javascript
const socket = io("http://<host>:<sioport>");

// To get all events for special process
socket.emit("events:bus", {"processName": "<pm2 process name>"})


// handle all incoming events
socket.onAny((eventName, msg) => { 
    console.log(eventName, msg)
})
```

## Uninstall

`pm2 uninstall pm2-dashrest`
