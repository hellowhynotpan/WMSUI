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
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom"
						v-show="isNoData">
						<view class="page-box">
							<view>
								<view class="centre">
									<image :src="getImgUrl('/img/icon/物料点击.png')" mode="aspectFill"></image>
									<view class="explain">
										您还没有物料信息
										<view class="tips">可以去新增物料</view>
										<view class="btn" @click="clickActionSheet('add')">新增物料</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom"
						v-show="!isNoData">
						<checkbox-group>
							<view class="order" v-for="(res, index) in dataList" :key="res.id">
								<view class="top">
									<view class="left">
										<checkbox style="transform:scale(0.7)" />
										<view class="store">{{ res.partName }}</view>
										<u-icon name="arrow-right" color="rgb(203,203,203)" :size="26"
											@click="editPart('editPart',res.id)"></u-icon>
									</view>
									<view class="right">编号：{{ res.partNo }}</view>
								</view>
								<view class="item" @click="editPart('editPart',res.id)">
									<view class="left">
										<image :src="getImgUrl(res.partImage)" mode="aspectFill">
										</image>
									</view>
									<view class="content">
										<view class="title u-line-2">规格：{{ res.partSpec}}</view>
										<view class="title u-line-2">类型：{{ res.partType==0?'原物料':res.partType==1?'半成品':res.partType==2?'成品':'其他' }}</view>
										<view class="title u-line-2">状态：{{ res.status==0?'正常':res.status==1?'作废':'冻结' }}</view>
										<view class="type">备注：{{ res.memo }}</view>
									</view>
									<view class="right">

									</view>
								</view>
							</view>
							<u-loadmore :status="loadStatus[0]" bgColor="#f2f2f2"></u-loadmore>
							<view style="height: 200rpx;">

							</view>
						</checkbox-group>
					</scroll-view>
				</swiper-item>
			</swiper>
			<u-action-sheet :list="list"  @click="clickActionSheet" v-model="showActionSheet"></u-action-sheet>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
					text: '新增'
				}],
				showActionSheet: false,
				query: {
					num: 4,
					func: '',
					createOwner: ''
				},
				dataList: [],
				isNoData: false,
				loadStatus: ['loadmore', 'loadmore', 'loadmore', 'loadmore'],
			};
		},
		onShow() {
			this.getDataList();
		},
		onNavigationBarButtonTap: function(e) {
			this.showActionSheet = !this.showActionSheet
		},
		computed: {},
		methods: {
			getImgUrl(image) {
				return this.baseUrl + image;
			},
			openPage(path) {
				this.$u.route({
					url: '/pages/A02basedataM/' + path
				});
			},
			clickActionSheet()
			{
				this.$u.route({
					url: '/pages/A02basedataM/add',
					params: {
						swiperCurrent: 2
					}
				});
			},
			editPart(path, Id) {
				this.$u.route({
					url: '/pages/A02basedataM/' + path,
					params: {
						id: Id
					}
				});
			},
			// 页面数据
			async getDataList() {
				this.query.createOwner = this.vuex_user.id + ''
				await this.$u.api.queryPart(this.query)
					.then(res => {
						if (res.code == 200) {
							this.dataList = res.data
						} else {
							this.$u.toast(res.msg);
						}
					})
					.catch(err => {
						this.$u.toast('出错，请稍后再试');
					});
				this.loadStatus.splice(0, 1, "loadmore")
				this.dataList.length == 0 ? this.isNoData = true : this.isNoData = false
			},
			reachBottom() {
				this.loadStatus.splice(this.current, 1, "loading")
				setTimeout(() => {
					this.query.num = this.query.num + 3
					this.getDataList();
				}, 1200);
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
				margin-right: 50rpx;
				margin-left: 20rpx;
				margin-bottom: 10rpx;

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
			margin-top: 40rpx;
			padding: 0 10rpx;
			justify-content: space-between;
			align-items: right;

			.btn {
				line-height: 52rpx;
				width: 160rpx;
				border-radius: 26rpx;
				border: 2rpx solid $u-border-color;
				font-size: 26rpx;
				text-align: center;
				color: $u-type-info-dark;
			}

			.evaluate {
				color: #0067be;
				border-color: #0067be;
			}
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
</style>
