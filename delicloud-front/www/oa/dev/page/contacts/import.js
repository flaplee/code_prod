'use strict';
define(['common/kernel/kernel', 'site/util/util', 'common/text/text!page/contacts/import.html!strip'], function(kernel, util, html) {
	var userid = util.getCookie('userid'),
        token = util.getCookie('token'),
        orgid = util.getCookie('orgid');
    var dom = $(html),
        $contacts = $('#contacts .contacts-box');
    	$contacts.append(dom);
});