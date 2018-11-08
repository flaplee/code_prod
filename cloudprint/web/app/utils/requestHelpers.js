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
