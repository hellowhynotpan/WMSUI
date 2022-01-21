<template>
	<view class="account-page">
		<view class="page-header">
			<view class="page-title">{{ title }}</view>
		</view>
		<view class="page-body">
			<view class="form-box">
				<u-form :model="model" ref="uForm" label-width="160rpx">
					<u-form-item class="form-item" label="用户名" prop="account">
						<u-input v-model="model.account" placeholder="4-20位的数字和字母" type="text" />
					</u-form-item>
					<u-form-item class="form-item" label="姓名" prop="realName">
						<u-input v-model="model.realName" placeholder="请输入姓名" type="text" />
					</u-form-item>
					<u-form-item class="form-item" label="性别" prop="gender">
						<u-input type="select" :select-open="actionSheetShow" v-model="model.gender" placeholder="请选择性别"
							@click="actionSheetShow = true" />
					</u-form-item>
					<u-form-item class="form-item" label="密码" prop="password">
						<u-input v-model="model.password" placeholder="6-20位的数字和字母" type="password" />
					</u-form-item>
					<u-form-item class="form-item" label="确认密码" prop="confirmPassword">
						<u-input v-model="model.confirmPassword" placeholder="请再次输入密码" type="password" />
					</u-form-item>
					<u-form-item class="form-item" label="手机号" prop="mobilePhone">
						<u-input v-model="model.mobilePhone" placeholder="请输入手机号" type="text" />
					</u-form-item>
					<u-form-item class="form-item" label="短信验证码" prop="smsCode">
						<u-input v-model="model.smsCode" placeholder="请输入验证码" type="number" />
						<u-button slot="right" type="success" size="mini" @click="getCode">{{ codeTips }}</u-button>
					</u-form-item>
				</u-form>
				<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
				<u-gap height="40"></u-gap>
				<u-button :disabled="form.button.loading" type="primary" @click="submit">立即提交</u-button>
				<u-gap height="40"></u-gap>
				<view class="u-flex u-row-between">
					<view @click="openPage('login/pwd-login')">账号密码登录</view>
				</view>
			</view>
			<u-gap height="60"></u-gap>
			<u-action-sheet :list="list" v-model="actionSheetShow" @click="actionSheetCallback"></u-action-sheet>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '用户名注册',
				desc: '',
				codeTips: '',
				codeId: '',
				form: {
					button: {
						loading: false
					}
				},
				actionSheetShow: false,
				model: {
					/* 用户名 */
					userName: '',
					/* 密码 */
					password: '',
					/* 确认密码 */
					confirmPassword: '',
					/* 姓别 */
					gender: '',
					/* 短信验证码 */
					smsCode: '',
					/* 真实姓名 */
					realName: '',
					/* 手机号码 */
					mobilePhone: ''
				},
				list: [
					{
						text: '男'
					},
					{
						text: '女'
					}
				],
				
				rules: {
					account: [{
							required: true,
							message: '请输入用户名',
							trigger: ['change', 'blur']
						},
						{
							min: 4,
							max: 20,
							message: '用户名长度在4到20个字符',
							trigger: ['change', 'blur']
						},
						{
							pattern: /^[0-9a-zA-Z]*$/g,
							transform(value) {
								return String(value);
							},
							message: '用户名为字母或数字',
							trigger: ['change', 'blur']
						}
					],
					gender: [
						{
							required: true,
							message: '请选择性别',
							trigger: 'blur' ,
						},
					],
					realName: [{
						required: true,
						message: '请输入姓名',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: ['change', 'blur']
						},
						{
							min: 6,
							max: 20,
							message: '密码长度在6到20个字符',
							trigger: ['change', 'blur']
						},
						{
							pattern: /^[0-9a-zA-Z]*$/g,
							transform(value) {
								return String(value);
							},
							message: '密码为字母或数字',
							trigger: ['change', 'blur']
						}
					],
					confirmPassword: [{
							required: true,
							message: '请再次输入密码',
							trigger: ['change', 'blur']
						},
						{
							validator: (rule, value, callback) => {
								return value === this.model.password;
							},
							message: '两次输入的密码不相等',
							trigger: ['change', 'blur']
						}
					],
					mobilePhone: [{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur']
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '手机号格式不正确',
							trigger: ['change', 'blur']
						}
					],
					smsCode: [{
							required: true,
							message: '请输入验证码',
							trigger: ['change', 'blur']
						},
						{
							type: 'number',
							message: '验证码只能为数字',
							trigger: ['change', 'blur']
						},
						{
							len: 6,
							message: '验证码长度为6位数字',
							trigger: ['change', 'blur']
						}
					]
				}
			};
		},
		methods: {
			actionSheetCallback(index) {
				uni.hideKeyboard();
				this.model.gender = this.list[index].text;
			},
			openPage(path) {
				this.$u.route({
					url: '/pages/A06account/' + path
				});
			},
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						this.form.button.loading = true;
						var params=this.model
						if(params.gender=='女')
						{
							params.gender=true
						}
						else
						{
							params.gender=false
						}
						this.$u.api.Register(params)
							.then(res => {
								this.form.button.loading = false;
								console.log(res);
								if (res.code == 200) {
									this.$u.vuex('vuex_user.logined', true);
									this.$u.vuex('vuex_user.id', res.data.id);
									this.$u.vuex('vuex_token', res.data.token);
									this.$u.toast('注册成功');
									uni.switchTab({
										url: '/pages/A01home/index',
									})
								} else {
									return this.$u.toast(res.msg);
								}
							})
							.catch(err => {
								this.form.button.loading = false;
								console.log(err);
								return this.$u.toast('出错，请稍后再试');
							});
					} else {
						console.log('验证失败');
					}
				});
			},getCode() {
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码',
						mask: true
					});
					this.$u.api.SendSmsByRegister({mobilePhone:this.model.mobilePhone}).then(res => {
							this.form.button.loading = false;
							if (res.code == 200) {
								console.log(res.data);
								return this.$u.toast(res.data);
							} else {
								return this.$u.toast(res.msg);
							}
						})
						.catch(err => {
							this.form.button.loading = false;
							return this.$u.toast('出错，请稍后再试');
						});
					setTimeout(() => {
						uni.hideLoading();
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
					}, 2000);
				} else {
					this.$u.toast('倒计时结束后再发送');
				}
			},
			codeChange(text) {
				this.codeTips = text;
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		}
	};
</script>

<style lang="scss" scoped>
	@import '../scss/account.scss';
</style>
