import { request } from '../utils/request'

// AI 校验引导（须走服务端代理，密钥不得出现在前端）
function compare(params: { recent: string; right: string; title: string; pro?: boolean }) {
	return request({
		url: '/api/ai/compare',
		method: 'POST',
		data: params,
	})
}

export const AIApi = {
	compare
}
