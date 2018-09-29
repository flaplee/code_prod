// kernel
'use strict';
define(['common/slider/slider', 'site/pages/pages', 'site/popups/popups', 'site/panels/panels'], function(slider, pages, popups, panels) {
	var homePage,
		kernel = {
			location: {},
			appendCss: function(url) { //自动根据当前环境添加css或less
				var csslnk = document.createElement('link');
				if (/\.less$/.test(url)) {
					if (typeof less === 'object') {
						csslnk.rel = 'stylesheet/less';
						csslnk.href = url;
						less.sheets.push(csslnk);
						less.refresh();
					} else {
						csslnk.rel = 'stylesheet';
						csslnk.href = url.replace(/less$/, 'css');
					}
				} else {
					csslnk.rel = 'stylesheet';
					csslnk.href = url;
				}
				return (document.head || document.getElementsByTagName('head')[0]).appendChild(csslnk);
			},
			removeCss: function(lnk) {
				$(lnk).remove();
				if (lnk.rel === 'stylesheet/less') {
					less.sheets.splice(less.sheets.indexOf(lnk), 1);
					less.refresh();
				}
				return lnk.getAttribute('href');
			},
			buildHash: function(loc) {
				var n, hash = '#!' + encodeURIComponent(loc.id);
				for (n in loc.args) {
					hash += loc.args[n] === undefined ? '&' + encodeURIComponent(n) : '&' + encodeURIComponent(n) + '=' + encodeURIComponent(loc.args[n]);
				}
				return hash;
			},
			makeQr: function(str, s) {
	            var qrcode = new QRCode(0, QRErrorCorrectLevel.L);
	            qrcode.addData(str);
	            qrcode.make();
	            var lt, br;
	            var c = qrcode.getModuleCount();
	            var t = document.createElement('table');
	            var b = (s % c) / 2;
	            t.cellPadding = t.cellSpacing = 0;
	            t.style.tableLayout = 'fixed';
	            t.style.borderCollapse = 'separate';
	            t.style.backgroundColor = 'white';
	            t.style.width = t.style.height = s + 'px';
	            if (b) {
	                if (b % 1) {
	                    lt = Math.floor(b);
	                    br = lt + 1;
	                    t.style.padding = lt + 'px ' + br + 'px ' + br + 'px ' + lt + 'px';
	                } else {
	                    t.style.padding = b + 'px ';
	                }
	            }
	            for (var i = 0; i < c; i++) {
	                var r = t.insertRow(-1);
	                for (var j = 0; j < c; j++) {
	                    var k = r.insertCell(-1);
	                    if (qrcode.isDark(i, j)) {
	                        k.style.backgroundColor = 'black';
	                    }
	                }
	            }
	            return t;
	        },
	        SHA256: function(s) {
	            var chrsz = 8;
	            var hexcase = 0;

	            function safe_add(x, y) {
	                var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	                var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	                return (msw << 16) | (lsw & 0xFFFF);
	            }

	            function S(X, n) {
	                return (X >>> n) | (X << (32 - n));
	            }

	            function R(X, n) {
	                return (X >>> n);
	            }

	            function Ch(x, y, z) {
	                return ((x & y) ^ ((~x) & z));
	            }

	            function Maj(x, y, z) {
	                return ((x & y) ^ (x & z) ^ (y & z));
	            }

	            function Sigma0256(x) {
	                return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
	            }

	            function Sigma1256(x) {
	                return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
	            }

	            function Gamma0256(x) {
	                return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
	            }

	            function Gamma1256(x) {
	                return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
	            }

	            function core_sha256(m, l) {
	                var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
	                var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
	                var W = new Array(64);
	                var a, b, c, d, e, f, g, h, i, j;
	                var T1, T2;
	                m[l >> 5] |= 0x80 << (24 - l % 32);
	                m[((l + 64 >> 9) << 4) + 15] = l;
	                for (var i = 0; i < m.length; i += 16) {
	                    a = HASH[0];
	                    b = HASH[1];
	                    c = HASH[2];
	                    d = HASH[3];
	                    e = HASH[4];
	                    f = HASH[5];
	                    g = HASH[6];
	                    h = HASH[7];
	                    for (var j = 0; j < 64; j++) {
	                        if (j < 16) W[j] = m[j + i];
	                        else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
	                        T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
	                        T2 = safe_add(Sigma0256(a), Maj(a, b, c));
	                        h = g;
	                        g = f;
	                        f = e;
	                        e = safe_add(d, T1);
	                        d = c;
	                        c = b;
	                        b = a;
	                        a = safe_add(T1, T2);
	                    }
	                    HASH[0] = safe_add(a, HASH[0]);
	                    HASH[1] = safe_add(b, HASH[1]);
	                    HASH[2] = safe_add(c, HASH[2]);
	                    HASH[3] = safe_add(d, HASH[3]);
	                    HASH[4] = safe_add(e, HASH[4]);
	                    HASH[5] = safe_add(f, HASH[5]);
	                    HASH[6] = safe_add(g, HASH[6]);
	                    HASH[7] = safe_add(h, HASH[7]);
	                }
	                return HASH;
	            }

	            function str2binb(str) {
	                var bin = Array();
	                var mask = (1 << chrsz) - 1;
	                for (var i = 0; i < str.length * chrsz; i += chrsz) {
	                    bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
	                }
	                return bin;
	            }

	            function Utf8Encode(string) {
	                string = string.replace(/\r\n/g, "\n");
	                var utftext = "";
	                for (var n = 0; n < string.length; n++) {
	                    var c = string.charCodeAt(n);
	                    if (c < 128) {
	                        utftext += String.fromCharCode(c);
	                    } else if ((c > 127) && (c < 2048)) {
	                        utftext += String.fromCharCode((c >> 6) | 192);
	                        utftext += String.fromCharCode((c & 63) | 128);
	                    } else {
	                        utftext += String.fromCharCode((c >> 12) | 224);
	                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
	                        utftext += String.fromCharCode((c & 63) | 128);
	                    }
	                }
	                return utftext;
	            }

	            function binb2hex(binarray) {
	                var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
	                var str = "";
	                for (var i = 0; i < binarray.length * 4; i++) {
	                    str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
	                        hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
	                }
	                return str;
	            }
	            s = Utf8Encode(s);
	            return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
	        },
			buildDauth: function(userid, token, timestamp) {
				//userid timestamp token
	            var hashLoc = (userid ? userid : '' ) + (token ? token : '') + timestamp;
	            var sha256 = kernel.SHA256(hashLoc);
	            var hash = sha256.substr(0, 32);
	            return hash;
	        },
			parseHash: function(hash) {
				var i, a, s, nl = {
					id: homePage,
					args: {}
				};
				hash = hash.substr(1).replace(/[#\?].*$/, '');
				s = hash.match(/[^=&]+(=[^&]*)?/g);
				if (s) {
					if (s[0].charAt(0) === '!') {
						a = s[0].substr(1);
						if (a in pages) {
							nl.id = decodeURIComponent(a);
						}
					}
					for (i = 1; i < s.length; i++) {
						a = s[i].match(/^([^=]+)(=)?(.+)?$/);
						if (a) {
							nl.args[decodeURIComponent(a[1])] = a[2] ? decodeURIComponent(a[3] || '') : undefined;
						}
					}
				}
				return nl;
			},
			isSameLocation: function(loc1, loc2) {
				var n;
				if (loc1.id === loc2.id && Object.keys(loc1.args).length === Object.keys(loc2.args).length) {
					for (n in loc1.args) {
						if (n in loc2.args) {
							if (loc1.args[n] === undefined) {
								if (loc2.args[n] !== undefined) {
									return false;
								}
							} else {
								if ('' + loc1.args[n] !== '' + loc2.args[n]) {
									return false;
								}
							}
						} else {
							return false;
						}
					}
					return true;
				} else {
					return false;
				}
			},
			replaceLocation: function(loc) {
				if (kernel.location && kernel.isSameLocation(loc, kernel.location)) {
					kernel.reloadPage();
				} else {
					location.replace(kernel.buildHash(loc));
				}
			}
		};

	! function() {
		kernel.listeners = {
			add: function(o, e, f) {
				if (!o.xEvents) {
					o.xEvents = function(evt) { //override internal event manager
						xEventProcessor(o, evt);
					};
				}
				if (!o.xEvents[e]) {
					o.xEvents[e] = [];
					o.xEvents[e].stack = [];
					o.xEvents[e].locked = false;
					o['on' + e] = o.xEvents;
				}
				if (o.xEvents[e].locked) {
					o.xEvents[e].stack.push([false, f]);
				} else {
					if (o.xEvents[e].indexOf(f) < 0) {
						o.xEvents[e].push(f);
					}
				}
			},
			list: function(o, e) {
				var r, n;
				if (e) {
					if (o.xEvents && o.xEvents[e]) {
						r = o.xEvents[e].slice(0);
					} else {
						r = [];
					}
				} else {
					r = {};
					if (o.xEvents) {
						for (n in o.xEvents) {
							if ($.type(o.xEvents[n]) === 'array' && o.xEvents[n].length) {
								r[n] = o.xEvents[n].slice(0);
							}
						}
					}
				}
				return r;
			},
			remove: function(o, e, f) {
				var n, addRemoveMark, tmp;
				if (o.xEvents) {
					if (e) {
						if (o.xEvents[e]) {
							if (o.xEvents[e].locked) {
								if (f) {
									o.xEvents[e].stack.push([true, f]);
								} else {
									o.xEvents[e].stack.push(null);
								}
							} else {
								if (f) {
									tmp = o.xEvents[e].indexOf(f);
									if (tmp >= 0) {
										o.xEvents[e].splice(tmp, 1);
									}
								} else {
									o.xEvents[e].splice(0, o.xEvents[e].length);
								}
							}
							if (o.xEvents[e].length === 0) {
								delete o.xEvents[e];
								o['on' + e] = null;
							}
						}
					} else {
						if (!o.xEvents.removeMark) {
							for (n in o.xEvents) {
								if (!o.xEvents[n].locked) {
									delete o.xEvents[n];
									o['on' + n] = null;
								} else {
									addRemoveMark = true;
								}
							}
							if (addRemoveMark) {
								o.xEvents.removeMark = true;
							} else {
								delete o.xEvents;
							}
						}
					}
				}
			}
		};

		function xEventProcessor(o, evt) {
			var i, tmp;
			o.xEvents[evt.type].locked = true;
			for (i = 0; i < o.xEvents[evt.type].length; i++) {
				o.xEvents[evt.type][i].call(o, evt);
			}
			o.xEvents[evt.type].locked = false;
			while (o.xEvents[evt.type].stack.length) {
				if (o.xEvents[evt.type].stack[0]) {
					tmp = o.xEvents[evt.type].indexOf(o.xEvents[evt.type].stack[0][1]);
					if (o.xEvents[evt.type].stack[0][0]) {
						if (tmp >= 0) {
							o.xEvents[evt.type].splice(tmp, 1);
						}
					} else {
						if (tmp < 0) {
							o.xEvents[evt.type].push(o.xEvents[evt.type].stack[0][1]);
						}
					}
				} else {
					o.xEvents[evt.type].splice(0, o.xEvents[evt.type].length);
				}
				o.xEvents[evt.type].stack.shift();
			}
			if (!o.xEvents[evt.type].length) {
				delete o.xEvents[evt.type];
				o['on' + evt.type] = null;
			}
			if (o.xEvents.removeMark) {
				delete o.xEvents.removeMark;
				for (i in o.xEvents) {
					delete o.xEvents[i];
					o['on' + i] = null;
				}
				delete o.xEvents;
			}
		}
	}();

	//panel
	! function() {
		var activePanel, ani, todo,
			panelCtn = document.getElementById('panels'),
			ctn = panelCtn.lastChild.firstChild;
		kernel.openPanel = function(id, param) {
			var panelcfg = panels[id];
			if (panelcfg) {
				initLoad('panel', panelcfg, id, function() {
					if (typeof panelcfg.open === 'function') {
						panelcfg.open(param);
					} else {
						kernel.showPanel(id, param);
					}
				});
			} else {
				kernel.hint('panel config not found: ' + id, 'error');
			}
		};
		kernel.showPanel = function(id, param) {
			if (ani) {
				setTodo();
			} else {
				if (activePanel) {
					hidePanel();
					setTodo();
				} else {
					if (typeof panels[id].onload === 'function') {
						panels[id].onload(param);
					}
					panelCtn.className = activePanel = id;
					panelCtn.style.display = document.getElementById(id).style.display = 'block';
					startAni(function() {
						if (typeof panels[id].onloadend === 'function') {
							panels[id].onloadend();
						}
					}, true);
				}
			}

			function setTodo() {
				setTimeout(function() {
					todo = function() {
						kernel.showPanel(id, param);
					}
				}, 0);
			}
		};
		kernel.closePanel = function(id) {
			var close;
			if (ani) {
				setTimeout(function() {
					todo = function() {
						kernel.closePanel(id);
					};
				}, 0);
			} else {
				if (activePanel) {
					if (typeof id === 'string') {
						close = id === activePanel;
					} else if ($.type(id) === 'array') {
						close = id.indexOf(activePanel) >= 0;
					} else {
						close = true;
					}
					if (close) {
						hidePanel();
					} else if (todo) {
						todo = undefined;
					}
				}
			}
		};
		kernel.destoryPanel = function(id) {
			var p = panels[id];
			if (p) {
				destory(p, 'panel', id);
			}
		};
		$(panelCtn.firstChild).on('click', kernel.closePanel);
		$(ctn.firstChild).on('click', kernel.closePanel);

		function startAni(cb, show) {
			ani = true;
			$(ctn).animate({
				'margin-left': show ? '-100%' : '0%'
			}, {
				duration: 200,
				complete: function() {
					ani = false;
					cb();
					if (typeof todo === 'function') {
						todo();
						todo = undefined;
					}
				}
			});
		}

		function hidePanel() {
			if (typeof panels[activePanel].onunload === 'function') {
				panels[activePanel].onunload();
			}
			startAni(function() {
				if (typeof panels[activePanel].onunloadend === 'function') {
					panels[activePanel].onunloadend();
				}
				document.getElementById(activePanel).style.display = panelCtn.style.display = '';
				activePanel = undefined;
			}, false);
		}
	}();

	//弹出窗口
	! function() {
		var activePopup, popup = document.getElementById('popups');
		kernel.openPopup = function(id, param) {
			var popupcfg = popups[id];
			if (popupcfg) {
				initLoad('popup', popupcfg, id, function() {
					if (typeof popupcfg.open === 'function') {
						popupcfg.open(param);
					} else {
						kernel.showPopup(id, param);
					}
				});
			} else {
				kernel.hint('popup config not found: ' + id, 'error');
			}
		};
		kernel.showPopup = function(id, param) {
			var fire, popupcfg = popups[id];
			if (activePopup) {
				if (typeof popups[activePopup].onunload === 'function') {
					popups[activePopup].onunload();
				}
				document.getElementById(activePopup).style.display = '';
			} else {
				popup.style.display = 'block';
				fire = true;
			}
			activePopup = id;
			popup.className = id;
			document.getElementById(id).style.display = 'block';
			if (fire && typeof kernel.popupEvents.onshow === 'function') {
				kernel.popupEvents.onshow({
					type: 'show'
				});
			}
			if (typeof popupcfg.onload === 'function') {
				popupcfg.onload(param);
			}
		};
		kernel.closePopup = function(id) {
			var close;
			if (activePopup) {
				if (typeof id === 'string') {
					close = id === activePopup;
				} else if ($.type(id) === 'array') {
					close = id.indexOf(activePopup) >= 0;
				} else {
					close = true;
				}
				if (close) {
					if (typeof popups[activePopup].onunload === 'function') {
						popups[activePopup].onunload();
					}
					document.getElementById(activePopup).style.display = '';
					close = activePopup;
					popup.className = popup.style.display = activePopup = '';
					if (typeof kernel.popupEvents.onhide === 'function') {
						kernel.popupEvents.onhide({
							type: 'hide',
							id: close
						});
					}
					return true;
				}
			}
		};

		// 获取当前显示的 popup id
		kernel.getCurrentPopup = function() {
			return activePopup;
		};
		kernel.destoryPopup = function(id) {
			var p = popups[id];
			if (p) {
				destory(p, 'popup', id);
			}
		};
		kernel.popupEvents = {};
		$('#popups>div>a').on('click', function() {
			kernel.closePopup();
		});
	}();
	//图片展示
	! function() {
		var ctn = $('#photoview'),
			close = ctn.find('.close'),
			prev = ctn.find('.prev'),
			next = ctn.find('.next'),
			rp = ctn.find('.rotate.p'),
			rn = ctn.find('.rotate.n'),
			sld = slider(ctn.find('>div')),
			siz = [],
			deg = [],
			w, h;
		kernel.showPhotoView = function(contents, idx) {
			var i;
			if ($.type(contents) === 'array') {
				for (i = 0; i < contents.length; i++) {
					sld.add($('<img src="' + contents[i] + '"/>'));
					getsz(i);
				}
				if (idx >= 0 && idx < sld.children.length) {
					sld.slideTo(idx, true);
				}
				if (sld.children.length > 1) {
					prev.css('display', 'block');
					next.css('display', 'block');
				} else {
					prev.css('display', '');
					next.css('display', '');
				}
			}
		};
		kernel.hidePhotoView = function() {
			siz = [];
			while (sld.children.length) {
				sld.remove(0);
			}
		};
		ctn.on('click', '>div>img', function() {
			var d;
			if (this.style.cursor === 'zoom-in') {
				d = deg[sld.current] % 2;
				if (d) {
					this.style.top = siz[sld.current].w > h ? (siz[sld.current].w - siz[sld.current].h) / 2 + 'px' : (h - siz[sld.current].h) / 2 + 'px';
					this.style.left = siz[sld.current].h > w ? (siz[sld.current].h - siz[sld.current].w) / 2 + 'px' : (w - siz[sld.current].w) / 2 + 'px';
				} else {
					this.style.top = siz[sld.current].h > h ? 0 : (h - siz[sld.current].h) / 2 + 'px';
					this.style.left = siz[sld.current].w > w ? 0 : (w - siz[sld.current].w) / 2 + 'px';
				}
				this.style.width = siz[sld.current].w + 'px';
				this.style.height = siz[sld.current].h + 'px';
				this.style.cursor = 'zoom-out';
			} else if (this.style.cursor === 'zoom-out') {
				chksz(sld.current);
			}
		});
		$(window).on('resize', rsz);
		prev.on('click', function() {
			sld.slideTo(sld.current - 1);
		});
		next.on('click', function() {
			sld.slideTo(sld.current + 1);
		});
		rp.on('click', function() {
			if (typeof deg[sld.current] === 'number') {
				deg[sld.current]++;
				chksz(sld.current);
			}
		});
		rn.on('click', function() {
			if (typeof deg[sld.current] === 'number') {
				deg[sld.current]--;
				chksz(sld.current);
			}
		});
		close.on('click', kernel.hidePhotoView);
		sld.onchange = function() {
			if (this.current === undefined) {
				ctn.css('display', '');
			} else {
				if (siz[this.current]) {
					chksz(this.current);
				}
				ctn.css('display', 'block');
			}
		};
		if ('transform' in document.documentElement.style) {
			rp.css('display', 'block');
			rn.css('display', 'block');
		}
		rsz();

		function rsz() {
			w = $(window).innerWidth();
			h = $(window).innerHeight();
			if (typeof sld.current === 'number' && siz[sld.current]) {
				chksz(sld.current);
			}
		}

		function getsz(i) {
			sld.children[i].one('load', function() {
				siz[i] = {
					w: this.width,
					h: this.height
				};
				deg[i] = 0;
				if (sld.current === i) {
					chksz(i);
				}
				this.style.visibility = 'visible';
			});
		}

		function chksz(i) {
			var r, cw, ch, dw, dh,
				d = deg[i] % 2;
			if (d) {
				dw = siz[i].h;
				dh = siz[i].w;
			} else {
				dw = siz[i].w;
				dh = siz[i].h;
			}
			if (dw > w || dh > h) {
				r = dw / dh;
				if (w / h > r) {
					ch = h;
					cw = ch * r;
				} else {
					cw = w;
					ch = cw / r;
				}
				if (d) {
					dw = ch;
					dh = cw;
				} else {
					dw = cw;
					dh = ch;
				}
				sld.children[i].css('cursor', 'zoom-in');
			} else {
				dw = siz[i].w;
				dh = siz[i].h;
				sld.children[i].css('cursor', '');
			}
			sld.children[i].css({
				top: (h - dh) / 2 + 'px',
				left: (w - dw) / 2 + 'px',
				width: dw + 'px',
				height: dh + 'px',
				transform: 'rotate(' + 90 * deg[i] + 'deg)'
			});
		}
	}();
	//对话框及提示功能
	! function() {
		var hintmo,
			hintCtn = document.getElementById('hintCtn'),
			hintmoIcon,
			loadingRT = 0,
			dlgCtn = document.getElementById('dialogs'),
			dlgStack = [],
			dlgCb, raCb; //callbacks
		kernel.showLoading = function(text) { //loading提示框, 每次调用引用计数＋1所以showLoading和hideLoading必须成对使用
			$('#loading>div>div').text(text ? text : '加载中...');
			if (loadingRT === 0) {
				document.getElementById('loading').style.display = 'block';
			}
			loadingRT += 1;
		};
		kernel.hideLoading = function() { //不要使用hideDialog来关闭loading提示框
			if (loadingRT > 0) {
				loadingRT -= 1;
				if (loadingRT === 0) {
					document.getElementById('loading').style.display = '';
					if (typeof kernel.dialogEvents.onloaded === 'function') {
						kernel.dialogEvents.onloaded({
							type: 'loaded'
						});
					}
				}
			}
		};
		kernel.isLoading = function() {
			return loadingRT > 0;
		};
		kernel.hint = function(text, className, t) {
			var o = $('#hint');
			o.prop('className', className ? className : '');
			o.find('span').text(text);
			if (hintmo) {
				clearTimeout(hintmo);
			} else {
				o.css('display', 'block');
				o[0].offsetWidth;
				o.fadeIn();
			}
			if (!t) {
				t = className === 'error' ? 4000 : className === 'warning' ? 3000 : 2000;
			}
			hintmo = setTimeout(function() {
				hintmo = 0;
				o.fadeOut(function() {
					o.css('display', '');
				});
			}, t);
		};
		kernel.hintIcon = function(className, text, t){
			var o = $('#hintIcon');
			o.prop('className', className ? className : '');
			o.find('p.title').text(text.title);
			o.find('p.desc').text(text.desc);
			(className && className == 'success')? o.find('div.icon').html('<i class="iconfont">&#xe649;</i>') : o.find('div.icon').html('<i class="iconfont">&#xe66b;</i>');
			if (hintmoIcon) {
				clearTimeout(hintmoIcon);
			} else {
				o.css('display', 'block');
				o[0].offsetWidth;
				o.fadeIn();
			}
			if (!t) {
				t = 3000;
			}
			hintmoIcon = setTimeout(function() {
				hintmoIcon = 0;
				o.fadeOut(function() {
					o.css('display', '');
				});
			}, t);
		};
		kernel.showReadable = function(html, width, height, callback, className) {
			$('#readable').prop('className', className || '').css('display', 'block').find('>div').css({
				width: width,
				height: height
			}).find('>div').append(html);
			raCb = callback;
		};
		kernel.hideReadable = function() {
			if (typeof raCb === 'function') {
				raCb();
				raCb = undefined;
			}
			$('#readable').css('display', '').find('>div>div>*').remove();
		};
		kernel.hideDialog = function(param) {
			var f;
			if (typeof dlgCb === 'function') {
				if (dlgCtn.className === 'isConfirm') {
					dlgCb(param);
				} else if (dlgCtn.className === 'isAlert') {
					dlgCb();
				}
				dlgCb = undefined;
			}
			dlgCtn.className = '';
			if (dlgStack.length > 0) {
				f = dlgStack[0][0];
				dlgStack[0].shift();
				kernel[f].apply(this, dlgStack[0]);
				dlgStack.shift();
			}
		};
		kernel.showForeign = function(url, width, height, callback) {
			kernel.showReadable('<iframe frameborder="no" allowtransparency="yes" marginwidth="0" marginheight="0" src="' + url + '"></iframe>', width, height, callback, 'foreign');
		};
		kernel.confirm = function(text, callback, width, height) {
			var ctn, txt;
			if (dlgCtn.className === '') {
				ctn = $(dlgCtn).find('>div');
				txt = ctn.find('>div>div')
				dlgCb = callback;
				ctn.css('width', width || '400px');
				txt.text(text);
				dlgCtn.className = 'isConfirm';
				ctn.css('height', txt.outerHeight() + Math.max($(dlgCtn).find('>div>a.yes').outerHeight(), $(dlgCtn).find('>div>a.no').outerHeight()) + 76 + 'px');
			} else {
				dlgStack.push(['confirm', text, callback, width, height]);
			}
		};
		kernel.alert = function(text, callback, width, height) {
			var ctn, txt;
			if (dlgCtn.className === '') {
				ctn = $(dlgCtn).find('>div');
				txt = ctn.find('>div>div');
				dlgCb = callback;
				ctn.css('width', width || '400px');
				txt.text(text);
				dlgCtn.className = 'isAlert';
				ctn.css('height', txt.outerHeight() + 46 + 'px');
			} else {
				dlgStack.push(['alert', text, callback, width]);
			}
		};
		$('#readable>div>a').on('click', kernel.hideReadable);
		$(window).on('keydown', function(evt) {
			if (evt.keyCode === 27 && $('#readable').css('display') === 'block') {
				kernel.hideReadable();
			}
		});
		$(dlgCtn).find('>div>a.close').on('click', kernel.hideDialog);
		$(dlgCtn).find('>div>a.yes').on('click', function() {
			kernel.hideDialog(true);
		});
		$(dlgCtn).find('>div>a.no').on('click', function() {
			kernel.hideDialog(false);
		});
		//目前只有loaded事件
		kernel.dialogEvents = {};
	}();

	//页面加载相关功能
	! function() {
		var currentpage;
		//初始化并启动路由或者修改默认页
		//当调用此方法后引起路由变化则会返回true
		kernel.init = function(home) {
			var tmp;
			if (home in pages) {
				if (homePage) {
					tmp = homePage;
					homePage = home;
					if (kernel.location && kernel.location.id === tmp) {
						if (!kernel.isSameLocation(kernel.location, kernel.parseHash(location.hash))) {
							hashchange();
							return true;
						}
					}
				} else {
					homePage = home;
					if ('onhashchange' in window) {
						$(window).on('hashchange', hashchange);
					} else {
						setInterval(function() {
							if (tmp !== location.hash) {
								tmp = location.hash;
								hashchange();
							}
						}, 10);
					}
					hashchange();
					return true;
				}
			}
		};
		kernel.reloadPage = function(id, silent) {
			var thislocation;
			// 是否有数据正在加载
			if (kernel.isLoading()) {
				thislocation = kernel.location;
				// 注册监听 ; loaded
				kernel.listeners.add(kernel.dialogEvents, 'loaded', listener);
			} else {
				reloadPage(id, silent);
			}

			function listener(evt) {
				kernel.listeners.remove(this, evt.type, listener);
				// url 是否改变
				if (kernel.isSameLocation(thislocation, kernel.location)) {
					reloadPage(id, silent);
				}
			}
		};
		kernel.destoryPage = function(id) {
			var p = pages[id];
			if (p) {
				destory(p, 'page', id);
			}
		};
		kernel.pageEvents = {};

		function reloadPage(id, silent){
			if (!id || (typeof id === 'string' && id === currentpage) || ($.type(id) === 'array' && id.indexOf(currentpage) >= 0)) {
				if (!silent) {
					clearWindow();
				}
				if (typeof pages[currentpage].onunload === 'function') {
					pages[currentpage].onunload();
				}
				if (typeof pages[currentpage].onload === 'function') {
					pages[currentpage].onload(true);
				}
			}
		}

		function hashchange() {
			var nl = kernel.parseHash(location.hash);
			if (!kernel.location || !kernel.isSameLocation(kernel.location, nl)) {
				kernel.lastLocation = kernel.location;
				kernel.location = nl;
				clearWindow();
				if (typeof kernel.pageEvents.onroute === 'function') {
					kernel.pageEvents.onroute({
						type: 'route'
					});
				}
				initLoad('page', pages[nl.id], nl.id, function() {
					//发生页面跳转或首次加载
					if (nl.id !== currentpage) {
						if (currentpage) {
							if (typeof pages[currentpage].onunload === 'function') {
								pages[currentpage].onunload();
							}
							document.getElementById(currentpage).style.display = '';
						} else {
							if ('autopopup' in nl.args) {
								kernel.openPopup(nl.args.autopopup, nl.args.autopopuparg ? JSON.parse(nl.args.autopopuparg) : undefined);
							}
						}
						document.body.className = currentpage = nl.id;
						document.getElementById(nl.id).style.display = 'block';
						if (typeof pages[nl.id].onload === 'function') {
							pages[nl.id].onload(true);
						}
					} else {
						if (typeof pages[nl.id].onload === 'function') {
							//未发生页面跳转但url有变化时允许页面缓存
							pages[nl.id].onload();
						}
					}
					if (typeof kernel.pageEvents.onroutend === 'function') {
						kernel.pageEvents.onroutend({
							type: 'routend'
						});
					}
				});
			}
		}
	}();
	return kernel;

	function destory(cfg, type, id) {
		var o, n = type + '/' + id + '/';
		if (cfg.loaded === 2 && typeof cfg.ondestory === 'function') {
			cfg.ondestory();
		}
		$('#' + id).remove();
		if (cfg.css && typeof cfg.css !== 'string') {
			cfg.css = kernel.removeCss(cfg.css).substr(require.toUrl(n).length);
		}
		if (cfg.js) {
			n += cfg.js;
			if (require.defined(n)) {
				o = require(n);
				require.undef(n);
				if (o) {
					for (n in o) {
						delete cfg[n];
					}
				}
			}
		}
		cfg.loaded = 0;
	}

	function initLoad(type, oldcfg, id, callback) {
		if (oldcfg.loaded === 2) {
			callback();
		} else if (oldcfg.loaded !== 1) {
			oldcfg.loaded = 1;
			var url, ctn = '#' + type + 's',
				n = type + '/' + id + '/',
				m = require.toUrl(n),
				isPage = type === 'page';
			if (type === 'popup') {
				ctn += '>div>div';
			} else if (type === 'panel') {
				ctn += '>.contents>div';
			}
			ctn = $(ctn)[0];
			if (typeof oldcfg.css === 'string') {
				oldcfg.css = kernel.appendCss(m + oldcfg.css);
			}
			if ('html' in oldcfg) {
				url = m + oldcfg.html
				$.ajax({
					url: url,
					type: 'get',
					dataType: 'text',
					success: function(text) {
						//delete oldcfg.html;
						ctn.insertAdjacentHTML('afterBegin', '<div id="' + id + '">' + text + '</div>');
						loadJs();
					},
					error: function(xhr, msg) {
						destory(oldcfg, type, id);
						if (require.data.debug || xhr.status !== 404) {
							errorOccurs(url, xhr.status, isPage);
						} else {
							updated(isPage);
						}
					},
					complete: kernel.hideLoading
				});
				kernel.showLoading();
			} else {
				ctn.insertAdjacentHTML('afterBegin', '<div id="' + id + '"></div>');
				loadJs();
			}
		}

		function loadJs() {
			var js;
			if ('js' in oldcfg) {
				kernel.showLoading();
				js = n + oldcfg.js;
				require([js], function(cfg) {
					if (cfg) {
						Object.assign(oldcfg, cfg);
					}
					oldcfg.loaded = 2;
					callback();
					kernel.hideLoading();
				}, require.data.debug ? undefined : function(error) {
					destory(oldcfg, type, id);
					if ((error.requireType && error.requireType !== 'scripterror' && error.requireType !== 'nodefine') || (error.xhr && error.xhr.status !== 404)) {
						errorOccurs(js, error.message, isPage);
					} else {
						updated(isPage);
					}
					kernel.hideLoading();
				});
			} else {
				oldcfg.loaded = 2;
				callback();
			}
		}
	}

	function errorOccurs(res, msg, isPage) {
		/*kernel.alert('加载' + res + '时发生了一个错误: ' + msg, isPage ? function() {
			history.back();
		} : undefined);*/
		kernel.hint('网络异常，请稍后再试', 'error');
	}

	function updated(isPage) {
		if (isPage) {
			location.reload();
		} else {
			kernel.confirm('网站已经更新, 使用该功能需要先重新加载. 是否立即刷新本页?', function(sure) {
				if (sure) {
					location.reload();
				}
			});
		}
	}
	
	function clearWindow() {
		kernel.closePanel();
		kernel.closePopup();
		kernel.hideReadable();
	}
});