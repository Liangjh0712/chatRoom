const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;
const jwt = require('jsonwebtoken');
const config = require('./../config');

const creatWebSocketServer = server => {
    const wss = new WebSocketServer({
        server: server
    });

    let uses = [];

    wss.on('connection', (ws, request) => {

        console.log(request);

        // let obj = {
        //     username: '',
        //     sex: ''
        // };

        // request.headers.cookie.split('; ').forEach(val => {
        //     let tempArr = val.split('=');
        //     obj[tempArr[0]] = obj[tempArr[1]];
        // });

        // {
        //     if (!obj.username) {
        //         ws.close(1008, 'No username!');
        //         return;
        //     };

        //     if (uses.find(val => {
        //         if (val.username === obj.username) {
        //             return true;
        //         }
        //     })) {
        //         ws.close(1008, 'Your username has been exist！');
        //         return;
        //     }

        //     if (uses.length === 200) {
        //         ws.close(1008, 'the number of users is more then 200!');
        //     }

        // }

        // uses.push(obj);

        // ws.on('message', message => {
        //     let newMessage = {
        //         usr: obj,
        //         message: message
        //     }
        //     sendMessage(wss.clients, newMessage);
        // });

        // ws.on('close', (ws, code, reason) => {
        //     console.log(ws, code, reason);

        //     uses = uses.filter(val => {
        //         if (val.username === obj.username) {
        //             return false;
        //         }
        //         return true;
        //     });

        //     sendMessage(wss.clients, uses, 'useList');
        // });

    });

}

const sendMessage = (client, message = '', type = 'message') => {
    if (Object.prototype.toString.call(client) === '[object Object]') client.send({ type, message });
    else if (Array.isArray(client)) {
        client.forEach(cli => {
            cli.send({ type, message });
        });
    }
};

module.exports = creatWebSocketServer;