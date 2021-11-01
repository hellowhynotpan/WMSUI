<template>
	<view>
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30">
			<view class="u-m-r-10">
				<u-avatar :src="pic" size="140"></u-avatar>
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
			</u-cell-group>
		</view>		
				
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="setting" title="系统设置" @click="openPage('setting')"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pic:'https://uviewui.com/common/logo.png',
				show:true
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
		}
	}
</script>

<style lang="scss">
page{
	background-color: #ededed;
}
.user-box{
	background-color: #fff;
}
</style>
