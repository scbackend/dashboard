const globalState = {
    user: null,
    ui: {
        page: 'home',
    },
    formatMessage: (msg) => {
        const messages = {
            'zh-CN': {
                'home.title': '首页',
                'insts.title': '实例管理',
                'settings.title': '设置',
            },
            'en-US': {
                'home.title': 'Home',
                'insts.title': 'Instances Management',
                'settings.title': 'Settings',
            }
        }
        const normalizedLang = () => {
            const lang = navigator.language || 'en-US';
            if (lang.startsWith('zh')) return 'zh-CN';
            if (lang.startsWith('en')) return 'en-US';
            return 'en-US';
        }
        return messages[normalizedLang()][msg] || msg;
    }
};

export default globalState;