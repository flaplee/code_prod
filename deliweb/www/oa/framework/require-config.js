'use strict';
define(['module'], function(module) {
	//请确保modules第一个被赋值
	var modules = {"common/kernel":7,"common/slider":1,"common/text":1,"page/app":10,"page/appcap":3,"page/appdetail":2,"page/apphome":9,"page/base":2,"page/contacts":33,"page/device":9,"page/home":9,"page/imports":28,"page/loginhome":20,"panel/adduser":1,"panel/editdept":1,"popup/adddept":1,"popup/deldept":1,"popup/deldevice":1,"popup/deluser":1,"popup/editdept":1,"popup/editdevice":1,"popup/finduser":1,"popup/loginInfo":1,"popup/loginPopup":1,"popup/renamedept":1,"popup/seluser":1,"site/import":2,"site/index":19,"site/pages":1,"site/panels":1,"site/popups":1,"site/util":12},
		//请确保srcRoot第二个被赋值
		srcRoot = 'dev/',
		//请确保productRoot第三个被赋值
		productRoot = 'dist/',
		//请确保siteVersion第四个被赋值
		siteVersion = "1.0.48",
		//请确保debug第五个被赋值
		debug = false,
		prefix = module.id.replace(/framework\/[^\/]+$/, ''),
		cfg = {
			waitSeconds: 0,
			baseUrl: prefix + srcRoot
		};

	if (!debug) {
		for (var n in modules) {
			modules[n] = prefix + productRoot + n + '/' + modules[n];
		}
		cfg.paths = modules;
	}
	require.config(cfg);
	//用于外部访问的基本信息
	require.data = {
		siteVersion: siteVersion,
		debug: debug
	};
	//若需要从外部获得模块路径请使用require.toUrl('family/name')
});