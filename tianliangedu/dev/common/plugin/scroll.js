define(function(){"use strict";var t=function(t){var n={callback:function(){},st:"",tick:"100",rander:!0};this.setting=$.extend(n,t)};t.prototype={constructor:t,init:function(){var t=this,n=t.setting;window.onscroll=function(){t.scroll.call(t,n.callback)},n.rander&&n.callback()},scroll:function(t){var n=this,c=n.setting,i=c.st;i&&clearTimeout(i),c.st=setTimeout(function(){t()},c.tick)}};var n=function(n){var c=new t({callback:n});return c.init(),c};return n});
//# sourceMappingURL=min.js.map