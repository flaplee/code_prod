'use strict';
define(['common/kernel/kernel', 'site/util/util'], function(kernel, util) {
    return {
        onload: function(force) {
            var $dept = $('#department .department-box'),
                $deptMenu = $dept.find('.department-menu'),
                $deptTeam = $dept.find('.department-team'),
                $deptInfo = $dept.find('.department-info'),
                $deptAddsub = $deptInfo.find('.btn-dept-addsub'),
                $deptDelete = $deptInfo.find('.btn-dept-delete'),
                $deptRename = $deptInfo.find('.btn-dept-rename'),
                $deptSetadmin = $deptInfo.find('.btn-dept-setadmin');
            $deptAddsub.on('click', function() {
                // 添加子部门 添加部门 /v1.0/org/department
                util.ajaxSubmit({
                    type: 'post',
                    url: '/v1.0/org/department',
                    data: {
                        "org_id": 350236083323142144,
                        "name": "研发部ios组",
                        "parent_id": 352479372986286080
                    },
                    success: function(res) {
                        console.log("res", res);
                    }
                });
            });

            $deptDelete.on('click', function() {
                // 删除部门信息 /v1.0/org/department/delete
                util.ajaxSubmit({
                    type: 'post',
                    url: '/v1.0/org/department/delete',
                    data: {
                        "department_id": 35248040954560512011
                    },
                    success: function(res) {
                        console.log("res", res);
                    }
                });
            });

            $deptRename.on('click', function() {
                // param old name
                kernel.openPopup('renamedept', {
                    model: {
                        attr: 'renamedept'
                    }
                });
            });

            $deptSetadmin.on('click', function() {
                // 修改部门信息 /v1.0/org/department/{department_id} 352480409545605120
                util.ajaxSubmit({
                    type: 'post',
                    url: '/v1.0/org/department/352480409545605120',
                    data: {
                        "director_ids": [349944153787858944], // 选填，部门主管id数组
                    },
                    success: function(res) {
                        console.log("res", res);
                    }
                });
            });
        }
    };
});