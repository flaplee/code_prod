const HTML = `
<div class="browser">
<img
  class="browser-img"
  width="14px"
  height="14px"
  src="http://t.static.delicloud.com/www/home/images/prompt.png"
/>
<span class="browser-text">当前浏览器版本过低, 推荐使用最新版</span>
<a class="browser-link" href="https://ie.sogou.com/" target="_blank"
  >搜狗高速浏览器</a
>
</div>
`;
const browser = () => {
  const ele = document.createElement('div');
  ele.innerHTML = HTML;
  document.body.appendChild(ele);

  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `
    .deli-wrap-header {
      top: 40px;
    }

    #app {
      -ms-transform: translateY(40px);
      transform: translateY(40px);
    }
  `;
  document.getElementsByTagName('head')[0].appendChild(style);
};

window.onload = browser;
