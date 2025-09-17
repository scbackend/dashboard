import React from 'react';
import './App.css';
import logo from './logo.png';
import globalState from './globalState';
import {HashRouter, Route, Routes, Link} from 'react-router-dom';
import Insts from './components/insts/Insts.jsx';
import Login from './components/login/login.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    globalState.onChange = () => {
      this.setState({ dialog: globalState.dialog });
    }
    if(!globalState.host){
      const host = window.localStorage.getItem('host') || window.prompt('请输入后端地址', 'http://localhost:3030');
      window.localStorage.setItem('host', host);
      globalState.host = host;
    }
  }

  render() {
    return (
      <div className="Dashboard">
        {this.state.dialog}
        {globalState.token == null && <Login />}
        <HashRouter>
        <nav className="Sidebar">
          <div className="SidebarBrand">
            <img src={logo} alt="Logo" className="SidebarLogo" />
            <span className="SidebarTitle">Scbackend</span>
          </div>
          <ul className="NavList">
            <li className="NavItem"><Link className='NavLink' to='/'>{globalState.formatMessage('home.title')}</Link></li>
            <li className="NavItem"><Link className='NavLink' to='/insts'>{globalState.formatMessage('insts.title')}</Link></li>
            <li className="NavItem"><Link className='NavLink' to='/settings'>{globalState.formatMessage('settings.title')}</Link></li>
          </ul>
        </nav>
        <main className="Content">
            <Routes>
              <Route path="/" element={<h2>{globalState.formatMessage('home.title')}</h2>} />
              <Route path="/insts" element={<Insts />} />
              <Route path="/settings" element={<h2>{globalState.formatMessage('settings.title')}</h2>} />
            </Routes>
        </main>
        </HashRouter>
      </div>
    );
  }
}

export default App;