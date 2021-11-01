<template>
	<view>
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="lock" title="账号与安全"></u-cell-item>
				<u-cell-item icon="trash" title="清除缓存"></u-cell-item>
				<u-cell-item icon="question" title="意见反馈"></u-cell-item>
			</u-cell-group>
		</view>
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="account-fill" title="注销" @click="logout()"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '系统设置',
			};
		},
		methods: {
			openPage(path) {
				this.$u.route({
					url: '/pages/A06account/' + path
				});
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
</style>
