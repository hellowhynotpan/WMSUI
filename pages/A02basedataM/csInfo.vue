<template>
	<view>
		<view class="wrap">
			<swiper class="swiper-box">
				<swiper-item class="swiper-item">

					<view style="background-color: #FFFFFF;">
						<u-search v-model="query.func" @change="getDataList" placeholder="请输入关键字" :show-action="true"
							action-text="搜索" shape="square" search-icon-color="#0067be" color="#0067be" clearabled
							style="padding:20rpx 20rpx 0rpx 20rpx;"></u-search>
					</view>
					<u-dropdown ref="uDropdown" style="background-color: #FFFFFF;">
						<u-dropdown-item :title="query.whName==''?'全部':query.whName">
							<view class="slot-content" style="background-color: #FFFFFF;">
								<scroll-view scroll-y="true" style="height: 300rpx;">
									<view class="u-text-center u-content-color u-m-t-20 u-m-b-20"
										v-for="(res, index) in whList" :key="res.label" @click="closeDropdown(res)">
										{{res.label}}</view>
								</scroll-view>
							</view>
						</u-dropdown-item>
						<u-dropdown-item v-model="query.status" :title="statusTitle" :options="status" @change="change">
						</u-dropdown-item>
					</u-dropdown>
					<scroll-view scroll-y="true" style="height: 100%;width: 100%;" v-show="isNoData">
						<view class="page-box">
							<view>
								<view class="centre">
									<image :src="getImgUrl('/img/icon/储位点击.png')" mode="aspectFill"></image>
									<view class="explain">
										没有储位
										<view class="tips">可以去新建储位</view>
										<view class="btn" @click="openPage('add')">新建储位</view>
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
										<view class="store">{{ res.csName }}</view>
										<u-icon name="arrow-right" color="rgb(203,203,203)" :size="26"
											@click="editCs('editCs',res.id)"></u-icon>
									</view>
									<view class="right">编号：{{ res.csNo }}</view>
								</view>
								<view class="item" @click="editCs('editCs',res.id)">
									<view class="left">
										<image :src="getImgUrl('/img/icon/储位点击.png')" mode="aspectFill">
										</image>
									</view>
									<view class="content">
										<view class="title u-line-2">状态：{{ res.status==0?'正常':res.status==1?'作废':'冻结' }}
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
				statusTitle:'全部',
				status: [{
						label: '正常',
						value: 0
					},
					{
						label: '作废',
						value: 1
					},
					{
						label: '冻结',
						value: 2
					},
					{
						label: '全部',
						value: 3
					}
				],
				showActionSheet: false,
				query: {
					num: 3,
					func: '',
					createOwner: '',
					status: 3,
					whId: '',
					whName:'',
				},
				Invalid: {
					invalidOwner: '',
					id: '',
				},
				whList: [],
				isNoData: false,
				dataList: [],
				page: 0,
				current: 0,
				loadStatus: ['loadmore', 'loadmore', 'loadmore', 'loadmore'],
			};
		},
		onShow() {
			this.getDataList();
			this.searchWh()
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
					url: '/pages/A02basedataM/' + path,
					params: {
						swiperCurrent: 1,
					}
				});
			},
			closeDropdown(item) {
				this.$refs.uDropdown.close();
				this.query.whName=item.label
				this.query.whId=item.value
				this.getDataList(4)
			},
			change() {
				this.statusTitle=this.query.status==0?'正常':this.query.status==1?'作废':this.query.status==2?'冻结':'全部',
				this.getDataList(4)
			},
			clickActionSheet() {
				this.$u.route({
					url: '/pages/A02basedataM/add',
					params: {
						swiperCurrent: 1
					}
				});
			},
			editCs(path, Id) {
				this.$u.route({
					url: '/pages/A02basedataM/' + path,
					params: {
						id: Id
					}
				});
			},
			async searchWh() {
				await this.$u.api.queryWhName({
						createOwner: this.vuex_user.id
					}).then(res => {
						if (res.code == 200) {
							this.whList = []
							for (let i in res.data) {
								var it = {
									value: res.data[i].id,
									label: res.data[i].whName,
								}
								this.whList.push(it)
							}
							this.whList.push({value:'',label:'全部'})
						} else {
							return this.$u.toast(res.msg);
						}
					})
					.catch(err => {
						return this.$u.toast('出错，请稍后再试');
					});
			},
			reachBottom() {
				this.loadStatus.splice(this.current, 1, "loading")
				setTimeout(() => {
					this.getDataList(this.current);
				}, 1200);
			},
			// 页面数据
			async getDataList(idx) {
				this.query.createOwner = this.vuex_user.id
				await this.$u.api.queryCs(this.query)
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
			async invalid(id) {
				await uni.showModal({
					content: '是否要作废该储位',
					success: (res) => {
						if (res.confirm) {
							this.Invalid.id = id
							this.Invalid.invalidOwner = this.vuex_user.id
							this.$u.api.invalidCs(this.Invalid)
								.then(res => {
									if (res.code == 200) {
										this.getDataList()
										return this.$u.toast("作废成功");
									} else {
										return this.$u.toast(res.msg);
									}
								})
								.catch(err => {
									return this.$u.toast('出错，请稍后再试');
								});
						}
					}
				})
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
	.order {
		width: 710rpx;
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
					color: #d81e06;
					font-size: 24rpx;
				}
			}

			.right {
				margin-left: 10rpx;
				padding-top: 20rpx;
				text-align: right;
			}
		}

		.bottom {
			display: flex;
			margin-top: 40rpx;
			padding: 0 10rpx;
			justify-content: space-between;
			align-items: center;

			.btn {
				line-height: 52rpx;
				width: 160rpx;
				border-radius: 26rpx;
				border: 2rpx solid #d81e06;
				font-size: 26rpx;
				text-align: center;
				color: #d81e06;
			}

			.evaluate {
				color: #d81e06;
				border-color: #d81e06;
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
			border-radius: 2%;
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
		height: 100%;
	}
</style>
