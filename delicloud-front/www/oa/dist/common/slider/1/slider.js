'use strict';define(function(){function b(a,b){var c=a%b;return 0>c&&(c+=b),c}function c(a,b){var c='on'+b;'function'==typeof a[c]&&a[c]({type:b})}function d(a){a.delay&&(a.timer=setTimeout(function(){delete a.timer,a.slideTo(a.current+1)},a.delay))}var a=function(b,c,d,e){var f,g,h,i;if(!(this instanceof a))return new a(b,c,d,e);if(h=this,this.pushStack=[],this.removeStack=[],this.container=b,this.nav=e,b.on('mouseover',function(){i=h.delay,h.stopPlay()}),b.on('mouseout',function(){h.startPlay(i),i=void 0}),e&&(e.css('display','none'),e.on('click','>a',function(){var b,c;if(!$(this).hasClass('current'))for(c=e.find('>a'),b=0;b<c.length;b++)if(c[b]===this){h.slideTo(b);break}})),c instanceof Array&&0<c.length){for(this.children=c,this.current='number'==typeof d&&0<=d&&d<c.length?d:0,f=0;f<c.length;f++)b.append(c[f]),e&&(g=$('<a href="javascript:;"></a>'),e.append(g)),f===this.current?g&&g.addClass('current'):c[f].css('display','none');e&&1<c.length&&e.css('display','')}else this.current=void 0,this.children=[]};return a.prototype.add=function(a){var b,d;return this.sliding?this.pushStack.push(a):(b=this.children.length,this.container.append(a),this.children.push(a),this.nav&&(d=$('<a href="javascript:;"></a>'),this.nav.append(d)),0===b?(this.current=0,this.nav&&d.addClass('current'),c(this,'change')):(a.css('display','none'),this.nav&&this.nav.css('display',''))),b},a.prototype.remove=function(d){var e,f;return this.sliding?this.removeStack.push('number'==typeof d?this.children[d]:d):0<this.children.length&&('number'!=typeof d&&(d=this.children.indexOf(d)),d=b(d,this.children.length),e=this.children.splice(d,1)[0],e.remove(),this.nav&&(f=this.nav.find('>a').eq(d).remove()),(this.current===d||this.current===this.children.length)&&(0<this.children.length?(this.current=b(d,this.children.length),this.children[this.current].css('display',''),this.nav&&this.nav.find('>a').eq(this.current).addClass('current')):this.current=void 0,c(this,'change')),1===this.children.length&&this.nav&&this.nav.css('display','none')),e},a.prototype.slideTo=function(e,f){var g,h,a=this;return!this.sliding&&1<this.children.length?(e=b(e,this.children.length),e===this.current?g=!1:(this.timer&&(clearTimeout(this.timer),this.timer=void 0),f?(this.children[this.current].css('display','none'),this.children[e].css('display',''),d(this)):(this.sliding=!0,this.children[this.current].fadeOut(function(){a.children[a.current].fadeIn(function(){a.sliding=!1,d(a)})})),this.nav&&(h=this.nav.find('>a'),$(h[this.current]).removeClass('current'),$(h[e]).addClass('current')),this.current=e,c(this,'change'),g=!0)):g=!1,g},a.prototype.startPlay=function(a){this.stopPlay(),this.delay=a,d(this)},a.prototype.stopPlay=function(){var a;return this.delay?(delete this.delay,this.timer&&(clearTimeout(this.timer),delete this.timer),a=!0):a=!1,a},a});