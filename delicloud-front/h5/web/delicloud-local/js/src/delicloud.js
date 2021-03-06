(function(m) {
	function q(a, f, e, b) {
		if ("undefined" === typeof WebViewJavascriptBridge) return console.log("\u672a\u5b9a\u4e49WebViewJavascriptBridge");
		f = f || {};
		var c = function(b) {
				console.log("\u9ed8\u8ba4\u6210\u529f\u56de\u8c03", a, b)
			},
			l = function(b) {
				console.log("\u9ed8\u8ba4\u5931\u8d25\u56de\u8c03", a, b)
			};
		e && (c = e);
		b && (l = b);
		var g = function(b) {
				console.log("\u7edf\u4e00\u54cd\u5e94\uff1a", b);
				if (d.ios) {
					var a = JSON.parse(b) || {};
					b = a.code;
					a = a.data;
					0 == b ? c && c.call(null, a) : l && l.call(null, a, b)
				} else d.android && (a = JSON.parse(b) || {}, b = a.code, a = a.data, 0 == b ? c && c.call(null, a) : l && l.call(null, a, b))
			};
		d.android ? (WebViewJavascriptBridge.registerHandler(a, function(b, a) {
			g({
				code: "0",
				msg: "\u6210\u529f",
				result: b
			});
			a && a({
				code: "0",
				msg: "\u6210\u529f"
			})
		}), WebViewJavascriptBridge.callHandler(a, f, g)) : d.ios && (WebViewJavascriptBridge.registerHandler(a, function(b, a) {
			g(b);
			a && a({
				code: "0",
				msg: "\u6210\u529f"
			})
		}), WebViewJavascriptBridge.callHandler(a, f))
	}
	var r = ["backbutton"],
		n = m.navigator.userAgent,
		k = n.match(/DeliApp\(\w+\/([a-zA-Z0-9.-]+)\)/);
	null === k && (k = n.match(/DeliApp\/([a-zA-Z0-9.-]+)/));
	var k = k && k[1],
		p = !1,
		g = null,
		h = null,
		d = {
			ios: /iPhone|iPad|iPod/i.test(n),
			android: /Android/i.test(n),
			version: k,
			isDeliApp: function() {
				return this.version
			},
			type: function(a) {
				return Object.prototype.toString.call(a).match(/^\[object\s(.*)\]$/)[1]
			},
			config: function(a) {
				a && (g = {
					appId: a.appId || -1,
					timestamp: a.timestamp,
					noncestr: a.noncestr,
					sign: a.signature
				}, a.appId && (g.appId = a.appId))
			},
			error: function(a) {
				h = a
			},
			ready: function(a) {
				var f = function(b) {
						if (!b) return console.log("bridge\u521d\u59cb\u5316\u5931\u8d25");
						null !== g && g.sign ? d.ios ? b.callHandler("app.method.checkJsApis", g, function(c) {
							c = JSON.parse(c) || {};
							var d = c.data.msg || "";
							"0" === c.code && "0" === c.data.code ? a(b) : setTimeout(function() {
								h && h({
									code: -1,
									msg: "\u6743\u9650\u6821\u9a8c\u5931\u8d25 " + d
								})
							})
						}) : d.android && b.callHandler("app.method.checkJsApis", {
							path: "/app/premission/check/public",
							type: "get",
							params: g
						}, function(c) {
							c = JSON.parse(c) || {};
							var d = c.msg || "";
							"0" === c.code ? a(b) : setTimeout(function() {
								h && h({
									code: -1,
									msg: "\u6743\u9650\u6821\u9a8c\u5931\u8d25 " + d
								})
							})
						}) : setTimeout(function() {
							h && h({
								code: -1,
								msg: "\u6743\u9650\u6821\u9a8c\u5931\u8d25 \u914d\u7f6e\u7b7e\u540d\u5bf9\u8c61\u9519\u8bef"
							})
						});
						!1 === p && (p = !0, r.forEach(function(a) {
							d.ios && b.registerHandler(a, function(b, c) {
								var d = document.createEvent("HTMLEvents");
								d.data = b;
								d.initEvent(a);
								document.dispatchEvent(d);
								c && c({
									code: "0",
									msg: "\u6210\u529f"
								})
							})
						}), null === g && encodeURIComponent(window.location.href))
					},
					e = function(b) {
						if (window.WebViewJavascriptBridge) return b(WebViewJavascriptBridge);
						if (window.WVJBCallbacks) return window.WVJBCallbacks.push(b);
						window.WVJBCallbacks = [b];
						var a = document.createElement("iframe");
						a.style.display = "none";
						a.src = "wvjbscheme://__BRIDGE_LOADED__";
						document.documentElement.appendChild(a);
						setTimeout(function() {
							document.documentElement.removeChild(a)
						}, 0)
					};
				if (d.ios && m.WebViewJavascriptBridge) {
					try {
						WebViewJavascriptBridge.init(function(a, c) {
							console.log("WebViewJavascriptBridge init: ", a, c)
						})
					} catch (b) {
						console.log(b.msg)
					}
					return f(WebViewJavascriptBridge)
				}
				if (d.android && m.WebViewJavascriptBridge) {
					try {
						WebViewJavascriptBridge.init(function(a, c) {
							console.log("WebViewJavascriptBridge init: ", a, c)
						})
					} catch (b) {
						console.log(b.msg)
					}
					return f(WebViewJavascriptBridge)
				}
				if (d.ios) console.log("\u5f00\u59cb\u76d1\u542cWebViewJavascriptBridgeReady\u4e8b\u4ef6"), e(function(a) {
					f(WebViewJavascriptBridge)
				});
				else if (d.android) console.log("\u5f00\u59cb\u76d1\u542cWebViewJavascriptBridgeReady\u4e8b\u4ef6"), document.addEventListener("WebViewJavascriptBridgeReady", function() {
					if ("undefined" === typeof WebViewJavascriptBridge) return console.log("WebViewJavascriptBridge \u672a\u5b9a\u4e49");
					try {
						WebViewJavascriptBridge.init(function(a, c) {})
					} catch (b) {
						console.log(b.msg)
					}
					f(WebViewJavascriptBridge)
				}, !1);
				else return console.log("\u5f88\u62b1\u6b49\uff0c\u5c1a\u672a\u652f\u6301\u60a8\u6240\u6301\u8bbe\u5907")
			}
		},
		t = function(a, f) {
			a = a.split(".");
			for (var e = d, b = 0, c = a.length; b < c; b++) b === c - 1 && (e[a[b]] = f), "undefined" === typeof e[a[b]] && (e[a[b]] = {}), e = e[a[b]]
		};
	"common.navigation.setTitle common.navigation.setRight common.navigation.close common.image.upload common.image.preview common.file.upload common.location.open common.location.get common.message.share common.phone.vibrate common.connection.getNetworkType common.phone.getUUID common.phone.getInterface app.device.bind app.user.telephoneCall app.user.chatOpen app.user.select app.department.select common.notification.showPreloader common.notification.hidePreloader common.notification.toast app.organization.create app.organization.select app.method.transit app.user.get app.organization.get app.code.scan common.navigation.hide common.navigation.show".split(" ").forEach(function(a) {
		t(a, function(d, e, b) {
			q(a, d, e, b)
		})
	});
	m.deli = d;
	"object" === typeof module && module && "object" === typeof module.exports ? module.exports = d : "function" === typeof define && (define.amd || define.cmd) && define(function() {
		return d
	})
})(this);