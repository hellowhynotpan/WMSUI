<template>
	<view>
		<view class="wrap">
			<swiper class="swiper-box">
				<swiper-item class="swiper-item">
					<view style="background-color: #FFFFFF;">
						<u-search v-model="query.func" @change="getDataList" placeholder="请输入关键字" :show-action="true"
							action-text="搜索" shape="square" search-icon-color="#0067be" color="#0067be" clearabled
							style="padding:20rpx 20rpx 20rpx 20rpx;"></u-search>
					</view>
					<scroll-view scroll-y style="height: 100%;width: 100%;" v-show="isNoData">
						<view class="page-box">
							<view>
								<view class="centre">
									<image :src="getImgUrl('/img/icon/库存查询.png')" mode="aspectFill"></image>
									<view class="explain">
										没有库存明细
										<view class="tips"></view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
					<scroll-view scroll-y style="height: 100%;width: 100%;" v-show="!isNoData">
						<view class="order" v-for="(res, index) in dataList" :key="res.id">
							<view class="top">
							</view>
							<view class="item">
								<view class="left">
									<image :src="getImgUrl('/img/icon/库存明细.png')" mode="aspectFill">
									</image>
								</view>
								<view class="content">
									<view class="title u-line-2">条码编号：{{res.snNo}}</view>
									<view class="type">批次号：{{res.batchNo}}</view>
									<view class="type">栈板号：{{ res.palletNo }}</view>
									<view class="type">生产日期：{{ res.dateCode }}</view>
									<view class="type">条码类型：{{ res.snType==0?'单一货品条码':res.status==1?'箱条码':'栈板条码' }}</view>
								</view>
							</view>
						</view>
						<view style="height: 200rpx;">
												
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showActionSheet: false,
				query: {
					id:'',
					func: '',
				},
				dataList: [],
				isNoData: true,
			};
		},
		onLoad: function(option) {
			this.query.id=option.id
			this.getDataList();
		},
		onNavigationBarButtonTap: function(e) {
			this.showActionSheet = !this.showActionSheet
		},
		methods: {
			getImgUrl(image) {
				return this.baseUrl + image;
			},
			openPage(path) {
				this.$u.route({
					url: '/pages/A04warehouseM/' + path
				});
			},
			// 页面数据
			async getDataList() {
				await this.$u.api.quertStockMById(this.query)
					.then(res => {
						if (res.code == 200) {
							this.dataList = res.data
							console.log(this.dataList)
						} else {
							this.$u.toast(res.msg);
						}
					})
					.catch(err => {
						this.$u.toast('出错，请稍后再试');
					});
				this.dataList.length == 0 ? this.isNoData = true : this.isNoData = false
			},
		}
	};
</script>

<style>
	page {
		height: 100%;
		background-color: #f2f2f2;
	}
</style>

<style lang="scss" scoped>
	page {
		background-color: #ededed;
	}

	.footer {
		background-color: #fff;
		line-height: 100rpx;
		margin-bottom: 10rpx;
	}

	.order {
		width: 94%;
		background-color: #ffffff;
		margin: 20rpx auto;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 20rpx;
		font-size: 28rpx;

		.top {
			display: flex;
			justify-content: space-between;

			.left {
				display: flex;
				align-items: center;

				.store {
					margin: 0 10rpx;
					font-size: 30rpx;
					font-weight: bold;
				}
			}

			.right {
				color: #0067be;
				margin: auto 10rpx;
			}
		}

		.item {
			display: flex;
			margin: 20rpx 0 0;

			.left {
				margin: auto 40rpx;

				image {
					width: 140rpx;
					height: 140rpx;
					border-radius: 10rpx;
				}
			}

			.content {
				.title {
					font-size: 28rpx;
					line-height: 50rpx;
				}

				.type {
					margin: 10rpx 0;
					font-size: 24rpx;
					color: $u-tips-color;
				}

				.delivery-time {
					color: #e5d001;
					font-size: 24rpx;
				}
			}

			.right {
				margin-left: 10rpx;
				padding-top: 20rpx;
				text-align: right;

				.decimal {
					font-size: 24rpx;
					margin-top: 4rpx;
				}

				.number {
					color: $u-tips-color;
					font-size: 24rpx;
				}
			}
		}

		.total {
			margin-top: 20rpx;
			text-align: right;
			font-size: 24rpx;

			.total-price {
				font-size: 32rpx;
			}
		}

		.bottom {
			display: flex;
			padding: 0 10rpx;
			justify-content: space-between;
			align-items: right;
			margin-top: 2rpx;
		}
	}

	.centre {
		text-align: center;
		margin: 200rpx auto;
		font-size: 32rpx;

		image {
			width: 164rpx;
			height: 164rpx;
			border-radius: 50%;
			margin-bottom: 20rpx;
		}

		.tips {
			font-size: 24rpx;
			color: #999999;
			margin-top: 20rpx;
		}

		.btn {
			margin: 20rpx auto;
			width: 200rpx;
			border-radius: 10rpx;
			line-height: 64rpx;
			color: #ffffff;
			font-size: 26rpx;
			background: linear-gradient(270deg, rgba(0, 103, 190, 1) 0%, rgba(0, 146, 190, 1.0) 100%);
		}
	}

	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
	}

	.swiper-box {
		flex: 1;
	}

	.swiper-item {
		height: 70%;
	}

	.input {
		background-color: #eee;
		width: 350rpx;
		margin-right: 20rpx;

	}
</style>
