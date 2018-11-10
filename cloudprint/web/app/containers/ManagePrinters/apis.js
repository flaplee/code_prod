export default {
  inkbox: `${process.env.PRINT_API}/app/inkbox/queryDetails`, // /{inkboxSn}
  printerTask: `${process.env.PRINT_API}/app/printerTask/queryPage`, // post printerSn pageNo pageSize
};
