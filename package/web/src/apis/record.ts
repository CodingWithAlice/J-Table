import { request } from '../utils/request'

interface RecordDTO {
	topicId: number
	topicTitle: string
	durationSec?: number
    isCorrect?: boolean
    recentAnswer: string
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
