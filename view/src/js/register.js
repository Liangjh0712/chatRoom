import { Form, Icon, Input, Button, Checkbox } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const FormItem = Form.Item;


class Register extends React.Component {

    state = {
        register: false,
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                fetch(this.props.url, {
                    method: 'POST',
                    body: JSON.stringify(values),
                    headers: { 'Content-Type': 'application/json' },
                }).then(response => {
                    if (response.ok) {
                        return response.text();
                    } else {
                        throw new Error(response.text());
                    }
                }).then(data => {
                    this.setState({
                        register: true
                    })
                }).catch(error => {
                    alert(error.message);
                });
            };


        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        if (this.state.register) {
            return (<Link to='/'>Register Succeed!</Link>)
        }

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
                    <Button type="primary" htmlType="submit" style={style.loginButton}> Submit
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

const RegisterForm = Form.create()(Register);

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

export default RegisterForm;