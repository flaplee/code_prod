const tip = '所选页码不正确';

export default form => {
  const { printWhole, printStartPage, printEndPage, fileList } = form;

  const { totalPage } = fileList;

  const verifyPage = () => {
    // skip verify page
    if (printWhole === 1) return;

    if (printStartPage < 1) throw tip;

    if (printEndPage > totalPage) throw tip;

    if (printStartPage > printEndPage) throw tip;
  };

  verifyPage();
};
