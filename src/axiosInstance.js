import axios from 'axios';
import globalState from './globalState';

const instance = axios.create();

instance.interceptors.request.use(config => {
    // 自动添加 Authorization 字段
    if (globalState.token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${globalState.token}`;
    }
    config.headers['Cache-Control'] = 'no-cache';
    return config;
}, error => Promise.reject(error));

export default instance;
