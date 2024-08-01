import { request } from '../utils/request';
import { Category } from '../utils/utils';

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
        url: '/api/tenant/list',
      });
}

export const MainApi = {
    list
};