const Koa = require('koa');
const static = require('koa-static');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const cors = require('koa-cors');
const getToken = require('./src/jwt');
const jwtKoa = require('koa-jwt');
const config = require('./config');
const app = new Koa();

const server = app.listen(config.port);

app.use(cors({
    origin: '*'
}));

app.use(jwtKoa({
    secret: config.secret
}).unless({
    path: [/^\/register/, /\//]
}));

app.use(static(config.staticPath));
app.use(bodyParser());
const creatWebSocketServer = require('./src/webScket');

app.use(router.routes());

const nunjucks = require('nunjucks');
nunjucks.configure('template', { autoescape: true });

const users = [];
router.post('/register', async (ctx, next) => {
    let { username, password } = ctx.request.body;
    if (!username || !password) {
        ctx.status = 401;
        ctx.response.body = 'Your username and password not been allow null';
        return;
    }

    let temp = users.find(val => {
        if (val.username === username) {
            return true;
        }
    });

    if (temp) {
        ctx.status = 401;
        ctx.response.body = 'Your username has been register!';
        return;
    }
    if (users.length === 1000) {
        users.shift();
    }
    users.push({ username, password });
    ctx.status = 200;
    ctx.response.body = 'Register succeed!';
});

router.post('/login', async (ctx, next) => {
    let { username, password } = ctx.request.body;
    if (!username || !password) {
        ctx.status = 401;
        ctx.response.body = 'Your username and password not been allow null';
        return;
    }

    let temp = users.find(val => {
        if (val.username === username && val.password === password) {
            return true;
        }
    });

    if (!temp) {
        ctx.status = 401;
        ctx.response.body = 'username and password are not current!';
        return;
    }

    ctx.status = 200;
    let token = getToken({ username, password });
    ctx.response.body = {
        authorization: token
    }
})

creatWebSocketServer(server);