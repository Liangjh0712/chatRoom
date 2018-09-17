import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

import WrappedNormalLoginForm from './js/login';
import RegisterForm from './js/register'
import LoginBG from './js/background/loginbg';
import ChatRoom from './js/chatRoom'

const config = {
    httpServerUrl: 'http://localhost:8080',
    wsServerUrl: 'ws://localhost:8080'
}

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route path='/register' component={() => (<RegisterForm url={config.httpServerUrl + '/register'} />)} />
            <Route path='/chatroom' component={() => (<ChatRoom url={config.wsServerUrl} />)} />
            <Route exact path='/' component={() => (<WrappedNormalLoginForm url={config.httpServerUrl + '/login'} />)} />
        </Switch>
    </BrowserRouter>,
    document.getElementById('content'));

// backgroud

ReactDOM.render(<BrowserRouter>

    <Route path='/' component={LoginBG} />

</BrowserRouter>,
    document.getElementById('background'));