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
						<u-dropdown-item :title="query.whName==''?'全部仓库':query.whName">
							<view class="slot-content" style="background-color: #FFFFFF;">
								<scroll-view scroll-y="true" style="height: 180rpx;">
									<view class="u-text-center u-content-color u-m-t-20 u-m-b-20"
										v-for="(res, index) in whList" :key="res.label" @click="closeDropdown(res)">
										{{res.label}}
									</view>
								</scroll-view>
							</view>
						</u-dropdown-item>
						<u-dropdown-item v-model="query.partType" :title="smTypeTitle" :options="smTypeList"
							@change="changeSmType">
						</u-dropdown-item>
						<u-dropdown-item title="更多筛选">
							<view class="slot-content" >
								<view class="u-text-center u-content-color" style="background-color: #FFFFFF;">
									<view style="width: 80%; margin: 0rpx auto;">
										<u-field v-model="query.csNo" label="储位:" placeholder="请输入储位编号">
										</u-field>
										<u-field v-model="query.partNo" label="物料编号:" placeholder="请输入物料编号">
										</u-field>
										<u-field v-model="query.partName" label="物料名称:" placeholder="请输入物料名称">
										</u-field>
										<u-field v-model="query.partSpec" label="规格型号:" placeholder="请输入规格型号">
										</u-field>
										<view class="u-m-t-20 " style="height: 80rpx;">
											<u-button size="medium" type="warning" style="height: 60rpx;margin-right: 40rpx;" @click="closeDropdownReset">重置</u-button>
											<u-button size="medium" type="primary" style="height: 60rpx;margin-right: 40rpx;" @click="closeDropdownSure">确定</u-button>
										</view>
									</view>
								</view>
							</view>
						</u-dropdown-item>
					</u-dropdown>
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom"
						v-show="isNoData">
						<view class="page-box">
							<view>
								<view class="centre">
									<image :src="getImgUrl('/img/icon/库存查询.png')" mode="aspectFill"></image>
									<view class="explain">
										没有库存
										<view class="tips"></view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom"
						v-show="!isNoData">
						<checkbox-group>
							<view class="order" v-for="(res, index) in dataList" :key="res.id" @click="openPage('stockD',res.id)">
								<view class="top">
								</view>
								<view class="item" >
									<view class="left">
										<image :src="getImgUrl('/img/icon/库存.png')" mode="aspectFill">
										</image>
									</view>
									<view class="content">
										<view class="title u-line-2">物料名称：{{res.partName}}</view>
										<view class="type">仓库：{{res.whName}}</view>
										<view class="type">储位：{{ res.csName }}</view>
										<view class="type">物料规格：{{ res.partSpec }}</view>
										<view class="type">物料编号：{{ res.partNo }}</view>
									</view>
								</view>
								<u-grid :col="3">
										<u-grid-item>
											{{res.stockQty}}件
											<view class="grid-text">库存数量</view>
										</u-grid-item>
										<u-grid-item>
											0件
											<view class="grid-text">待入库</view>
										</u-grid-item>
										<u-grid-item>
											0件
											<view class="grid-text">待出库</view>
										</u-grid-item>
									</u-grid>
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
					func:'',
					num: 4,
					createOwner: '',
					whId: '',
					csNo: '',
					partNo: '',
					partName: '',
					partSpec: '',
					isInAbleNone: false,
					whName: '',
					partType:4
				},
				smTypeTitle: '全部类型',
				smTypeList: [{
						label: '原物料',
						value: 0
					},
					{
						label: '半成',
						value: 1
					},
					{
						label: '成品',
						value: 2
					},
					{
						label: '其 他',
						value: 3
					},
					{
						label: '全部类型',
						value: 4
					}
				],
				whList: [{
					label: '全部仓库',
					value: null
				}],
				dataList: [],
				isNoData: true,
				loadStatus: ['loadmore', 'loadmore', 'loadmore', 'loadmore'],
			};
		},
		onLoad() {
			this.getDataList();
			this.searchWh()
		},
		onNavigationBarButtonTap: function(e) {
			this.showActionSheet = !this.showActionSheet
		},
		computed: {},
		methods: {
			getImgUrl(image) {
				return this.baseUrl + image;
			},
			openPage(path,stockMId) {
				this.$u.route({
					url: '/pages/A04warehouseM/' + path,
					params: {
						id: stockMId
					}
				});
			},
			closeDropdown(item) {
				this.$refs.uDropdown.close();
				this.query.whName = item.label
				this.query.whId = item.value
				this.getDataList(4)
			},
			clickActionSheet() {
				this.$u.route({
					url: '/pages/A04warehouseM/add',
					params: {
						swiperCurrent: 0
					}
				});
			},
			closeDropdownReset(){
				this.query.partNo = null
				this.query.partSpec = null
				this.query.partName = null
				this.query.csNo = null
			},
			closeDropdownSure(){
				this.$refs.uDropdown.close();
				this.getDataList(4)
			},
			changeSmType() {
				this.smTypeTitle = this.query.partType == 0 ? '原物料' : this.query.partType == 1 ? '半成品' : this.query
					.partType == 2 ? '成品' :this.query.partType == 3 ?  '其他':'全部'
					this.getDataList(4)
			},
			changeWh() {
				this.searchWh()
			},
			async searchWh() {
				await this.$u.api.queryWhName({
						createOwner: this.vuex_user.id
					}).then(res => {
						if (res.code == 200) {
							for (let i in res.data) {
								var it = {
									value: res.data[i].id,
									label: res.data[i].whName,
								}
								this.whList.push(it)
							}
						} else {
							return this.$u.toast(res.msg);
						}
					})
					.catch(err => {
						return this.$u.toast('出错，请稍后再试');
					});
			},
			// 页面数据
			async getDataList() {
				this.query.createOwner = this.vuex_user.id
				await this.$u.api.queryStock(this.query)
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
