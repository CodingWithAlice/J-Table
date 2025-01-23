import { request } from '../utils/request';

// 列表查询 - 所有
function list() {
    return request({
        url: '/api/routine',
    });
}

export const RoutineApi = {
    list,
};