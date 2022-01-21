<template>
	<view>
		<view class="page-body">
			<u-card class="container-card" :border="false" :show-foot="false" border-radius='16'>
				<view class="" slot="head"> <u-icon  name="setting-fill" :size="34"></u-icon> 常用</view>
				<view slot="body">
					<u-grid :col="3" :border="false">
						<u-grid-item @click="openPage('/pages/A04warehouseM/stockM')">
							<u-icon size="66" :name="getImgUrl('/img/icon/库存查询点击.png')"></u-icon>
							<view class="grid-text">库存查询</view>
						</u-grid-item>
						<u-grid-item @click="openPage('/pages/A03inventoryM/inBillInfo')">
							<u-icon size="66" :name="getImgUrl('/img/icon/入库单点击.png')"></u-icon>
							<view class="grid-text">入库单</view>
						</u-grid-item>
						<u-grid-item @click="openPage('/pages/A02basedataM/whInfo')">
							<u-icon size="66" :name="getImgUrl('/img/icon/仓库点击.png')"></u-icon>
							<view class="grid-text">仓库信息</view>
						</u-grid-item>
						<u-grid-item @click="openPage('/pages/A02basedataM/csInfo')">
							<u-icon size="66" :name="getImgUrl('/img/icon/储位点击.png')"></u-icon>
							<view class="grid-text">储位信息</view>
						</u-grid-item>
						<u-grid-item @click="openPage('/pages/A02basedataM/partInfo')">
							<u-icon size="66" :name="getImgUrl('/img/icon/物料点击.png')"></u-icon>
							<view class="grid-text">物料信息</view>
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
					url: path
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
