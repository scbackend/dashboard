import React from 'react';
import globalState from '../../globalState';
import './login.css';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            visible: !(window.localStorage.getItem('token'))
        };
        if(!this.state.visible){
            globalState.token = window.localStorage.getItem('token');
        }
        else if(window.location.hash.length > 1)
        {
            window.location.hash='';
            window.location.reload();
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleLogin = () => {
        fetch(`${globalState.host}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        }).then(response => response.json()).then(data => {
            if(data.token){
                globalState.token = data.token
                window.localStorage.setItem('token', data.token)
                this.setState({ visible: false });
                window.location.reload();
            } else {
                alert('登录失败，请检查用户名和密码');
            }
        }).catch(error => {
            console.error('Error during login:', error);
            alert('登录请求失败，请稍后重试');
        });
    };

    render() {
        if (!this.state.visible) return null;
        return (
            <div className="LoginModal">
                <div className="LoginBox">
                    <h2>登录</h2>
                    <input
                        className="LoginInput"
                        type="text"
                        name="username"
                        placeholder="用户名"
                        value={this.state.username}
                        onChange={this.handleChange}
                    />
                    <input
                        className="LoginInput"
                        type="password"
                        name="password"
                        placeholder="密码"
                        value={this.state.password}
                        onChange={this.handleChange}
                    />
                    <button className="LoginBtn" onClick={this.handleLogin}>登录</button>
                </div>
            </div>
        );
    }
}

export default Login;
