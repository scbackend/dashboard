import React from 'react';
import axiosInstance from '../../axiosInstance';
import globalState from '../../globalState';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axiosInstance.get(`${globalState.host}/readme`, {
            responseType: 'text'
        })
        .then(response => {
            this.setState({ readme: response.data });
        })
        .catch(error => {
            console.error('Error fetching readme:', error);
            this.setState({ readme: globalState.formatMessage('home.error') });
        });
    }

    render() {
        return (
            <div className="Home">
                <h2>{globalState.formatMessage('home.title')}</h2>
                <p>{this.state.readme}</p>
            </div>
        );
    }
}

export default Home;