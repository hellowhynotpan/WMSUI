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
					<u-dropdown ref="uDropdown" style="background-color: #FFFFFF;">
						<u-dropdown-item v-model="query.inbillType" :title="inbillTitle" :options="inbillType" @change="changeType">
						</u-dropdown-item>
						<u-dropdown-item v-model="query.status" :title="statusTitle" :options="status" @change="change">
						</u-dropdown-item>
					</u-dropdown>
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom"
						v-show="isNoData">
						<view class="page-box">
							<view>
								<view class="centre">
									<image :src="getImgUrl('/img/icon/入库单点击.png')" mode="aspectFill"></image>
									<view class="explain">
										没有入库单信息
										<view class="tips">可以去新增入库单</view>
										<view class="btn" @click="openPage('addInbill')">新建入库单</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom"
						v-show="!isNoData">
						<checkbox-group>
							<view class="order" v-for="(res, index) in dataList" :key="res.id" @click="editInbill('editInbill',res.id)">
								<view class="top">
									<view class="left">
										
									</view>
									<view class="right">编号：{{ res.inbillNo }}</view>
								</view>
								<view class="item">
									<view class="left">
										<image :src="getImgUrl('/img/icon/入库单点击.png')" mode="aspectFill">
										</image>
									</view>
									<view class="content">
										<view class="title u-line-2">
											类型：{{ res.inbillType==0?'采购入库':res.inbillType==1?'完工入库':res.inbillType==2?'工单退料':res.inbillType==3?'销售退回':'其他入库' }}
										</view>
										<view class="title u-line-2">
											状态：{{ res.status==0?'未处理':res.status==1?'处理中':res.status==2?'已完成':'已抛转' }}
										</view>
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
			<u-action-sheet :list="list" @click="clickActionSheet" v-model="showActionSheet"></u-action-sheet>
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
					createOwner: '',
					status: 4,
					inbillType: 5,
				},
				status: [{
						label: '未处理',
						value: 0
					},
					{
						label: '处理中',
						value: 1
					},
					{
						label: '已完成',
						value: 2
					},
					{
						label: '已抛转',
						value: 3
					},
					{
						label: '全部状态',
						value: 4
					}
				],
				inbillType: [{
						label: '采购入库',
						value: 0
					},
					{
						label: '完工入库',
						value: 1
					},
					{
						label: '工单退料',
						value: 2
					},
					{
						label: '销售退回',
						value: 3
					},
					{
						label: '其他入库',
						value: 4
					},
					{
						label: '全部类型',
						value: 5
					}
				],
				inbillTitle:'全部类型',
				statusTitle: '全部状态',
				dataList: [],
				isNoData: false,
				loadStatus: ['loadmore', 'loadmore', 'loadmore', 'loadmore'],
			};
		},
		onLoad() {
			this.getDataList();
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
			editInbill(path, Id) {
				this.$u.route({
					url: '/pages/A03inventoryM/' + path,
					params: {
						id: Id
					}
				});
			},
			openPage(path) {
				this.$u.route({
					url: '/pages/A03inventoryM/' + path
				});
			},
			change() {
				this.statusTitle=this.query.status==0?'未处理':this.query.status==1?'处理中':this.query.status==2?'已完成':this.query.status==3?'已抛转':'全部状态'
				this.getDataList(4)
			},
			changeType() {
				this.inbillTitle=this.query.inbillType==0?'采购入库':this.query.inbillType==1?'完工入库':this.query.inbillType==2?'工单退料':this.query.inbillType==3?'销售退回':this.query.inbillType==4?'其他入库':'全部类型'
				this.getDataList(4)
			},
			editInBill(path, Id) {
				this.$u.route({
					url: '/pages/A03inventoryM/' + path,
					params: {
						id: Id
					}
				});
			},
			clickActionSheet() {
				this.$u.route({
					url: '/pages/A03inventoryM/addInbill'
				});
			},
			// 页面数据
			async getDataList() {
				this.query.createOwner = this.vuex_user.id
				await this.$u.api.queryInBill(this.query)
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
