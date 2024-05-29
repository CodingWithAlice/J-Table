import { request } from '../utils/request';

function list() {
    return request({
        url: '/api/tenant/list',
      });
}

export const MainApi = {
    list
};