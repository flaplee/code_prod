export default {
  login: `${process.env.PRINT_API}/a/auth/login/web`,
  config: `${process.env.PRINT_API}/a/auth/config`,
  printer: `${process.env.PRINT_API}/app/printer/queryPage`,
  printerStatus: `${process.env.PRINT_API}/app/printer/queryStatus`, // get /{printerSn}
};
