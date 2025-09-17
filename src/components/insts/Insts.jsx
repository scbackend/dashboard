import React from 'react';
import globalState from '../../globalState';
import './Insts.css';
import Dialog from '../dialog/dialog.jsx';

class Insts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
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
        } else {
            // 保证格式统一
            let ists = globalState.insts.map(item => ({
                name: item.name,
                desc: item.body,
                status: item.status || 0
            }));
            this.setState({insts: ists});
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

    handleEdit(name) {
        const inst = this.state.insts.find(i => i.name === name);
        if (!inst) return;
        globalState.dialog = (
            <Dialog
                title={globalState.formatMessage('insts.edit')}
                onClose={() => { globalState.dialog = null; globalState.onChange(); }}
                onConfirm={async () => {
                    const desc = document.getElementById('desc-input').value;
                    const fileInput = document.getElementById('sb3-input');
                    const file = fileInput.files[0];
                    // 先更新描述
                    await fetch(`${globalState.host}/project/update/${inst.name}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${globalState.token}`,
                            'Cache-Control': 'no-cache'
                        },
                        body: JSON.stringify({ name: inst.name, body: desc })
                    })
                    .then(response => {
                        if (!response.ok) throw new Error('网络错误');
                        return response.json();
                    })
                    .catch(error => {
                        alert('描述更新失败');
                    });
                    // 再上传文件
                    if (file) {
                        const arrayBuffer = await file.arrayBuffer();
                        await fetch(`${globalState.host}/project/${inst.name}`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${globalState.token}`,
                                'Cache-Control': 'no-cache',
                                'Content-Type': 'application/octet-stream'
                            },
                            body: arrayBuffer
                        })
                        .then(response => {
                            if (!response.ok) throw new Error('文件上传失败');
                            return response.json();
                        })
                        .catch(error => {
                            alert('文件上传失败');
                        });
                    }
                    this.refresh(true);
                    globalState.dialog = null;
                    this.forceUpdate();
                }}
                visible={true}
            >
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                    <label>名称：</label>
                    <input type="text" value={inst.name} disabled style={{marginBottom: '8px'}} />
                    <label>描述：</label>
                    <textarea id="desc-input" defaultValue={inst.desc} rows={3} style={{marginBottom: '8px'}} />
                    <label>上传sb3文件：</label>
                    <input id="sb3-input" type="file" accept=".sb3" style={{marginBottom: '16px'}} />
                </div>
            </Dialog>
        );
        globalState.onChange();
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
                                <button className="Insts-card-btn" onClick={() => this.handleEdit(inst.name)}>
                                    {globalState.formatMessage('insts.edit')}
                                </button>
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