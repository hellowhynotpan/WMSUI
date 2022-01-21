<template>
	<view>
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30">
			<view class="u-m-r-20 u-m-t-20">
				<u-avatar :src='getImgUrl(this.vuex_user.headIcon)' size="120"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{ this.vuex_user.nickName}}</view>
				<view class="u-font-14 u-tips-color">{{ this.vuex_user.realName}}</view>
			</view>
			<view class="u-m-l-10 u-p-10">
				<u-icon name="scan" color="#969799" size="28"></u-icon>
			</view>
			<view class="u-m-l-10 u-p-10">
				<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
			</view>
		</view>
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="account-fill" title="个人信息" @click="openPage('mineInfo')"></u-cell-item>
				<u-cell-item title="修改密码" @click="openChangePwd('A06account/findPassword/mobile-findPassword')">
					<u-icon slot="icon" size="44" :name="getImgUrl('/img/icon/修改密码点击.png')"></u-icon>
				</u-cell-item>
				<u-cell-item title="权限管理">
					<u-icon slot="icon" size="44" :name="getImgUrl('/img/icon/权限管理点击.png')"></u-icon>
				</u-cell-item>
				<u-cell-item title="关于">
					<u-icon slot="icon" size="44" :name="getImgUrl('/img/icon/关于点击.png')"></u-icon>
				</u-cell-item>

			</u-cell-group>

		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item title="退出登录" @click="logout()">
					<u-icon slot="icon" size="44" :name="getImgUrl('/img/icon/退出登录点击.png')"></u-icon>
				</u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pic: 'https://uviewui.com/common/logo.png',
				show: true
			}
		},
		onLoad() {

		},
		methods: {
			openPage(path) {
				this.$u.route({
					url: '/pages/A05mine/' + path
				});
			},
			openChangePwd(path) {
				this.$u.route({
					url: '/pages/' + path
				});
			},
			getImgUrl(image) {
				return this.baseUrl + image;
			},
			logout() {
				// 询问是否退出登录？
				uni.showModal({
					content: '是否要退出登录',
					success: (res) => {
						if (res.confirm) {
							//清空缓存并跳转到登录页面
							this.$u.vuex('vuex_user.logined', true);
							this.$u.vuex('vuex_user.id', '');
							this.$u.vuex('vuex_token', '');
							this.$u.vuex('vuex_user.nickName', '');
							this.$u.vuex('vuex_user.headIcon', '');
							this.$u.vuex('vuex_user.realName', '');
							uni.reLaunch({
								url: '/pages/A06account/login/pwd-login'
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #ededed;
	}

	.user-box {
		background-color: #fff;
	}
</style>
