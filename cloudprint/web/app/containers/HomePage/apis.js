export default {
  uploadByFile: `${process.env.PRINT_API_COVERT}/file/uploadByFile`,
  printerTask: `${process.env.PRINT_API}/app/printerTask/queryMyPage`,
  cancelTask: `${process.env.PRINT_API}/app/printerTask/cancel`, // /{taskCode}
  deleteTask: `${process.env.PRINT_API}/app/printerTask/delete`, // ?id
  taskDetail: `${process.env.PRINT_API}/app/printerTask/queryPage`,
};
