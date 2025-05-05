import { request } from '../utils/request'

export interface RecordDTO {
	topicId: number
	topicTitle?: string
	recentAnswer?: string
	durationSec?: number
	submitTime: string
	solveTime?: string
	isCorrect?: boolean
	lastStatus?: boolean // 隔天重做状态
}

// 列表查询 - 所有
function list(topicId: number) {
	return request({
		url: '/api/record',
		params: { topicId },
	})
}

// 列表查询 - 指定日期
function listByDate(date: string) {
	return request({
		url: '/api/record/by-date',
		params: { date },
	})
}

// 列表查询 - 指定日期
function lastList() {
	return request({
		url: '/api/record/last',
	})
}

// 添加新题目
function update(data: RecordDTO) {
	return request({
		method: 'POST',
		url: '/api/record/update',
		data,
	})
}

export const RecordApi = {
	list,
	update,
	listByDate,
	lastList,
}
