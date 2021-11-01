<template>
	<view class="account-page">
		<view class="page-header">
			<view class="page-title">请验证登录密码</view>
		</view>
		<view class="page-body">
			<view class="form-box">
				<u-form :model="model" ref="uForm" label-position="top">
					<u-form-item class="form-item" label="密码" >
						<u-input v-model="model.password" placeholder="请输入登录密码" type="password" />
					</u-form-item>
				</u-form>
				<u-button :disabled="form.button.loading" type="primary" @click="submit">验证</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				model: {
					userId: '',
					password: ''
				},
				form: {
					button: {
						loading: false
					}
				},
				faceForm:
				{
					image:'',
					userId:'',
				}
			}
		},
		created() {
		},
		methods: {
			async submit() {
				this.form.button.loading = true;
				this.model.userId=this.vuex_user.id;
				this.faceForm.userId=this.vuex_user.id;
				await this.$u.api.CheckPwd(this.model)
					.then(res => {
						this.form.button.loading = false;
						if (res.code == 200) {
							this.checkRequestPermissions()
							this.initFace()
							this.faceliveness()
						} else {
							return this.$u.toast(res.msg);
						}
					})
					.catch(err => {
						this.form.button.loading = false;
						console.log(err);
						return this.$u.toast('出错，请稍后再试');
					});
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
			faceliveness() {
				const PPFace = uni.requireNativePlugin('PP-BaiduFaceV2');
				PPFace.faceliveness({
					livenessList: ["Eye", "Mouth", "HeadUp", "HeadDown"], //活体要求动作集合，可按需删减
					isLivenessRandom: true, //是否开启动作随机 默认false
					isEnableSound: false //是否开启语音播报 默认 true
				}, res => {
					//res.code //返回编码 200 为成功
					//res.base64Image //全景图像 可以加前缀 data:image/jpg;base64, 进行预览
					//res.base64ImageCrop //裁剪后图像（少量黑边，或者没有） 可以加前缀 data:image/jpg;base64, 进行预览
					if(res.code==200)
					{
						this.faceForm.image=res.base64ImageCrop
						console.log(this.faceForm.userId)
						this.$u.api.AddUserFace(this.faceForm)
							.then(resp => {
								if (resp.code == 200) {
								} else {
									return this.$u.toast(resp.msg);
								}
							})
							.catch(err => {
								console.log(err)
								return this.$u.toast('出错，请稍后再试');
							});
					}
					else{
						this.$u.toast('人脸采集失败');
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
		},
	}
</script>

<style lang="scss">
	.account-page {
		.page-header {
			padding: 30rpx 40rpx 40rpx 40rpx;
	
			.page-title {
				font-size: 40rpx;
				font-weight: 600;
				color: $u-main-color;
			}
	
			.page-desc {
				margin-top: 10rpx;
				color: $u-tips-color;
			}
		}
		
		.page-body {
			padding: 0 8rpx;
		}
	}
	
	.panel-box {
		.panel-main {
			padding: 10rpx 0;
		}
		
		.btn-line {
			margin: 0 32rpx;
		}
	}
	
	.form-box {
		padding: 0 32rpx;
	}
</style>
