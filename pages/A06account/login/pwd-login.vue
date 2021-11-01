<template>
	<view>
		<!-- <view class="page-header">
			<view class="page-title">{{ title }}</view>
		</view> -->
		<view>
			<image class="bg-set" src="../../../static/images/login/login.png">
			</image>
			<view class="form-box">
				<u-form class="form" :model="model">
					<u-form-item  prop="account">
						<u-input v-model="model.account" placeholder="请输入手机号/邮箱/用户名" type="text" />
					</u-form-item>
					<u-form-item  prop="password">
						<u-input v-model="model.password" placeholder="请输入登录密码" type="password" />
					</u-form-item>
				    <u-button class="button-login"  ca :disabled="form.button.loading" type="primary" @click="submit">登 录</u-button>
				</u-form>
				
			</view>
			<view class="bottom-box">
				<view class="flex-item uni-bg-red" style="width: 25%;height:100%;float: left;">
					<button class="bt4-style" @click="openPage('register/userName-register')"></button>
				</view>
				<view class="flex-item uni-bg-red" style="width: 25%;height:100%;float: left;">
					<button class="bt2-style" @click="openPage('login/sms-login')"></button>
				</view>
				<view class="flex-item uni-bg-red" style="width: 25%;height:100%;float: left;">
					<button class="bt3-style" @click="recycler"></button>
				</view>
				<view class="flex-item uni-bg-red" style="width: 25%;height:100%;float: left;">
					<button class="bt1-style"></button>
				</view>
			</view>
			<!-- 	<view class="form-box">
				<u-form :model="model" ref="uForm" label-position="top">
					<u-form-item class="form-item" label="账号" prop="account"><u-input v-model="model.account" placeholder="请输入手机号/邮箱/用户名" type="text" /></u-form-item>
					<u-form-item class="form-item" label="密码" prop="password"><u-input v-model="model.password" placeholder="请输入登录密码" type="password" /></u-form-item>
				</u-form>
			
				<u-gap height="40"></u-gap>
			
				<u-button :disabled="form.button.loading" type="primary" @click="submit">登 录</u-button>
			
				<u-gap height="40"></u-gap>
			
				<view class="u-flex">
					<view class="u-flex-1 u-text-left" @click="openPage('login/sms-login')">短信登录</view>
					<view class="u-flex-1 u-text-right" @click="openPage('register/userName-register')">注册</view>
				</view>
				<u-gap height="40"></u-gap>
				<view class="u-text-center u-tips-color" @click="openPage('findPassword/findPassword')">登录遇到问题，忘记密码了？</view>
			</view>
			<u-gap height="60"></u-gap> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				faceForm:{
					image:'',
				},
				imageURL: '/static/images/login/login.png',
				title: '账号密码登录',
				desc: '',
				form: {
					button: {
						loading: false
					}
				},
				model: {
					/* 账号 */
					account: '',
					/* 密码 */
					password: ''
				},
				rules: {
					account: [{
						required: true,
						message: '请输入手机号/邮箱/用户名',
						trigger: ['change', 'blur']
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
					]
				}
			};
		},
		created() {
			this.checkRequestPermissions();
			this.initFace();
		},
		methods: {
			//人脸登录
			recycler() {
				const PPFace = uni.requireNativePlugin('PP-BaiduFaceV2');
				PPFace.recycler({
					isEnableSound: false //是否开启语音播报 默认 true
				}, res => {
					//res.code //返回编码 200 为成功
					//res.base64Image //全景图像 可以加前缀 data:image/jpg;base64, 进行预览
					//res.base64ImageCrop //裁剪后图像（少量黑边，或者没有） 可以加前缀 data:image/jpg;base64, 进行预览
					if(res.code==200)
					{
						this.faceForm.image=res.base64ImageCrop
						this.$u.api.LoginByFace(this.faceForm)
							.then(res => {
								if (res.code == 200) {
									console.log(res.data)
									this.$u.toast("登录成功");
									this.$u.vuex('vuex_user.logined', true);
									this.$u.vuex('vuex_user.id', res.data.id);
									this.$u.vuex('vuex_token', res.data.token);
									this.$u.vuex('vuex_user.nickName', res.data.nickName);
									this.$u.vuex('vuex_user.headIcon', res.data.headIcon);
									this.$u.vuex('vuex_user.realName', res.data.realName);
									console.log("跳转页面")
									 uni.reLaunch({
									 	url: '/pages/A01home/index',
									 })
								} else {
									return this.$u.toast(res.msg);
								}
							})
							.catch(err => {
								return this.$u.toast('出错，请稍后再试');
							});
					}
					else{
						this.$u.toast('人脸采集失败');
					}
				})
			},
			//检查权限 这个是采集时调用
			checkRequestPermissions() {
				const PPFace = uni.requireNativePlugin('PP-BaiduFaceV2');
				PPFace.checkRequestPermissions(res => {
					if(res.code==200)
					{
					}
					else{
						this.$u.toast('获取摄像头权限失败');
					}
				})
			},
			//初始化插件（请务必先执行一次，还原参数时也可调用）
			initFace() {
				const PPFace = uni.requireNativePlugin('PP-BaiduFaceV2');
				PPFace.init({
					androidLicenseFileName: 'idl-license.face-android',
					androidLicenseId: 'imccoy-face-android', //*需要修改 android百度申请到的liceenseid
					iosLicenseFileName: 'idl-license.face-ios',
					iosLicenseId: 'xxx-face-ios', //*需要修改 ios百度申请到的liceenseid
				}, res => {
					//res.code //返回编码 200 为成功
					if(res.code==200)
					{
					}
					else{
						this.$u.toast('初始化失败');
					}
				})
			},
			openPage(path) {
				this.$u.route({
					url: '/pages/A06account/' + path
				});
			},
			submit() {
				this.form.button.loading = true;
				this.$u.api.loginByPwd(this.model)
					.then(res => {
						this.form.button.loading = false;
						if (res.code == 200) {
							console.log(res.data)
							this.$u.vuex('vuex_user.logined', true);
							this.$u.vuex('vuex_user.id', res.data.id);
							this.$u.vuex('vuex_token', res.data.token);
							this.$u.vuex('vuex_user.nickName', res.data.nickName);
							this.$u.vuex('vuex_user.headIcon', res.data.headIcon);
							this.$u.vuex('vuex_user.realName', res.data.realName);
							uni.reLaunch({
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
			}
		},
		onReady() {
			// this.$refs.uForm.setRules(this.rules);
		}
	};
</script>

<style lang="scss" scoped>
	@import '../scss/account.scss';

	.bg-set {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}

	.form-box {
		position: fixed;
		top: 46%;
		left: 4%;
		right: 4%;
		bottom: 25%;
		background-image: url(../../../static/images/login/formBox.png);
		background-size: 100% 100%;
		.form {
			margin: 40rpx 20rpx 20rpx 20rpx;
		}
	}

	.bottom-box {
		position: fixed;
		top: 77%;
		left: 1%;
		right: 1%;
		bottom: 12%;

		button::after {
			border: none
		}
	}

	.bt1-style {
		background-repeat: no-repeat;
		background-image: url(../../../static/images/login/wechart.png);
		width: 100%;
		height: 100%;
		background-color: transparent;
		background-size: 100% 100%;
		border-style: none;
		margin: 0rpx;
		border: 0rpx;
	}

	.bt2-style {
		background-repeat: no-repeat;
		background-image: url(../../../static/images/login/sms.png);
		width: 100%;
		height: 100%;
		background-color: transparent;
		background-size: 100% 100%;
		border-style: none;
		margin: 0rpx;
	}

	.bt3-style {
		background-repeat: no-repeat;
		background-image: url(../../../static/images/login/facelogin.png);
		width: 100%;
		height: 100%;
		background-color: transparent;
		background-size: 100% 100%;
		border-style: none;
		margin: 0rpx;
	}

	.bt4-style {
		background-repeat: no-repeat;
		background-image: url(../../../static/images/login/register.png);
		width: 100%;
		height: 100%;
		background-color: transparent;
		background-size: 100% 100%;
		border-style: none;
		border: 0rpx;
		margin: 0rpx;
	}
	.button-login{
		margin-top: 36rpx;
	}
</style>
