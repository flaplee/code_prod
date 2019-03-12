"use strict";
require(["/framework/config.js"], function() {
    var e = document.head || document.getElementsByTagName("head")[0],
        n = document.createElement("link"),
        t = document.createElement("link");
    n.rel = t.rel = "stylesheet", n.href = require.toUrl("site/index/index.css"), t.href = require.toUrl("site/kernel/kernel.css"), require(["site/index/index"]), require(["site/ready/ready", "site/kernel/kernel"], function(e, n) {
        return n.appendCss("/dev/page/special/special.css"), e(function() {
            document.body.className = "ready", document.getElementById("loading").style.display = ""
        }), {
            onload: function() {},
            onunload: function() {}
        }
    }), e.appendChild(n), e.appendChild(t)
});