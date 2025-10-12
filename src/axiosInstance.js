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

// 响应拦截器：403 且不在主页时自动跳主页并弹出登录框
instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 403) {
            // 判断当前是否在主页
            const isHome = window.location.hash === '' || window.location.hash === '#' || window.location.hash === '#/';
            if (!isHome) {
                globalState.token = null;
                window.localStorage.removeItem('token');
                // 弹出登录框并跳转主页
                window.location.hash = '/';
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
