import axios from 'axios';
import { message } from 'antd';
// axios.defaults.withCredentials = true;

export function getApiBaseUrl() {
    if (/local/.test(window.location.host)) {
        return '//localhost:4002';
    }
    return 'online'
}
export function request(options) {
    let baseURL = getApiBaseUrl();
    const headers = { 'JTable-Test-Host': window.location.host };
    const mergeOpt = {
        ...options,
        baseURL: options.baseURL || baseURL,
        method: options.method || 'GET',
        headers: {
            ...options.headers,
            ...headers,
        },
    };
    return axios(mergeOpt).then((res) => {
        const { data, status } = res;
        // if (options.bypass) return res;
        // http 状态码
        if (status >= 200 && status < 300) {
            // 业务响应 code
            return data.data;
            // if (data && data.code >= 200 && data.code < 300) {
            //     if (data.code === 200) {
            //         return data;
            //     }
            //     message.warn(data.message);
            //     return data;
            // }
            // if (!options.silence) {
            //     message.error(data.message);
            // }
        } else if (!options.silence) {
            message.error(status);
        }
        throw new Error(res?.data.message || status);
    })
        .catch((err) => {
            let msg = err.response?.data?.info || err.response?.data?.message || err.toString();
            if (!options.silence) {
                message.error(msg);
            }
            throw err;
        });
}