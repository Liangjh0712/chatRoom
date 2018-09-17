import { Icon, Input, Button, Form } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

class ChatRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            unlink: false
        };

        let ws = new WebSocket(props.url + `?authorization=${localStorage.getItem('authorization')}`);
        ws.addEventListener('message', (websocket, message) => {

        });

        ws.addEventListener('close', (websocket, message) => {
            this.setState({
                unlink: true
            })
        })

        this.ws = ws;
    }

    componentWillUnmount() {
        this.ws.close();
    }

    getChatData = (data = []) => {
        return (<ul>{data.map(val => {
            return <li><Icon component={() => (<img src={val.imagePath || ''} alt=""></img>)} /><p>{val.content}</p></li>
        })}</ul>)
    }

    sendMessage = message => {
        this.ws.send(message);
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, data) => {

        })
    }

    render() {
        if (this.state.unlink) {
            return (<Link to="/">error now!</Link>)
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <div style={style.fatherDiv}>
                <div style={style.infoHistoryDiv}>
                    {this.getChatData(this.state.chatData)}
                </div>
                <div style={style.userListDiv}>
                    <ul style={style.ul}>
                        <li></li>
                    </ul>
                </div>
                <div style={style.inputDiv}>
                    <Form onSubmit={this.handleSubmit} style={style.inputForm}>
                        <Form.Item style={{ marginBottom: 0, flexGrow: 3 }}>
                            {getFieldDecorator('message', {
                                rules: [{ required: true, message: 'Please input your username!' }],
                            })(
                                <Input.TextArea style={style.input} rows='4' />
                            )}
                        </Form.Item>
                        <Button style={style.inputButton} htmlType='submit' onClick={e => {

                        }}>Submit</Button>

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
        width: '80%',
        height: '80%',
        border: 'solid',
        display: 'flex',
        flexWrap: 'wrap',
    },
    ul: {
        'listStyle': 'none',
    },
    infoHistoryDiv: {
        'flexGrow': 2,
        background: 'red',
        height: '70%',
    },
    userListDiv: {
        'flexGrow': 1,
        background: 'blue',
    },
    inputForm: {
        height: '100%',
        display: 'flex',
        flexFlow: 'column',
    },
    inputDiv: {
        width: '100%',
        height: '30%',
        background: 'white',
        display: 'flex',
        flexFlow: 'column',
        alignContent: 'center'
    },
    input: {
        // height: '100%',
    },
    inputButton: {
        height: '20%',
        alignSelf: 'flex-end',
    }
}