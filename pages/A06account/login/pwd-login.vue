<template>
	<view>
		<view class="page-body" :style="{height:windowHeight}">
			<view class="container-card">
				<u-form :model="model" class="login-box">
					<u-form-item prop="account" :border-bottom='false'>
						<u-input class="login-input" v-model="model.account" left-icon="account"
							placeholder="  请输入手机号/邮箱/用户名" />
					</u-form-item>
					<u-form-item prop="password" :border-bottom='false'>
						<u-input class="login-input" v-model="model.password" placeholder="  请输入登录密码" type="password" />
					</u-form-item>
					<u-form-item :border-bottom='false'>
						<u-button
							style="background-color: #59a6ff;box-shadow: 0px 0px 12px 0px #ffffff !important;height:20%;width:100%;margin-top: 10rpx;"
							class="button-login" ca :disabled="form.button.loading" type="primary" @click="submit">
							登 录
						</u-button>
					</u-form-item>
				</u-form>
				<view class="bottom-box">
					<u-grid :col="4" :border="false">
						<u-grid-item @click="recycler" style="background-color: rgba(0,0,0,0);padding-bottom:40rpx;">
							<u-icon size="90" style="margin-top: 0;" :name="getImgUrl('/img/login/facelogin.png')">
							</u-icon>
							<view class="grid-text" style="font-size: 22rpx;color: rgba(255,255,255,0.4);">面容登录</view>
						</u-grid-item>
						<u-grid-item style="background-color: rgba(0,0,0,0);padding-top:40rpx;">
							<u-icon size="90" :name="getImgUrl('/img/login/wechart.png')"></u-icon>
							<view class="grid-text" style="font-size: 22rpx;color: rgba(255,255,255,0.4);">微信登录</view>
						</u-grid-item>
						<u-grid-item @click="openPage('login/sms-login')"
							style="background-color: rgba(0,0,0,0);padding-bottom:40rpx;">
							<u-icon size="90" :name="getImgUrl('/img/login/sms.png')"></u-icon>
							<view class="grid-text" style="font-size: 22rpx;color: rgba(255,255,255,0.4);">短信登录</view>
						</u-grid-item>
						<u-grid-item @click="openPage('register/userName-register')"
							style="background-color: rgba(0,0,0,0);padding-top:40rpx;">
							<u-icon size="90" :name="getImgUrl('/img/login/register.png')"></u-icon>
							<view class="grid-text" style="font-size: 22rpx;color: rgba(255,255,255,0.4);">立即注册</view>
						</u-grid-item>
					</u-grid>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				windowHeight: '600rpx',
				faceForm: {
					image: '',
				},
				imageURL: '/static/images/login/login.gif',
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
			let self = this
			uni.getSystemInfo({
				success: function(res) {
					self.windowHeight = res.screenHeight * (750 / res.windowWidth) + 'rpx';
				}
			})
			this.windowHeight = self.windowHeight
			this.initFace();
			this.checkRequestPermissions()
		},
		onShow() {
			this.checkRequestPermissions()
		},
		methods: {
			//人脸登录
			recycler() {
				this.checkRequestPermissions();
				const PPFace = uni.requireNativePlugin('PP-BaiduFaceV2');
				PPFace.recycler({
					isEnableSound: false //是否开启语音播报 默认 true
				}, res => {
					//res.code //返回编码 200 为成功
					//res.base64Image //全景图像 可以加前缀 data:image/jpg;base64, 进行预览
					//res.base64ImageCrop //裁剪后图像（少量黑边，或者没有） 可以加前缀 data:image/jpg;base64, 进行预览
					if (res.code == 200) {
						this.faceForm.image = res.base64ImageCrop
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
					} else {
						this.$u.toast('人脸采集失败');
					}
				})
			},
			//检查权限 这个是采集时调用
			checkRequestPermissions() {
				const PPFace = uni.requireNativePlugin('PP-BaiduFaceV2');
				PPFace.checkRequestPermissions(res => {
					if (res.code == 200) {} else {
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
					if (res.code == 200) {} else {
						this.$u.toast('初始化失败');
					}
				})
			},
			openPage(path) {
				this.$u.route({
					url: '/pages/A06account/' + path
				});
			},
			getImgUrl(image) {
				return this.baseUrl + image;
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
	};
</script>

<style lang="scss" scoped>
	@import '../scss/account.scss';

	.page-body {
		background-image: url(../../../static/images/login/login.gif);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		width: 100%;
	}

	.container-card {
		position: fixed;
		top: 45%;
		left: 8%;
		right: 8%;
		bottom: 25%;
		background-image: linear-gradient(rgba(255, 255, 255, 0.4), rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.4));
		border-radius: 18rpx;
	}

	.login-box {
		margin-top: 10%;
		height: 78%;
		width: 80%;
		margin-left: 10%;
		margin-right: 10%;
	}

	.login-input {
		border: 3rpx, solid;
		background-color: #FFFFFF;
		height: 10%;
		border-radius: 10rpx;
	}

	.bottom-box {
		position: fixed;
		top: 78%;
		left: 12%;
		right: 12%;
		height: 180rpx;
	}
</style>
