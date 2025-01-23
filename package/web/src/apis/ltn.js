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

export const LtnApi = {
    list,
    update
};