const install = (Vue, vm) => {
	vm.$u.api={}
	//登录相关
	vm.$u.api.loginByPwd = params  => vm.$u.post('Authoize/LoginByPwd', params);
	vm.$u.api.loginBySms = params  => vm.$u.post('Authoize/LoginBySms', params);
	vm.$u.api.SendSmsByLogin = params  => vm.$u.get('Authoize/SendSmsByLogin', params);
	vm.$u.api.SendSmsByRegister = params  => vm.$u.get('Authoize/SendSmsByRegister', params);
	vm.$u.api.Register = params  => vm.$u.post('Authoize/Register', params);
	vm.$u.api.LoginByFace = params  => vm.$u.post('Authoize/LoginByFace', params);
	
	
	//人脸识别相关
	vm.$u.api.AddUserFace = params  => vm.$u.post('SysUser/AddUserFace', params);
	vm.$u.api.CheckPwd = params  => vm.$u.post('SysUserLogOn/CheckPwd', params);
}
export default {
	install
}