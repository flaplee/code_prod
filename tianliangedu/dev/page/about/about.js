"use strict";
require(["/framework/config.js"], function() {
    var e = document.head || document.getElementsByTagName("head")[0],
        n = document.createElement("link"),
        t = document.createElement("link");
    n.rel = t.rel = "stylesheet", n.href = require.toUrl("site/index/index.css"), t.href = require.toUrl("site/kernel/kernel.css"), require(["index/index"]), require(["site/ready/ready", "site/kernel/kernel"], function(e, n) {
        var t, a, i, d, r, u;
        return n.appendCss("/dev/page/about/about.css"), t = $("#about .about-box"), a = t.find(".about-nav ul li.sb-item"), i = a.find("ul.sub-tag"), d = t.find(".about-content"), r = d.find("section"), u = {
            func: {
                init: function() {},
                setNavInit: function(e, n) {
                    a.find("ul.sub-tag li").removeClass("cur"), i.find("." + e).addClass("cur"), r.hide().removeClass("cur"), r.each(function(t, a) {
                        return $(a).data("anchor") == e && $(a).data("type") == n ? r.eq(t).show().addClass("cur") : void 0
                    })
                }
            }
        }, e(function() {
            document.body.className = "ready", document.getElementById("loading").style.display = ""
        }), {
            onload: function() {},
            onunload: function() {}
        }
    }), e.appendChild(n), e.appendChild(t)
});