// import { User } from "../store/user";

// export const getLevelString = (index) => {
//   return User.levelDef[index] && User.levelDef[index].name;
// };

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.extend(require('dayjs/plugin/relativeTime'));
dayjs.locale('zh-cn');

const findLast = (arr, fn) => arr.filter(fn).pop();
const findLastIndex = (arr, fn) =>
  (arr
    .map((val, i) => [i, val])
    .filter(([i, val]) => fn(val, i, arr))
    .pop() || [-1])[0];
    

 const fixedIntger = (value, digits = 0) => {
  let result = '0';
  if (typeof value === "number") {
    result = value.toFixed(digits);
  } else if (typeof value === "string") {
    result = parseFloat(value).toFixed(digits);
  }
  return parseFloat(result);
}

export {
  dayjs,
  findLast,
  fixedIntger,
  findLastIndex
}