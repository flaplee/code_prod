import styled from 'styled-components';
import media from 'style/media';

export default styled.div`
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
  ${media.small`
    max-width: 540px;
  `};
  ${media.medium`
    max-width: 720px;
  `};
  ${media.large`
    max-width: 960px;
  `};
  ${media.extraLarge`
    max-width: 1140px;
  `};
`;
