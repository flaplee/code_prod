/**
 * msg 的权重顺序(高到低): 1.服务器返回; 2.自定义; 3.默认
 * 如要覆盖服务器的返回msg, 只有修改json对象, 如:
 * const json = fromServer();
 * if (json && json.msg) {
 *   json.msg = 'override'; // before checkJson(json)
 * }
 * checkJson(json)
 */
export const defaultMessage = '获取数据失败';

export const checkJson = (json, custom) => {
  const code = json && json.code;

  if (code === 0) {
    return;
  }

  let respondMsg = json && json.msg;
  respondMsg = typeof respondMsg === 'string' ? respondMsg : false;

  const msg = respondMsg || custom || defaultMessage;
  throw msg;
};
