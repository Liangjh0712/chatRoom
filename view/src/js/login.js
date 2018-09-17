import { Form, Icon, Input, Button, Checkbox } from 'antd';
import React from 'react';
import { Link, Redirect } from 'react-router-dom';


const FormItem = Form.Item;

class NormalLoginForm extends React.Component {

    state = {
        loginSuccess: false
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                fetch(this.props.url, {
                    method: 'post',
                    body: JSON.stringify(values),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        throw new Error('login failed!');
                    }
                }).then(data => {
                    window.localStorage.setItem('authorization', data.authorization);
                    this.setState({
                        loginSuccess: true
                    });
                }).catch(e => {
                    alert('login failed');
                })
            };
        });
    }

    render() {

        if (this.state.loginSuccess) {
            return (<Redirect push to="chatroom" ></Redirect>)
        }

        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} style={style.form}>
                <FormItem>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" autoComplete="username" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" autoComplete="current-password" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(
                        <Checkbox>Remember me</Checkbox>
                    )}

                    <Link to="/forgotPassword" style={style.floatRight}>Forgot password</Link>

                    <Button type="primary" htmlType="submit" style={style.loginButton}>
                        Log in
                    </Button>
                    Or <Link to="/register">register now!</Link>
                </FormItem>
            </Form>
        );
    }
}


const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm;

const style = {
    form: {
        maxWidth: '400px',
    },
    floatRight: {
        float: 'right',
    },
    loginButton: {
        width: '100%'
    }
}