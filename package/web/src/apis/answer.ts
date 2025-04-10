import { request } from '../utils/request'

interface AnswerDTO {
	questionId: number
	questionTitle: string
	answerText: string
	wrongNotes?: string[]
}

// 列表查询 - 所有
function list(questionId: number) {
	return request({
		url: '/api/answer',
		params: { questionId },
	})
}

// 更新
function update(data: AnswerDTO) {
	return request({
		method: 'PATCH',
		url: '/api/answer/update',
		data,
	})
}

// 添加新题目
function add(data: AnswerDTO) {
	return request({
		method: 'POST',
		url: '/api/answer/add',
		data,
	})
}

export const AnswerApi = {
	list,
	add,
	update,
}
