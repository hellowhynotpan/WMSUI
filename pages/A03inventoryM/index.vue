<template>
	<view>
		<view class="page-body">
			<u-card class="container-card" :border="false" :show-foot="false" border-radius='16'>
				<view class="" slot="head"> <u-icon  name="setting-fill" :size="34"></u-icon> 入库管理</view>
				<view slot="body">
					<u-grid :col="3" :border="false">
						<u-grid-item @click="openPage('inBillInfo')">
							<u-icon size="66" :name="getImgUrl('/img/icon/入库单点击.png')"></u-icon>
							<view class="grid-text">入库单</view>
						</u-grid-item>
						<u-grid-item >
							<u-icon size="66" :name="getImgUrl('/img/icon/入库通知单点击.png')"></u-icon>
							<view class="grid-text">入库通知单</view>
						</u-grid-item>
						<u-grid-item >
							<u-icon size="66" :name="getImgUrl('/img/icon/上架点击.png')"></u-icon>
							<view class="grid-text">上架</view>
						</u-grid-item>
					</u-grid>
				</view>
			</u-card>
		</view>	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		onLoad() {

		},
		methods: {
			openPage(path) {
				this.$u.route({
					url: '/pages/A03inventoryM/' + path
				});
			},getImgUrl(image) {
				return this.baseUrl +image;
			},
		}
	}
</script>

<style lang="scss">
	.page-body {
		padding: 180rpx 3%;
		background-image: url(../../static/images/home.png);
		background-size: 100%;
		background-repeat: no-repeat;
	}
	.container-card {
		background-color: #FFFFFF;
		filter: alpha(Opacity=85);
		-moz-opacity: 0.8;
		opacity: 0.85;
		box-shadow: 0px 0px 3px 0px #000000 !important;
	}
	.swiper-box {
		flex: 1;
	}
</style>
