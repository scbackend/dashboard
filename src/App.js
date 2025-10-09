import React from 'react';
import './App.css';
import logo from './logo.png';
import globalState from './globalState';
import {HashRouter, Route, Routes, Link} from 'react-router-dom';
import Insts from './components/insts/Insts.jsx';
import Login from './components/login/login.jsx';
import Home from './components/home/home.jsx';
import Settings from './components/settings/settings.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    globalState.onChange = () => {
      this.setState({ dialog: globalState.dialog });
    }
    globalState.host = window.localStorage.getItem('host') || '';
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
              <Route path="/" element={<Home />} />
              <Route path="/insts" element={<Insts />} />
              <Route path="/settings" element={<Settings/>} />
            </Routes>
        </main>
        </HashRouter>
      </div>
    );
  }
}

export default App;