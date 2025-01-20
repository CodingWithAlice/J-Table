import { request } from '../utils/request';

// 列表查询 - 所有
function list(params) {
    return request({
        url: '/ltn',
        params,
    });
}

// 新增
function add(data) {
    return request({
        method: 'POST',
        url: '/api/add',
        data,
    });
}

// 删除
function remove(id) {
    return request({
        method: 'POST',
        url: '/api/remove',
        params: { id },
    });
}

// 更新
function update(id, type, time) {
    return request({
        method: 'PATCH',
        url: '/ltn/operate',
        // params: { id },
        data: {
            id, type, time
        }
    });
}

function zipTag(strings, ...expressions) {
    return strings[0] + expressions.map((e, i) => `${e}${strings[i + 1]}`).join(',');
}


export const LtnApi = {
    list,
    update
};