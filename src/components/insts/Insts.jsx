import React from 'react';
import globalState from '../../globalState';
import './Insts.css';

class Insts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.refresh(false);
    }

    refresh = (skip) => {
        if (skip || !globalState.insts) {
            fetch(`${globalState.host}/projects`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${globalState.token}`,
                    'Cache-Control': 'no-cache'
                }
            })
            .then(response => {
                if (response.status === 403) {
                    globalState.token = null;
                    window.localStorage.removeItem('token');
                    window.location.reload();
                }
                if (!response.ok) throw new Error('网络错误');
                return response.json();
            })
            .then(data => {
                globalState.insts = data;
                let ists = [];
                ists = data.map(item => {
                    return { name: item.name, desc: item.body, status: 0 }
                });
                fetch(`${globalState.host}/runners`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${globalState.token}`,
                        'Cache-Control': 'no-cache'
                    },
                })
                .then(response => {
                    if (response.status === 403) {
                        globalState.token = null;
                        window.localStorage.removeItem('token');
                        window.location.reload();
                    }
                    if (!response.ok) throw new Error('网络错误');
                    return response.json();
                })
                .then(runners => {
                    ists.forEach(inst => {
                        inst.status = runners.includes(inst.name) ? 1 : 0;
                    });
                    this.setState({ insts: ists });
                })
                .catch(error => {
                    console.error('获取运行状态失败:', error);
                    this.setState({ insts: ists }); // 即使失败也显示项目列表
                });
            })
            .catch(error => {
                console.error('获取实例失败:', error);
            });
        }
    }

    handleCreate = () => {
        const name = prompt('请输入实例名称:');
        const body = prompt('请输入实例内容:');
        if (name && body) {
            fetch(`${globalState.host}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${globalState.token}`,
                    'Cache-Control': 'no-cache'
                },
                body: JSON.stringify({ name: name, body: body }),
            })
            .then(response => {
                if (!response.ok) throw new Error('网络错误');
                return response.json();
            })
            .then(data => {
                this.refresh(true);
            })
            .catch(error => {
                console.error('创建实例失败:', error);
            });
        }
    }

    handleDelete = (name) => {
        if (window.confirm(`确定要删除实例 "${name}" 吗？`)) {
            fetch(`${globalState.host}/project/delete/${name}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${globalState.token}`,
                    'Cache-Control': 'no-cache'
                }
            })
            .then(response => {
                if (!response.ok) throw new Error('网络错误');
                return response.json();
            })
            .then(data => {
                this.refresh(true);
            })
            .catch(error => {
                console.error('删除实例失败:', error);
            });
        }
    }

    handleStatusChange = (name) => {
        const inst = this.state.insts.find(i => i.name === name);
        if (!inst) return;
        const action = inst.status === 1 ? 'remove' : 'add';
        fetch(`${globalState.host}/runner/${action}/${name}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${globalState.token}`,
                'Cache-Control': 'no-cache'
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('网络错误');
            return response.json();
        })
        .then(data => {
            this.refresh(true);
        })
        .catch(error => {
            console.error(`${action === 'add' ? '启动' : '停止'}实例失败:`, error);
        });
    }


    render() {
        const insts = this.state.insts;
        return (this.state.insts ? (
            <div className="Insts">
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <h2>{globalState.formatMessage('insts.title')}</h2>
                    <button className="Insts-card-btn" onClick={this.handleCreate}>
                        {globalState.formatMessage('insts.create')}
                    </button>
                </div>
                <div className="Insts-card-list">
                    {insts.map(inst => (
                        <div className="Insts-card" key={inst.id}>
                            <div className="Insts-card-title">
                                {inst.name}
                                <button className="Insts-card-switch-btn" onClick={_ => this.handleStatusChange(inst.name)}>
                                    {inst.status === 1
                                        ? globalState.formatMessage('insts.stop')
                                        : globalState.formatMessage('insts.start')}
                                </button>
                            </div>
                            <div className="Insts-card-content">{inst.desc}</div>
                            <div className={`Insts-card-status${inst.status === 0 ? ' stopped' : ''}`}>
                                {inst.status ? globalState.formatMessage('insts.running') : globalState.formatMessage('insts.stopped')}
                            </div>
                            <div className="Insts-card-actions">
                                <button className="Insts-card-btn">{globalState.formatMessage('insts.edit')}</button>
                                <button className="Insts-card-btn" onClick={() => this.handleDelete(inst.name)}>
                                    {globalState.formatMessage('insts.delete')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ) : <div>{globalState.formatMessage('insts.loading')}</div>);
    }
}

export default Insts;