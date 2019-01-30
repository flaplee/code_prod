import isIE9OrBelow from 'utils/isIE9OrBelow';

export default ({ recommend: Recommend, backward: Backward }) =>
  isIE9OrBelow() === true ? Backward : Recommend;
