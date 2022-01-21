<template>
	<view>
		<u-card margin="30rpx" class="container-card" :border="false" border-radius='16'>
			<view class="" slot="head">
				<u-icon :name="getImgUrl('/img/icon/仓库点击.png')" size="44" color="#0067be" label='仓库信息'>
				</u-icon>

			</view>
			<view class="" slot="body">
				<u-form v-model="editForm" ref="editForm">
					<u-form-item label-width="160rpx" label="仓库编号:">
						<u-input v-model="editForm.whNo" placeholder="不填则自动编码" type="text"></u-input>
					</u-form-item>
					<u-form-item label-width="160rpx" label="仓库名称:" prop="whName">
						<u-input v-model="editForm.whName" placeholder="" type="text"></u-input>
					</u-form-item><!-- 
					<u-form-item label-width="160rpx" label="状态:">
						<u-input v-model="statusTitle" type="select" @click="changeState()" :readonly="true"/>
						<u-select :list="statusList" mode="single-column" v-model="showStateList"
							@confirm="confirmStateList"></u-select>
					</u-form-item> -->
					<u-form-item label-width="160rpx" label="备注:">
						<u-input v-model="editForm.memo" placeholder="" type="text"></u-input>
					</u-form-item>
				</u-form>
			</view>
			<view class="" slot="foot">
				<u-button  @click="edit" type="warning" :loading="buttonLoading">修改</u-button>
				<view class="u-m-t-20"></view>
				<u-button v-show='!this.editForm.status' @click="invalid" type="error" :loading="iButtonLoading">作废</u-button>
			</view>
		</u-card>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				editForm: {
					id: null,
					whNo: '',
					whName: '',
					memo: null,
					lastUpdOwner: '',
				},
				statusTitle: '',
				Invalid: {
					invalidOwner: '',
					id: '',
				},
				buttonLoading: false,
				iButtonLoading:false,
				showStateList: false,
				statusList: [{
						label: '正常',
						value: 0
					},
					{
						label: '作废',
						value: 1
					}
				],
			}
		},
		onLoad: function(option) {
			this.showData(option.id)
		},
		methods: {
			getImgUrl(image) {
				return this.baseUrl + image;
			},
			changeState() {
				this.showStateList = true
			},
			confirmStateList(e) {
				this.editForm.status = e[0].value
				this.statusTitle = e[0].label
			},
			async showData(id) {
				//查询
				let params = {
					Id: id
				}
				await this.$u.api.findWh(params)
					.then(res => {
						if (res.code == 200) {
							this.editForm = res.data
							this.statusTitle = this.editForm.status == 0 ? '正常' : this.editForm.status == 1 ?
								'作废' : '未知状态'
						} else {
							return this.$u.toast(res.msg);
						}
					})
					.catch(err => {
						return this.$u.toast('出错，请稍后再试');
					});
			},
			//修改
			async edit() {
				await this.$refs.editForm.validate(valid => {
					if (valid) {
						this.buttonLoading = true
						this.editForm.lastUpdOwner = this.vuex_user.id
						this.$u.api.editWh(this.editForm)
							.then(res => {
								if (res.code == 200) {
									this.$u.toast("修改成功");
									setTimeout(() => {
										this.buttonLoading = false
										uni.navigateBack({});
									}, 500);
								} else {
									this.buttonLoading = false
									return this.$u.toast(res.msg);
								}
							})
							.catch(err => {
								this.buttonLoading = false
								return this.$u.toast('出错，请稍后再试');
							});
					} else {
						console.log('验证失败');
					}
				});
			},
			//作废
			async invalid() {
				await uni.showModal({
					content: '是否要作废该仓库',
					success: (res) => {
						if (res.confirm) {
							this.iButtonLoading = true
							this.Invalid.id = this.editForm.id
							this.Invalid.invalidOwner = this.vuex_user.id
							this.$u.api.invalidWh(this.Invalid)
								.then(res => {
									if (res.code == 200) {
										this.$u.toast("作废成功");
										setTimeout(() => {
											this.iButtonLoading = false
											uni.navigateBack({});
										}, 500);
									} else {
										this.iButtonLoading = false
										return this.$u.toast(res.msg);
									}
								})
								.catch(err => {
									this.iButtonLoading = false
									return this.$u.toast('出错，请稍后再试');
								});
						}
					}
				})
			},
		}
	}
</script>

<style>
	.btn {
		margin: 0rpx auto;
		width: 100%;
		border-radius: 10rpx;
		line-height: 80rpx;
		color: #ffffff;

		font-size: 26rpx;
		text-align: center;
		background: linear-gradient(270deg, rgba(249, 174, 61, 1.0) 0%, rgba(249, 174, 61, 1.0) 100%);
	}
</style>
