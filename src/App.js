import './App.css';
import logo from './logo.png';
import globalState from './globalState';
import {HashRouter, Route, Routes, Link} from 'react-router-dom';
import Insts from './components/insts/Insts.jsx';
import React from 'react';
import Login from './components/login/login.jsx';

function App() {
  return (
    <div className="Dashboard">
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

export default App;