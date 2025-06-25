import { request } from '../utils/request'

// 列表查询 - 所有
function compare(recent: string, right: string) {
	return request({
		url: '/api/ai',
		params: { recent, right },
	})
}

export const AIApi = {
	compare,
}