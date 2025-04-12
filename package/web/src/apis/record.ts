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

// 更新
function update(data: RecordDTO) {
	return request({
		method: 'PATCH',
		url: '/api/record/update',
		data,
	})
}

// 添加新题目
function add(data: RecordDTO) {
	return request({
		method: 'POST',
		url: '/api/record/add',
		data,
	})
}

export const RecordApi = {
	list,
	add,
	update,
}
