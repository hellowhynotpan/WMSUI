<template>
	<view>
		<view class="wrap">
			<view class="u-tabs-box">
				<u-tabs-swiper activeColor="#0067be" ref="uTabs" :list="list" :current="current" @change="tabsChange"
					:is-scroll="false" swiperWidth="25%"></u-tabs-swiper>
			</view>
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition"
				@animationfinish="animationfinish">
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="width: 100%;">
						<u-card margin="30rpx" class="container-card" :border="false" border-radius='16'>
							<view class="" slot="head">
								<u-icon :name="getImgUrl('/img/icon/仓库点击.png')" size="44" color="#0067be"
									label=" 新增仓库信息">
								</u-icon>
							</view>
							<view class="" slot="body">
								<u-form v-model="addWhForm" ref="addWhForm">
									<u-form-item label-width="160rpx" label="仓库编号:" prop="whNo">
										<u-input v-model="addWhForm.whNo" placeholder="不填则自动编码" type="text"></u-input>
										<view class="u-m-l-10 u-p-10" @click="scanWhNo">
											<u-icon name="scan" color="#969799" size="40"></u-icon>
										</view>
									</u-form-item>
									<u-form-item label-width="160rpx" label="仓库名称:" prop="whName">
										<u-input v-model="addWhForm.whName" placeholder="请输入仓库名称" type="text"></u-input>
									</u-form-item>
									<u-form-item label-width="160rpx" label="备注:" prop="memo">
										<u-input v-model="addWhForm.memo" placeholder="" type="text"></u-input>
									</u-form-item>
								</u-form>
							</view>
							<view class="" slot="foot">
								<u-button class="btn" @click="addWh" type="primary" :loading="addWhbuttonLoading">新增
								</u-button>
							</view>
						</u-card>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="width: 100%;">
						<u-card margin="30rpx" class="container-card" :border="false" border-radius='16'>
							<view class="" slot="head">
								<u-icon :name="getImgUrl('/img/icon/储位点击.png')" size="44" color="#0067be"
									label=" 新增储位信息">
								</u-icon>
							</view>
							<view class="" slot="body">
								<u-form v-model="addCsForm" ref="addCsForm">
									<u-form-item label-width="160rpx" label="储位编号:">
										<u-input v-model="addCsForm.csNo" placeholder="不填则自动编码" type="text"></u-input>
										<view class="u-m-l-10 u-p-10" @click="scanCsNo">
											<u-icon name="scan" color="#969799" size="40"></u-icon>
										</view>
									</u-form-item>
									<u-form-item label-width="160rpx" label="储位名称:" prop="csName">
										<u-input v-model="addCsForm.csName" placeholder="" type="text"></u-input>
									</u-form-item>
									<u-form-item label-width="160rpx" label="仓库:">
										<u-input v-model="addCsForm.whName" type="select" @click="searchWh()" />
										<u-select :list="whList" mode="single-column" v-model="showSWh"
											@confirm="confirm"></u-select>
									</u-form-item>
									<u-form-item label-width="160rpx" label="备注:">
										<u-input v-model="addCsForm.memo" placeholder="" type="text"></u-input>
									</u-form-item>
								</u-form>
							</view>
							<view class="" slot="foot">
								<u-button class="btn" @click="addCs" type="primary" :loading="addCsbuttonLoading">新增
								</u-button>
							</view>
						</u-card>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="width: 100%;">
						<u-card margin="30rpx" class="container-card" :border="false" border-radius='16'>
							<view class="" slot="head">
								<u-icon :name="getImgUrl('/img/icon/物料点击.png')" size="44" color="#0067be"
									label=" 新增物料信息">
								</u-icon>
							</view>
							<view class="" slot="body">
								<u-form v-model="addPartForm" ref="addPartRef">
									<u-form-item label-width="160rpx" label="物料编号:" prop="partNo">
										<u-input v-model="addPartForm.partNo" placeholder="不填则自动编码" type="text">
										</u-input>
										<view class="u-m-l-10 u-p-10" @click="scanPartNo">
											<u-icon name="scan" color="#969799" size="40"></u-icon>
										</view>
									</u-form-item>
									<u-form-item label-width="160rpx" prop="partName" label="物料名称:">
										<u-input v-model="addPartForm.partName" placeholder="请输入物料名称" type="text">
										</u-input>
									</u-form-item>
									<u-form-item label-width="160rpx" label="物料规格:">
										<u-input v-model="addPartForm.partSpec" placeholder="" type="text"></u-input>
									</u-form-item>
									<u-form-item label-width="160rpx" label="物料类型:">
										<u-input v-model="partTypeLabel" type="select" @click="showPartType" />
										<u-select :list="typeList" mode="single-column" v-model="showTypeList"
											@confirm="confirmPartType"></u-select>
									</u-form-item>
									<u-form-item label-width="160rpx" label="备注:">
										<u-input v-model="addPartForm.memo" placeholder="" type="text"></u-input>
									</u-form-item>
									<u-upload ref="uUpload" @on-choose-complete="chosseComplete" @on-remove="onRemove"
										@on-change="changeAddPart" :action="action" :form-data="addPartForm"
										:header="header" max-count="1" :auto-upload="false"></u-upload>
								</u-form>
							</view>
							<view class="" slot="foot">
								<u-button class="btn" @click="addPart" type="primary" :loading="addPartbuttonLoading">新增
								</u-button>
							</view>
						</u-card>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						name: '新增仓库'
					},
					{
						name: '新增储位'
					},
					{
						name: '新增物料'
					}
				],
				typeList: [{
						label: '原物料',
						value: 0
					},
					{
						label: '半成品',
						value: 1
					},
					{
						label: '成品',
						value: 2
					},
					{
						label: '其他',
						value: 3
					}
				],
				showTypeList: false,
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				tabsHeight: 0,
				dx: 0,
				isHaveImg: false,
				partTypeLabel: '原物料',
				addCsbuttonLoading: false,
				addWhbuttonLoading: false,
				addPartbuttonLoading: false,
				//新增时需要的变量
				addWhForm: {
					whNo: '',
					whName: null,
					memo: null,
					createOwner: '',
				},
				addCsForm: {
					csNo: '',
					whNo: '',
					csName: '',
					memo: '',
					createOwner: '',
					whId: '',
				},
				addPartForm: {
					partNo: '',
					partName: '',
					partSpec: '',
					partImage: '',
					partType: 0,
					memeo: '',
					createOwner: null,
				},
				header: {
					Authorization: ''
				},
				action: '/api/BasePart/CreateByImg',
				//储位
				showSWh: false,
				whList: [],
				rules: {
					whName: [],
					whNo: [],
					memo: []
				}
			}
		},
		onLoad: function(option) {
			this.current = option.swiperCurrent
			this.swiperCurrent = option.swiperCurrent
			this.header.Authorization = "Bearer " + this.vuex_token
			this.action = this.baseUrl + this.action
		},
		onReady() {
			this.$refs.addWhForm.setRules(this.rules);
		},
		methods: {
			getImgUrl(image) {
				return this.baseUrl + image;
			},
			openPage(path) {
				this.$u.route({
					url: '/pages/A02basedataM/' + path
				});
			},
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			scanWhNo() {
				let s = this
				uni.scanCode({
					success: function(res) {
						s.addWhForm.whNo = res.result + ''
					}
				});
			},
			scanCsNo() {
				let s = this
				uni.scanCode({
					success: function(res) {
						s.addCsForm.csNo = res.result + ''
					}
				});
			},
			scanPartNo() {
				let s = this
				uni.scanCode({
					success: function(res) {
						s.addPartForm.partNo = res.result + ''
					}
				});
			},
			confirmPartType(e) {
				this.partTypeLabel = e[0].label
				this.addPartForm.partType = e[0].value
			},
			showPartType() {
				this.showTypeList = true
			},
			confirm(e) {
				this.addCsForm.whName = e[0].label
				this.addCsForm.whId = e[0].value
			},
			//查询仓库信息
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
							this.showSWh = true
						} else {
							return this.$u.toast(res.msg);
						}
					})
					.catch(err => {
						return this.$u.toast('出错，请稍后再试');
					});
			},
			//新增仓库
			async addWh() {
				if (this.addWhForm.whName == '' || this.addWhForm.whName == null) {
					return this.$refs.uToast.show({
						title: '请输入仓库名称',
						type: 'error',
					})
				}
				await this.$refs.addWhForm.validate(valid => {
					if (valid) {
						this.addWhbuttonLoading = true
						this.addWhForm.createOwner = this.vuex_user.id
						this.$u.api.addWh(this.addWhForm)
							.then(res => {
								if (res.code == 200) {
									this.addWhbuttonLoading = false
									this.$refs.uToast.show({
										title: '添加成功',
										type: 'success',
									})
									this.addWhForm.memo=null
									this.addWhForm.whName=null
									this.addWhForm.whNo=null
								} else {
									this.addWhbuttonLoading = false
									return this.$u.toast(res.msg);
								}
							})
							.catch(err => {
								this.addWhbuttonLoading = false
								return this.$u.toast('出错，请稍后再试');
							});
							
					} else {}
				});
			},
			//新增储物
			async addCs() {
				if (this.addCsForm.csName == '' || this.addCsForm.csName == null) {
					return this.$refs.uToast.show({
						title: '请填入储位名称',
						type: 'error',
					})
				}
				if (this.addCsForm.whId == '') {
					return this.$refs.uToast.show({
						title: '请选择仓库',
						type: 'error',
					})
				}
				await this.$refs.addCsForm.validate(valid => {
					if (valid) {
						this.addCsbuttonLoading = true
						this.addCsForm.createOwner = this.vuex_user.id
						this.$u.api.addCs(this.addCsForm)
							.then(res => {
								if (res.code == 200) {
									this.addCsbuttonLoading = false
									this.$refs.uToast.show({
										title: '添加成功',
										type: 'success',
									})
									this.addCsForm.memo=null
									this.addCsForm.csNo=''
									this.addCsForm.csName=''
									this.addCsForm.whName=''
								} else {
									this.addCsbuttonLoading = false
									return this.$u.toast(res.msg);
								}
							})
							.catch(err => {
								this.addCsbuttonLoading = false
								return this.$u.toast('出错，请稍后再试');
							});
					} else {

					}
				});
			},
			//新增物料信息
			addPart() {
				this.addPartForm.createOwner = this.vuex_user.id
				if (this.isHaveImg) {
					if (this.addPartForm.partName == '' || this.addPartForm.partName == null) {
						return this.$refs.uToast.show({
							title: '请填入物料名称',
							type: 'error',
						})
					}
					this.$refs.uUpload.upload();
				} else {
					this.$refs.addPartRef.validate(valid => {
						if (valid) {
							this.addPartbuttonLoading = true
							this.$u.api.addPart(this.addPartForm)
								.then(res => {
									if (res.code == 200) {
										this.addPartbuttonLoading = false
										this.$refs.uToast.show({
											title: '添加成功',
											type: 'success',
										})
									this.addPartForm.memo=''
									this.addPartForm.partNo=''
									this.addPartForm.partName=''
									this.addPartForm.partSpec=''
									} else {
										this.addPartbuttonLoading = false
										return this.$refs.uToast.show({
											title: res.msg,
											type: 'error',
										})
									}
								})
								.catch(err => {
									this.addPartbuttonLoading = false
									return this.$u.toast('出错，请稍后再试');
								});
						} else {}
					})
				}
			},
			changeAddPart(res, index, lists, name) {
				this.addPartbuttonLoading = true
				var it = JSON.parse(res.data)
				if (it.code == 200) {
					this.addPartbuttonLoading = false
					this.$u.toast("新增成功");
					this.$refs.uUpload.clear();
				} else {
					this.addPartbuttonLoading = false
					this.$u.toast("新增失败");
				}
			},
			chosseComplete() {
				this.isHaveImg = true
			},
			onRemove() {
				this.isHaveImg = false
			},
		}
	}
</script>

<style lang="scss">
	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
	}

	.container-card {
		filter: alpha(Opacity=85);
		-moz-opacity: 0.8;
		opacity: 0.85;
	}

	.swiper-box {
		flex: 1;
	}

	.swiper-item {
		height: 100%;
	}

	.btn {
		margin: 0rpx auto;
		width: 100%;
		border-radius: 10rpx;
		line-height: 80rpx;
		color: #ffffff;
		font-size: 26rpx;

		text-align: center;
		background: linear-gradient(270deg, rgba(0, 103, 190, 1) 0%, rgba(0, 146, 190, 1.0) 100%);
	}
</style>
