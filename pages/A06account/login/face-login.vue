<template>
	<view class="content">
		<!-- <view>
			<button @click="faceliveness()">活体识别+采集</button>
			<button @click="recycler()">人脸登录</button>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				faceForm:{
					image:'',
					faceToken:'1'
				}
			}
		},
		onLoad() {
			this.checkRequestPermissions();
			this.initFace()
		},
		methods: {
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
						this.$u.toast('初始化成功');
					}
					else{
						this.$u.toast('初始化失败');
					}
				})
			},
			//活体识别+采集  这个是登录时调用
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
						this.$u.api.AddUserFace(this.faceForm)
							.then(res => {
								if (res.code == 200) {
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
									 this.$u.toast("登录成功");
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
			//该方法主要针对一些识别参数以及皮肤进行修改，参数是官方默认的请尽量不要修改
			setFaceConfig() {
				const PPFace = uni.requireNativePlugin('PP-BaiduFaceV2');
				//该方法参数并非每次全部要写，按需设置即可，注：该方法设置的参数在init后将重置
				PPFace.setFaceConfig({
					'VALUE_MIN_FACE_SIZE': 200, //设置可检测的最小人脸阈值 VALUE_MIN_FACE_SIZE 默认 200
					'VALUE_NOT_FACE_THRESHOLD': 0.6, // 设置可检测到人脸的阈值 VALUE_NOT_FACE_THRESHOLD 默认 0.6
					'VALUE_BLURNESS': 0.3, // 设置模糊度阈值 VALUE_BLURNESS 默认 0.3
					'VALUE_BRIGHTNESS': 82, // 设置光照阈值（范围0-255 仅android）VALUE_BRIGHTNESS 默认 82 
					'VALUE_OCCLUSION': 0.5, // 设置遮挡阈值 VALUE_OCCLUSION 默认 0.5
					'VALUE_HEAD_PITCH': 8, // 设置人脸姿态角阈值 VALUE_HEAD_PITCH 默认 8
					'VALUE_HEAD_YAW': 8, // 设置人脸姿态角阈值 VALUE_HEAD_YAW 默认 8
					'VALUE_CLOSE_EYES': 0.7, // 设置闭眼阈值 VALUE_CLOSE_EYES 默认 0.7 ios无效
					'VALUE_CACHE_IMAGE_NUM': 3, // 设置图片缓存数量 VALUE_CACHE_IMAGE_NUM 默认3
					'VALUE_OPEN_MASK': true, // 设置口罩判断开关 VALUE_OPEN_MASK 默认 true
					'VALUE_MASK_THRESHOLD': 0.7, // 设置口罩口罩阈值 VALUE_MASK_THRESHOLD 默认 0.7
					'VALUE_SCALE': 1.0, // 原图缩放系数 VALUE_SCALE 默认 1.0
					'VALUE_CROP_HEIGHT': 640, // 抠图高的设定，为了保证好的抠图效果，我们要求高宽比是4：3，所以会在内部进行计算，只需要传入高即可 VALUE_CROP_HEIGHT 默认640
					'VALUE_CROP_ENLARGERATIO': 1.5, // 抠图人脸框与背景比例 VALUE_CROP_ENLARGERATIO 默认1.5
					'livenessList': ['Eye', 'Mouth', 'HeadUp', 'HeadDown', 'HeadLeft',
					'HeadRight'], //动作集合 livenessList 默认全部动作
					'isLivenessRandom': false, // 设置动作活体是否随机 isLivenessRandom 默认 false
					'isEnableSound': true, // 设置开启提示音 isEnableSound 默认 true
					'hasBottomText': true, // 设置是否显示底部文字 默认 true
					'bottomText': '— 修改了底部文字 —', // 设置底部文字内容 默认 "— 百度大脑技术支持 —"
					'COLOR_BG': '#8CD790', // 背景颜色 默认 #FFFFFF
					'COLOR_CIRCLE_LINE': '#77AF9C', //活体检测周围小竖线的颜色 默认 #CCCCCC
					'COLOR_CIRCLE_SELECT_LINE': '#285943', //活体检测周围小竖线完成后的颜色 默认 #00BAF2
					'topTextColor': '#383A3F', //顶部提示文字颜色 默认 #000000
					'topSecondTextColor': '#566270', // //顶部第二行小字提示颜色 默认 #666666
					'hasBottomImg': true, //是否显示底部图片 默认true（可通过替换res跟换图片）
				}, res => {
					//res.code //返回编码 200 为成功
				})
			},
		}
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 50upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}

	.msg {
		text-align: left;
		padding: 40rpx;
		font-size: 25rpx;
		color: #F0AD4E;
	}
</style>
