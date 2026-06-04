import { request } from '../utils/request'

// 获取总金币数
function getTotal() {
	return request({
		url: '/api/coin/total',
	})
}

// 获取每日金币列表
function getDaily(startDate?: string, endDate?: string) {
	return request({
		url: '/api/coin/daily',
		params: { startDate, endDate },
	})
}

// 获取趋势数据
function getTrend(days?: number) {
	return request({
		url: '/api/coin/trend',
		params: { days },
	})
}

export const CoinApi = {
	getTotal,
	getDaily,
	getTrend,
}

