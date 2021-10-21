import Vue from 'vue'
import Vuex from 'vuex'
//公共数据状态管理
Vue.use(Vuex)
export default new Vuex.Store({
	state: {
		rightList: JSON.parse(sessionStorage.getItem('rightList')||'[]'),
		user:  JSON.parse(sessionStorage.getItem('user')||'[]'),
	},
	mutations: {
		setRightList(state, data) {
			state.rightList = data
			sessionStorage.setItem('rightList',JSON.stringify(data))
		},
		setUser(state, data) {
			state.user = data
			sessionStorage.setItem('user',JSON.stringify(data))
		}
	},
	actions: {},
	getters: {}
})