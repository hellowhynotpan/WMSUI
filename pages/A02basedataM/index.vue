<template>
	<view class="content">
		<u-card :border="false" :show-foot="false">
			<view class="" slot="head">基础数据管理</view>
			<view class="" slot="body">
				<view class="u-body-item u-flex  u-col-between u-p-t-0">
					<u-button style="border: none 0rpx;width: 100rpx;height: 100rpx;"  @click="intoInfo()">
						<u-icon size="100" name="home-fill" color="rgb(220,20,60)"></u-icon>
					</u-button>
				</view>
				<view class="u-body-item u-flex  u-col-between u-p-t-0">
					仓库信息
				</view>
			</view>
		</u-card>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		onLoad() {

		},
		methods: {
			intoInfo(){
				uni.navigateTo({
					url: '/pages/A02basedataM/WHInfo',
				});
			}
		}
	}
</script>

<style>
	page {
		background-color: #ededed;
	}
	button::after {
	  border: none;
	}
	button {
	  background-color: #fff;
	}
</style>
