import Dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
Dayjs.extend(weekOfYear)

/**
 * 功能：客观计算当前时间的年度周数
 * 依托于插件 weekOfYear 实现
 */
export const getWeek = () => {
	return Dayjs().week()
}
