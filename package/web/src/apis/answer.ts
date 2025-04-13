import { request } from '../utils/request'

interface AnswerDTO {
	topicId: number
	topicTitle: string
	rightAnswer: string
	wrongNotes?: string
}

// 列表查询 - 所有
function list(topicId: number) {
	return request({
		url: '/api/answer',
		params: { topicId },
	})
}

// 添加新题目
function update(data: AnswerDTO) {
	return request({
		method: 'POST',
		url: '/api/answer/update',
		data,
	})
}

export const AnswerApi = {
	list,
	update,
}
