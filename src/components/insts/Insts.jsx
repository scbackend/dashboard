import React from 'react';
import globalState from '../../globalState';
import './Insts.css';

class Insts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        if(!globalState.insts) {
            fetch(`${globalState.host}/projects`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${globalState.token}`,
                    'Cache-Control': 'no-cache'
                }
            })
            .then(response => {
                if(response.status === 403) {
                    globalState.token = null;
                    window.localStorage.removeItem('token');
                    window.location.reload();
                }
                if (!response.ok) throw new Error('网络错误');
                return response.json();
            })
            .then(data => {
                globalState.insts = data;
                this.setState({});
            })
            .catch(error => {
                console.error('获取实例失败:', error);
            });
        }
    }
    render() {
        const insts = [
            { id: 1, name: '实例A', desc: '这是实例A的描述', status: 1 },
            { id: 2, name: '实例B', desc: '这是实例B的描述', status: 0 },
            { id: 3, name: '实例C', desc: '这是实例C的描述', status: 1 },
        ];
        return (
            <div className="Insts">
                <h2>{globalState.formatMessage('insts.title')}</h2>
                <div className="Insts-card-list">
                    {insts.map(inst => (
                        <div className="Insts-card" key={inst.id}>
                            <div className="Insts-card-title">
                                {inst.name}
                                <button className="Insts-card-switch-btn">
                                    {inst.status === 1
                                        ? globalState.formatMessage('insts.stop')
                                        : globalState.formatMessage('insts.start')}
                                </button>
                            </div>
                            <div className="Insts-card-content">{inst.desc}</div>
                            <div className={`Insts-card-status${inst.status === 0 ? ' stopped' : ''}`}>
                                {inst.status ? '运行中' : '停止中'}
                            </div>
                            <div className="Insts-card-actions">
                                <button className="Insts-card-btn">{globalState.formatMessage('insts.edit')}</button>
                                <button className="Insts-card-btn">{globalState.formatMessage('insts.delete')}</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Insts;