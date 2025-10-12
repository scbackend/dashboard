import React from 'react';
import axiosInstance from '../../axiosInstance';
import globalState from '../../globalState';
import '../common/Card.css';

class Plugins extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.refresh();
    }

    refresh = () => {
        axiosInstance.get(`${globalState.host}/plugins`)
        .then(response => {
            const data = response.data;
            this.setState({ plugins: data });
        })
        .catch(error => {
            console.error('获取插件失败:', error);
        });
    }

    handleCreate = () => {
        const name = prompt('请输入插件名称:');
        if (!name) return;
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.js,.cjs,.mjs';
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            axiosInstance.post(`${globalState.host}/plugin/upload/${name}`, file, {
                headers: {
                    'Content-Type': 'application/javascript',
                }
            });
        }
        fileInput.click();
    }
    handleEdit = (plugin) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.js,.cjs,.mjs';
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            axiosInstance.post(`${globalState.host}/plugin/upload/${plugin.name}`, file, {
                headers: {
                    'Content-Type': 'application/javascript',
                }
            })
            .then(() => this.refresh())
            .catch(err => alert('上传失败'));
        }
        fileInput.click();
    }
    handleDelete = (plugin) => {
        if (window.confirm(`确定要删除插件 "${plugin.name}" 吗？`)) {
            axiosInstance.get(`${globalState.host}/plugin/delete/${plugin.name}`)
                .then(() => this.refresh())
                .catch(err => alert('删除失败'));
        }
    }

    render() {
        const plugins = this.state.plugins || [];
        return (
            <div className="Plugins">
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <h2>{globalState.formatMessage('plugins.title')}</h2>
                    <button className="CardBtn" onClick={this.handleCreate}>
                        {globalState.formatMessage('insts.create')}
                    </button>
                </div>
                <div className="CardList">
                    {plugins.length === 0 ? (
                        <div>{globalState.formatMessage('insts.loading')}</div>
                    ) : plugins.map((plugin, index) => (
                        <div className="Card" key={index}>
                            <div className="CardTitle">
                                {plugin.name}
                                <span style={{marginLeft: '12px', color: '#888', fontSize: '0.9em'}}>v{plugin.version}</span>
                            </div>
                            <div className="CardContent">{plugin.description}</div>
                            <div className="CardActions" style={{justifyContent: 'flex-end'}}>
                                <button className="CardBtn" onClick={() => this.handleEdit(plugin)}>
                                    {globalState.formatMessage('insts.edit')}
                                </button>
                                <button className="CardBtn" onClick={() => this.handleDelete(plugin)}>
                                    {globalState.formatMessage('insts.delete')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Plugins;