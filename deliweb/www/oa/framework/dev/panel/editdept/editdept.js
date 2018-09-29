'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util'], function(module, kernel, util) {
	var thisPanel = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
		$dom = $('#' + thisPanel),
		$editDept = $dom.find('.edit-dept'),
		$editDeptTitle = $editDept.find('.edit-dept-title'),
		$editDeptInner = $editDept.find('.edit-dept-inner'),
		$editDeptBtns = $editDeptInner.find('.edit-dept-btns'),
		$editDeptTable = $editDeptInner.find('.edit-dept-wrap table.user-table'),
		$editDeptPage = $editDeptInner.find('.paging'); 
	
	// 修改人员在团队组织中的信息 /v1.0/org/dept/{dept_id}
	return {
		onload: function(param) {
			console.log('opening ' + thisPanel);
			console.log('param',param);
			var type = param.type,data = param.data;
			var user_ids = [];
			var deptid = '362186279082786800',token = '7382a4f0-9f31-4869-8fe5-9fa6aea264e8',orgid = '363677081407586300';
			$editDeptBtns.find('.btn-edit-dept-setadmin').on('click',function(){
				$.each($editDeptTable.find('tbody.user-tbody tr.user-item'),function(i, item){
					user_ids.push(util.getRadioValue($(item), 'director'));
				});
				if(user_ids.length > 0){
					// 设为主管 /v1.0/org/department
					util.ajaxSubmit({
		                url: '/v1.0/org/department',
		                dauth: deptid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildHash(token),
		                data: {
		                	"director_ids":[349944153787858944]
		                },
		                success: function(res) {
		                    console.log("res",res);
		                }
		            });
				}else{
					kernel.hint('请选择要设为主管的员工~','error');
				}
			});
			$editDeptBtns.find('.btn-edit-dept-cancel').off('click').on('click', function() {
		        kernel.closePanel('editdept');
		    });
		},
		onunload: function() {
			//console.log('closing ' + thisPanel);
		},
		onloadend: function() {
			//console.log(thisPanel + ' is open');
		},
		onunloadend: function() {
			//console.log(thisPanel + ' is closed');
		},
		ondestory: function() {
			//console.log('do clean up stuff here');
		}
	};
});