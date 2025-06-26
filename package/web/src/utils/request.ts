import axios, { AxiosRequestConfig } from 'axios'

export function getApiBaseUrl() {
	if (/local/.test(window.location.host)) {
		return '//localhost:4002'
	}
	return '//codingwithalice.top:4002'
}
export function request(options: AxiosRequestConfig) {
	let baseURL = getApiBaseUrl()
	const headers = {
		Authorization: localStorage.getItem('type'),
	}
	const mergeOpt: AxiosRequestConfig = {
		...options,
		baseURL: options.baseURL || baseURL,
		method: options.method || 'GET',
		headers: {
			...options.headers,
			...headers,
		},
	}
	return axios(mergeOpt)
		.then((res) => {
            console.log('🌹', res);
            
			const { data, status } = res
			// if (options.bypass) return res;
			// http 状态码
			if (status >= 200 && status < 300) {
				// 业务响应 code
				return data.data
			}
			throw new Error(res?.data.message || status)
		})
		.catch((err) => {
			let msg =
				err.response?.data?.info ||
				err.response?.data?.message ||
				err.toString()

			throw new Error(msg)
		})
}
