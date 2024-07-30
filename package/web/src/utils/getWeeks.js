import Dayjs from "dayjs";

/**
 * 功能：客观计算当前时间的年度周数
 * 依托于插件 weekOfYear 实现
 */
var weekOfYear = require('dayjs/plugin/weekOfYear');
Dayjs.extend(weekOfYear);
export const  getWeek = () => {
    return Dayjs().week()
  }