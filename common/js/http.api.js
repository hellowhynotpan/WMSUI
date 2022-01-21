const install = (Vue, vm) => {
	vm.$u.api = {}
	//检查版本更新以及获取版本更新地址
	vm.$u.api.AutoUpdApk = params => vm.$u.get('api/Authoize/AutoUpdApk', params);
	
	//登录相关
	vm.$u.api.loginByPwd = params => vm.$u.post('api/Authoize/LoginByPwd', params);
	vm.$u.api.loginBySms = params => vm.$u.post('api/Authoize/LoginBySms', params);
	vm.$u.api.SendSmsByLogin = params => vm.$u.get('api/Authoize/SendSmsByLogin', params);
	vm.$u.api.SendSmsByRegister = params => vm.$u.get('api/Authoize/SendSmsByRegister', params);
	vm.$u.api.SendSmsByResetPwd = params => vm.$u.get('api/Authoize/SendSmsByResetPwd', params);
	vm.$u.api.Register = params => vm.$u.post('api/Authoize/Register', params);
	vm.$u.api.LoginByFace = params => vm.$u.post('api/Authoize/LoginByFace', params);
	vm.$u.api.ResetPwd = params => vm.$u.post('api/Authoize/ResetPwd', params);


	//人脸识别相关
	vm.$u.api.AddUserFace = params => vm.$u.post('api/SysUser/AddUserFace', params);
	vm.$u.api.CheckPwd = params => vm.$u.post('api/SysUserLogOn/CheckPwd', params);

	//基础信息相关
	//wh
	vm.$u.api.addWh = params => vm.$u.post('api/BaseWareHouse/Create', params);
	vm.$u.api.editWh = params => vm.$u.post('api/BaseWareHouse/Edit', params);
	vm.$u.api.findWh = params => vm.$u.get('api/BaseWareHouse/Find', params);
	vm.$u.api.queryWh = params => vm.$u.get('api/BaseWareHouse/QueryPage', params);
	vm.$u.api.invalidWh = params => vm.$u.get('api/BaseWareHouse/Invalid', params);
	vm.$u.api.queryWhName = params => vm.$u.get('api/BaseWareHouse/QueryWhName', params);
	vm.$u.api.addCs = params => vm.$u.post('api/BaseCargospace/Create', params);
	vm.$u.api.queryCs = params => vm.$u.get('api/BaseCargospace/QueryPage', params);
	vm.$u.api.invalidCs = params => vm.$u.get('api/BaseCargospace/Invalid', params);
    vm.$u.api.frozenCs = params => vm.$u.post('api/BaseCargospace/Frozen', params);
	vm.$u.api.findCs = params => vm.$u.get('api/BaseCargospace/Find', params);
	vm.$u.api.editCs = params => vm.$u.post('api/BaseCargospace/Edit', params);
	vm.$u.api.addPart = params => vm.$u.post('api/BasePart/Create', params);
	vm.$u.api.queryPart = params => vm.$u.get('api/BasePart/QueryPage', params);
	vm.$u.api.findPart = params => vm.$u.get('api/BasePart/Find', params);
	vm.$u.api.editPart = params => vm.$u.post('api/BasePart/Edit', params);
	vm.$u.api.queryCsName = params => vm.$u.get('api/BaseCargospace/queryCsName', params);
	vm.$u.api.queryPartName = params => vm.$u.get('api/BasePart/queryPartName', params);
	vm.$u.api.invalidPart = params => vm.$u.get('api/BasePart/Invalid', params);
	//IM
	vm.$u.api.createInBill = params => vm.$u.post('api/Inbill/create', params);
	vm.$u.api.queryInBill = params => vm.$u.get('api/Inbill/QueryPage', params);
	vm.$u.api.QueryInbillById = params => vm.$u.get('api/Inbill/QueryInbillById', params);
	vm.$u.api.editInBill = params => vm.$u.post('api/Inbill/Edit', params);
	
	
	//stock
	vm.$u.api.queryStock = params => vm.$u.get('api/StockM/QueryPage', params);
	vm.$u.api.quertStockMById = params => vm.$u.get('api/StockM/quertStockMById', params);
	vm.$u.api.examine = params => vm.$u.post('api/StockM/Examine', params);
}
export default {
	install
}
