import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  body {
    margin: 0;
    font-size: 14px;
    font-family: 'Microsoft YaHei','Helvetica Neue', Helvetica, Arial, sans-serif;
    background-color: #F6F6F6;
  }

  #app{
    padding-top:80px;
    background-color: #f6f6f6;
  }

  a{
    text-decoration: none;
  }

  ul,
  li{
    list-style: none;
  }

  p,
  ul,
  li{
    padding: 0;
    margin: 0;
  }

  input{
    appearance: textfield;
    &::-webkit-outer-spin-button{
      appearance: none;
      margin: 0;
    }
    &::-webkit-inner-spin-button{
      appearance: none;
      margin: 0;
    }
  }

  .deli-wrap-footer {
    &&& {
      display:none;
    }
  }
`;
