<template>
	<view class="account-page">
		<view class="page-header">
			<view class="page-title">{{ title }}</view>
		</view>
		<view class="page-body">
			<view class="form-box">
				<u-form :model="model" ref="uForm" label-position="top">
					<u-form-item class="form-item" label="手机号" prop="mobile" :label-position="form.labelPosition">
						<u-input v-model="model.mobilePhone" placeholder="已验证的手机号" type="text" />
					</u-form-item>
					<u-form-item class="form-item" label="短信验证码" prop="smsCode" :label-position="form.labelPosition">
						<u-input v-model="model.smsCode" placeholder="请输入验证码" type="number" />
						<u-button slot="right" type="success" size="mini" @click="getCode">{{ codeTips }}</u-button>
					</u-form-item>
					<u-form-item class="form-item" label="新密码" prop="password" :label-position="form.labelPosition">
						<u-input v-model="model.password" placeholder="新密码(6-20位的数字和字母)" type="password" />
					</u-form-item>
					<u-form-item class="form-item" label="确认密码" prop="confirmPassword"
						:label-position="form.labelPosition">
						<u-input v-model="model.confirmPassword" placeholder="请再次输入新密码" type="password" />
					</u-form-item>
				</u-form>

				<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>

				<u-gap height="40"></u-gap>

				<u-button :disabled="form.button.loading" type="primary" @click="submit">立即提交</u-button>

				<u-gap height="40"></u-gap>
			</view>

			<u-gap height="60"></u-gap>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '修改密码',
				desc: '',
				codeTips: '获取验证码',
				form: {
					button: {
						loading: false
					}
				},
				model: {
					/* 手机号 */
					mobilePhone: '',
					/* 验证码 */
					smsCode: '',
					/* 新密码 */
					password: '',
					/* 确认密码 */
					confirmPassword: ''
				},
				rules: {
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
					],
					password: [{
							required: true,
							message: '请设置新密码',
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
							message: '请再次输入新密码',
							trigger: ['change', 'blur']
						},
						{
							validator: (rule, value, callback) => {
								return value === this.model.password;
							},
							message: '两次输入的密码不相等',
							trigger: ['change', 'blur']
						}
					]
				}
			};
		},
		methods: {
			openPage(path) {
				this.$u.route({
					url: '/pages/account/' + path
				});
			},
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						this.$u.api.ResetPwd(this.model)
							.then(res => {
								this.form.button.loading = false;
								if (res.code == 200) {
									this.$u.toast(res.data);
									setTimeout(() => {
										uni.navigateBack({});
									}, 1000);
								} else {
									return this.$u.toast(res.msg);
								}
							})
							.catch(err => {
								this.form.button.loading = false;
								return this.$u.toast('出错，请稍后再试');
							});
					} else {
						console.log('验证失败');
					}
				});
			},
			codeChange(text) {
				this.codeTips = text;
			},
			// 获取验证码
			getCode() {
				if (this.$refs.uCode.canGetCode) {
					if (this.model.mobilePhone == '') {
						console.log(this.model.mobilePhone)
						return this.$u.toast('请输入手机号码');
					}
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码',
						mask: true
					});
					this.$u.api.SendSmsByResetPwd({
							mobilePhone: this.model.mobilePhone
						}).then(res => {
							if (res.code == 200) {
								console.log(res.data);
								return this.$u.toast(res.data);
							} else {
								return this.$u.toast(res.msg);
							}
						})
						.catch(err => {
							return this.$u.toast('出错，请稍后再试');
						});
					setTimeout(() => {
						uni.hideLoading();
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
					}, 10);
				} else {
					this.$u.toast('倒计时结束后再发送');
				}
			},

		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		}
	};
</script>

<style lang="scss" scoped>
	@import '../scss/account.scss';
</style>
