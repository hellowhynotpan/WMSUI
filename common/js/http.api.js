const install = (Vue, vm) => {
	vm.$u.api={}
	//登录相关
	vm.$u.api.loginByPwd = params  => vm.$u.post('Authoize/LoginByPwd', params);
}
export default {
	install
}