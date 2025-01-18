import { request } from '../utils/request';
import { Category } from '../utils/utils';

// 列表查询 - 所有
function list() {
    const result = {
        list: [
            {
                key: 'target0',
                category: Category.learning,
                target: '背单词100个',
                quantify: 7,
                weekSituation: [1, 0, 1, 1, 0, 1, 1],
            },
            {
                key: 'target1',
                category: Category.life,
                target: '运动1h',
                quantify: 5,
                // excuse: '描述',
                weekSituation: [0, 0, 1, 1, 0, 0, 1],
            },
            {
                key: 'target2',
                category: Category.health,
                target: '阅读30m',
                quantify: 5,
                // excuse: '描述',
                weekSituation: [0, 1, 1, 1, 1, 1, 1],
            },
        ]
    };
    return new Promise((resolve) => {
        resolve(result)
    }) || request({
        url: '/api/list',
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
function update(id, data) {
    return request({
        method: 'POST',
        url: '/api/remove',
        params: { id },
        data
    });
}

function zipTag(strings, ...expressions) {
    return strings[0]+ expressions.map((e, i) => `${e}${strings[i+1]}`).join(',');
}


export const MainApi = {
    list,
    add,
    remove,
    update
};