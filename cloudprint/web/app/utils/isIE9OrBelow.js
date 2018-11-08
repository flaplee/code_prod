export default () =>
  /MSIE\s/.test(navigator.userAgent) &&
  parseFloat(navigator.appVersion.split('MSIE')[1]) < 10;
