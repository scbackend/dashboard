import i18nmapping from "./i18nmapping.js";

const globalState = {
    token: null,
    host: null,
    insts: null,
    dialog: null,
    formatMessage: (msg) => {
        const messages = i18nmapping;
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