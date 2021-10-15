<template>
	<view class="content">
		<view class="login-box">
			<h2>短信验证码登录</h2>
			<u-form :model="form" ref="uForm" class="login-form">
				<u-form-item>
					<u-input v-model="form.phone" placeholder="请输入手机号码" />
				</u-form-item>
				<u-form-item>
					<u-input v-model="form.code" placeholder="请输入验证码" />
					<u-button type="primary" :hair-line='false' plain size="mini" :disabled='isLock' @click='getCode()'>
						{{msgVerCode}}</u-button>
				</u-form-item>
			</u-form>
			<view class="bottom">
				<u-button type="primary" :custom-style="customStyle" :ripple="true">登录</u-button>
				<u-button type="success" :custom-style="customStyle" :ripple="true">微信登录</u-button>
			</view>
			<view class="buttom">
				<view class="loginType">
					<view class="wechat item">
						<view class="icon">
							<u-icon size="70" name="weixin-fill" color="rgb(83,194,64)"></u-icon>
						</view>
						微信登录
					</view>

					<view class="wechat item">
						<view class="icon">
							<u-icon size="70" name="weixin-fill" color="rgb(83,194,64)"></u-icon>
						</view>
						面容登录
					</view>

					<view class="wechat item">
						<view class="icon">
							<u-icon size="70" name="weixin-fill" color="rgb(83,194,64)"></u-icon>
						</view>
						面容登录
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				countDown: 60,
				msgVerCode: '获取短信验证码',
				isLock: false,
				form: {
					phone: '',
					code: '',
					password: '',
				},
				customStyle: {
					marginTop: '20px', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
				},
			}
		},
		computed: {

		},
		methods: {
			submit() {

			},
			getCode() {
				this.isLock = true
				this.registerBtn()
			},
			registerBtn() {
				this.timer = setInterval(() => {
					if (this.countDown === 0) {
						this.reset();
						this.timer && this.clearTimer();
					} else {
						this.loading();
					}
				}, 1000);
			},
			loading() {
				this.countDown -= 1;
				this.msgVerCode = this.countDown + '秒后重发';
			},
			reset() {
				this.countDown = 60;
				this.isLock = false;
				this.msgVerCode = '获取短信验证码';
			},
			clearTimer() {
				clearInterval(this.timer);
				this.timer = null;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.login-box {
		margin: 100rpx 80rpx 40rpx 80rpx;
	}

	.login-form {
		.u-form-item {
			border-bottom: 1px solid #D9D9D9;
		}

		margin-bottom: 60rpx;
	}

	.buttom {
		.loginType {
			display: flex;
			background: red;
			padding: 350rpx 150rpx 150rpx 150rpx;
			justify-content: space-between;

			.item {
				display: flex;
				flex-direction: column;
				text-align: justify; //第一步
				text-align-last: left; //第二步
				color: $u-content-color;
				font-size: 28rpx;
			}
		}
	}
</style>
