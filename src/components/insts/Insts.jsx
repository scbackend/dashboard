import React from 'react';
import axiosInstance from '../../axiosInstance';
import globalState from '../../globalState';
import '../common/Card.css';
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
            axiosInstance.get(`${globalState.host}/projects`)
            .then(response => {
                const data = response.data;
                globalState.insts = data;
                let ists = data.map(item => ({ name: item.name, desc: item.body, status: 0 }));
                axiosInstance.get(`${globalState.host}/runners`, {
                    headers: {
                        'Authorization': `Bearer ${globalState.token}`,
                        'Cache-Control': 'no-cache'
                    }
                })
                .then(response => {
                    const runners = response.data;
                    ists.forEach(inst => {
                        inst.status = runners.includes(inst.name) ? 1 : 0;
                    });
                    this.setState({ insts: ists });
                })
                .catch(error => {
                    console.error('获取运行状态失败:', error);
                    this.setState({ insts: ists });
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
            axiosInstance.post(`${globalState.host}/create`, { name, body }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${globalState.token}`,
                    'Cache-Control': 'no-cache'
                }
            })
            .then(response => {
                this.refresh(true);
            })
            .catch(error => {
                console.error('创建实例失败:', error);
            });
        }
    }

    handleDelete = (name) => {
        if (window.confirm(`确定要删除实例 "${name}" 吗？`)) {
            axiosInstance.get(`${globalState.host}/project/delete/${name}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${globalState.token}`,
                    'Cache-Control': 'no-cache'
                }
            })
            .then(response => {
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
    axiosInstance.get(`${globalState.host}/runner/${action}/${name}`, {
            headers: {
                'Authorization': `Bearer ${globalState.token}`,
                'Cache-Control': 'no-cache'
            }
        })
        .then(response => {
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
                    await axiosInstance.post(`${globalState.host}/project/update/${inst.name}`, { name: inst.name, body: desc }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${globalState.token}`,
                            'Cache-Control': 'no-cache'
                        }
                    })
                    .catch(error => {
                        alert('描述更新失败');
                    });
                    // 再上传文件
                    if (file) {
                        const arrayBuffer = await file.arrayBuffer();
                        await axiosInstance.post(`${globalState.host}/project/${inst.name}`, arrayBuffer, {
                            headers: {
                                'Authorization': `Bearer ${globalState.token}`,
                                'Cache-Control': 'no-cache',
                                'Content-Type': 'application/octet-stream'
                            }
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
            <div className="Instances">
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <h2>{globalState.formatMessage('insts.title')}</h2>
                    <button className="CardBtn" onClick={this.handleCreate}>
                        {globalState.formatMessage('insts.create')}
                    </button>
                </div>
                <div className="CardList">
                    {insts.map(inst => (
                        <div className="Card" key={inst.id}>
                            <div className="CardTitle">
                                {inst.name}
                                <button className="CardBtn" style={{marginLeft: '12px', background: '#faad14'}} onClick={_ => this.handleStatusChange(inst.name)}>
                                    {inst.status === 1
                                        ? globalState.formatMessage('insts.stop')
                                        : globalState.formatMessage('insts.start')}
                                </button>
                            </div>
                            <div className="CardContent">{inst.desc}</div>
                            <div style={{position: 'absolute', left: 20, bottom: 16, fontSize: '0.98rem', fontWeight: 500, color: '#fff', padding: '2px 10px', borderRadius: 8, background: inst.status ? '#52c41a' : '#ff4d4f', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', zIndex: 1}}>
                                {inst.status ? globalState.formatMessage('insts.running') : globalState.formatMessage('insts.stopped')}
                            </div>
                            <div className="CardActions">
                                <button className="CardBtn" onClick={() => this.handleEdit(inst.name)}>
                                    {globalState.formatMessage('insts.edit')}
                                </button>
                                <button className="CardBtn" onClick={() => this.handleDelete(inst.name)}>
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