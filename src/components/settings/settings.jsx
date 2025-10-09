import React from 'react';
import globalState from '../../globalState';
import './settings.css';

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="Settings">
                <h2>{globalState.formatMessage('settings.title')}</h2>
            </div>
        );
    }
}

export default Settings;