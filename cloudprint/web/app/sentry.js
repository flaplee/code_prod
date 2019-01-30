import { init } from '@sentry/browser';

export default () => {
  init({
    dsn: 'https://1690092bd868411d9a5dc6aa9d8828a7@sentry.delicloud.xin/10',
    environment: process.env.SILV_CLOUD_ENV || 'local',
  });
  // should have been called before using it here
  // ideally before even rendering your react app
};
