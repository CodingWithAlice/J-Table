import { request } from '../utils/request'

// 列表查询 - 所有
function compare(params: { recent: string; right: string; title: string; pro?: boolean }) {
	return request({
		url: '/api/ai/compare',
		params,
	})
}

export const AIApi = {
	compare
}