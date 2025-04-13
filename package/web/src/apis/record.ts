import { request } from '../utils/request'

export interface RecordDTO {
	topicId: number
	topicTitle?: string
	recentAnswer?: string
	durationSec?: number
	submitTime: string
	isCorrect?: boolean
}

// 列表查询 - 所有
function list(topicId: number) {
	return request({
		url: '/api/record',
		params: { topicId },
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
}
