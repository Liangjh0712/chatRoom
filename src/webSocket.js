const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;
const jwt = require('jsonwebtoken');
const chatRoomRouter = require('koa-router')();
const config = require('../config');

const creatWebSocketServer = (server, router) => {
    const wss = new WebSocketServer({
        server: server
    });

    let users = [];

    const sendUserList = () => {

        let newUsers = Array.from(wss.clients);
        users = users.filter(user => {
            return newUsers.includes(user.ws);
        });

        let sendMessage = { type: 'userList', info: { content: null } };
        let content = users.map(val => val.username).join(',');
        sendMessage.type = 'userList';
        sendMessage.info.content = content;
        sendMessage = JSON.stringify(sendMessage);
        wss.clients.forEach(ws => {
            ws.readyState === ws.OPEN && ws.send(sendMessage);
        })
    }

    wss.on('connection', (ws, request) => {

        let url = request.url;
        url = url.replace(/\/\?/mg, '');

        let params = new Map();
        url.split('&').forEach(val => {
            let arr = val.split('=');
            params.set(...arr);
        });

        if (!params.get('authorization')) {
            ws.close(1008, 'no authorization !');
            return;
        }
        let user = jwt.decode(params.get('authorization'));

        if (!user) {
            ws.close(1008, 'the username already exist! or the number of users has been max!');
            return;
        }

        let findUser = users.find(val => {
            if (val.username === user.username) {
                val.ws.close(1008, 'Your account has been login somewhere!');
                val.ws = ws;
                return true;
            }
        });
        if (!findUser) {
            if (users.length === 200) {
                ws.close();
                return;
            }
            user.ws = ws;
            users.push(user);
        } else {
            user = findUser;
        }

        ws.addEventListener('message', evt => {
            let data = JSON.parse(evt.data.replace(/(\<)|(\>)/mg, (s, p1, p2) => { if (p1) return '&lt;'; if (p2) return '&gt;' }));
            let sendMessage = { type: 'message', info: { user: { username: user.username }, content: null } };
            if (data.type === 'getUserList') {
                let content = users.map(val => val.username).join(',');
                sendMessage.type = 'userList';
                sendMessage.info.content = content;
            };
            if (data.type === 'message') {
                let content = data.data;
                sendMessage.info.content = content;
            }
            sendMessage = JSON.stringify(sendMessage);
            wss.clients.forEach(ws => {
                ws.send(sendMessage);
            });
        });


        ws.addEventListener('close', evt => {
            sendUserList();
        });

        sendUserList();
    });

}

// const sendMessage = (client, message = '', type = 'message') => {
//     if (Object.prototype.toString.call(client) === '[object Object]') client.send({ type, message });
//     else if (Array.isArray(client)) {
//         client.forEach(cli => {
//             cli.send({ type, message });
//         });
//     }
// };

module.exports = creatWebSocketServer;