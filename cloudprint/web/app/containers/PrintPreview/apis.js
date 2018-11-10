export default {
  findByFileId: `${process.env.PRINT_API_COVERT}/file/findByFileId`, // 轮询
  preview: `${process.env.PRINT_API_COVERT}/file/preview`, // 拼接 {fileid}_{pageNo}_{width}_{height}
  printerTaskDetail: `${process.env.PRINT_API}/app/printerTask/queryDetais`, // get /{taskCode}
  apply: `${process.env.PRINT_API}/v1/app/printTask/apply`, // post  创建普通打印任务
  scanApply: `${process.env.PRINT_API}/v1/app/printTask/scanApply`, // post  创建扫码打印任务
};
