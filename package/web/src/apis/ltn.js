import { request } from '../utils/request';

// 列表查询 - 所有
function list(params) {
    return request({
        url: '/api/ltn',
        params,
    });
}

// 更新
function update(id, type, time) {
    return request({
        method: 'PATCH',
        url: '/api/ltn/operate',
        // params: { id },
        data: {
            id, type, time
        }
    });
}

// 添加新题目
function add(data) {
    return request({
        method: 'POST',
        url: '/api/ltn/add',
        data
    });
}

export const LtnApi = {
    list,
    update,
    add
};