'use strict';
define(['common/kernel/kernel', 'site/util/util', 'page/contacts/department'], function(kernel, util, departments) {
    var userid, token, orgid, orgname, parentid, adminid, loc, locid, type;
    return {
        onload: function(force) {
            userid = util.getCookie('userid'),
                token = util.getCookie('token'),
                orgid = util.getCookie('orgid'),
                orgname = util.getCookie('orgname'),
                parentid = util.getCookie('parentid'),
                adminid = util.getCookie('adminid'),
                loc = kernel.parseHash(location.hash),
                locid = loc.id,
                type = loc.args.type;
            if (userid === undefined || token === undefined || orgid === undefined) {
                util.setUserData(undefined);
                kernel.replaceLocation({
                    'args': {},
                    'id': 'loginhome'
                });
            } else {
                if (locid == 'centers') {};
            }
        },

    };
});