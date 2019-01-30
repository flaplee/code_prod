export default ({ limit, pos, totalPage }) => {
  const n = Math.ceil((pos + 1) / limit);

  let lazy = n * limit;
  lazy = lazy < totalPage ? lazy : totalPage;
  return lazy;
};
