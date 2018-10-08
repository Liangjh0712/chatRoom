import { Icon, Input, Button, Form, Avatar } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

class ChatRoom extends React.Component {
    username = window.localStorage.getItem('username');
    constructor(props) {
        super(props);
        this.state = {
            unlink: false,
            chatData: [],
            userList: [],
            inputError: ''
        };

        this.buttonRef = React.createRef();

        let ws = new WebSocket(props.url + `?authorization=${localStorage.getItem('authorization')}`);

        ws.addEventListener('open', ws => {
        })

        ws.addEventListener('message', websocket => {
            let data = JSON.parse(websocket.data);
            if (data.type === 'message') {
                let chatData = this.state.chatData;
                chatData.push(data.info);
                this.setState({
                    chatData
                });
            } else if (data.type === 'userList') {
                let users = data.info.content.split(',');
                this.setState({
                    userList: users
                });
            }
        });

        ws.addEventListener('close', websocket => {
            this.setState({
                unlink: true
            });
        });

        this.ws = ws;
    }

    componentWillUnmount() {
        this.ws.close();
    }

    getChatData = (data = []) => {
        if (data.length === 0) return null;
        return (<ul style={style.ul}>{data.map((val, index) => {
            return <li key={index} style={{ padding: '5px 10px' }}><Avatar icon="user" style={{ backgroundColor: '#87d068', verticalAlign: 'top', float: 'left' }} size='small' /><div style={{ wordBreak: 'break-all', paddingLeft: '1.5em' }}><p style={{ fontWeight: 'bolder', paddingLeft: '1em' }}>{val.user.username}</p> <span style={{
                backgroundColor: this.username === val.user.username ? '#2785d2de' : '#dcdbdbcc',
                color: this.username === val.user.username ? 'white' : 'black',
                borderRadius: '1em',
                padding: '.2em 0.5em'
            }}>{val.content}</span></div></li>
        })}</ul>);
    }

    renderUserList = (users = []) => {
        if (users.length === 0) return;

        return (
            <ul style={style['ul']}>
                {
                    users.map((username, index) => <li key={index} style={{ borderBottom: 'dashed 1px #d9d9d9', padding: '4px' }}> <Avatar icon="user" size='small' style={{ backgroundColor: '#87d068' }} /> {username}</li>)
                }
            </ul>
        );
    }

    sendMessage = message => {
        this.ws.send(JSON.stringify({ type: 'message', data: message }));
    };

    handleSubmit = e => {
        e && e.preventDefault();
        let message = this.props.form.getFieldValue('message');

        if (typeof message === 'string' && /[^\n|\r| ]/.test(message)) {
            this.sendMessage(message);
        } else {
            this.setState({
                inputError: 'error'
            });
        }
        this.props.form.setFieldsValue({
            message: ''
        })
    };

    inputKeyDownHandle = e => {
        if (e.keyCode === 13) {
            this.handleSubmit();
            // this.buttonRef.current.click();
        }
    }

    render() {
        if (this.state.unlink) {
            return (<Link to="/">error now!</Link>)
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <div style={style.fatherDiv}>
                <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <div style={style.infoHistoryDiv}>
                        {this.getChatData(this.state.chatData)}
                    </div>
                    <div style={style.userListDiv}>
                        {
                            this.renderUserList(this.state.userList)
                        }
                    </div>
                </div>
                <div style={style.inputDiv}>
                    <Form onSubmit={this.handleSubmit} style={style.inputForm}>
                        <Form.Item style={{ marginBottom: 0 }} validateStatus={this.state.inputError} >
                            {getFieldDecorator('message')(
                                <Input.TextArea style={style.input} rows='4' onKeyDown={this.inputKeyDownHandle} onInput={e => this.setState({ inputError: '' })} />
                            )}
                        </Form.Item>
                        <Button style={style.inputButton} htmlType='submit' ref={this.buttonRef}>Submit</Button>

                    </Form>
                </div>
            </div >
        )
    }
}

const Chat = Form.create()(ChatRoom);
export default Chat;

const style = {
    fatherDiv: {
        width: '60%',
        height: '70%',
        display: 'flex',
        flexWrap: 'wrap',
        flexFlow: 'column',
        backgroundColor: 'white',
        position: 'relative',
    },
    ul: {
        listStyle: 'none',
        paddingLeft: 0,
        margin: 0,
        overflow: 'auto'
    },
    infoHistoryDiv: {
        width: '80%',
        overflow: 'hidden'
    },
    userListDiv: {
        width: '20%',
        borderLeft: '1px solid #d9d9d9',
    },
    inputForm: {
        height: '100%',
        display: 'flex',
        flexFlow: 'column',
        position: 'relative',
    },
    inputDiv: {
        width: '100%',
        background: 'white',
        display: 'flex',
        flexFlow: 'column',
        position: 'absolute',
        transform: 'translateY(100%)',
        bottom: '0',
        alignContent: 'center'
    },
    input: {
        // height: '100%',
    },
    inputButton: {

        position: 'absolute',
        right: 0,
        bottom: 0,
    }
}