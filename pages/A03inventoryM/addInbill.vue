<template>
	<view class="">
		<u-card margin="30rpx" class="container-card" :border="false" border-radius='16'>
			<view class="" slot="head">
				<u-icon :name="getImgUrl('/img/icon/入库单点击.png')" size="44" color="#0067be" label="新增入库单">
				</u-icon>
			</view>
			<view class="" slot="body">
				<u-form v-model="inBillForm" ref="inBillForm">
					<u-form-item label-width="160rpx" label="单据编号:">
						<u-input v-model="inBillForm.inbillNo" placeholder="不填则自动编码" type="text">
						</u-input>
						<view class="u-m-l-10 u-p-10" @click="scan">
							<u-icon name="scan" color="#969799" size="40"></u-icon>
						</view>
					</u-form-item>
					<u-form-item label-width="160rpx" label="ERP单号:">
						<u-input v-model="inBillForm.erpCode" placeholder="" type="text"></u-input>
					</u-form-item>
					<u-form-item label-width="160rpx" label="物料类型:">
						<u-input v-model="partTypeLabel" type="select" @click="showPartType" />
						<u-select :list="typeList" mode="single-column" v-model="showTypeList"
							@confirm="confirmPartType">
						</u-select>
					</u-form-item>
					<u-form-item label-width="160rpx" label="备注:">
						<u-input v-model="inBillForm.memo" placeholder="备注...100字以内" type="textarea"></u-input>
					</u-form-item>
					<u-form-item label-width="160rpx" label="明细:">
						<view class="left">
							<view v-show="!ShowBillDList">
								<scroll-view scroll-y show-scrollbar style="height:200rpx;">
									<view v-for="(res, index) in inBillForm.inbillDs" :key="res.lineNo">
										<u-tag :text="'明细'+(index+1)" mode="light" type="info" closeable
											@close="tagClick(index)" @click="editDetailed('editDetailed',index)"
											style="width: 100%;height:60rpx;text-align: center;" />
									</view>
								</scroll-view>
							</view>
							<view @click="addBillD">
								<u-empty text="没有添加明细" mode="list" :show="ShowBillDList"></u-empty>
							</view>
						</view>
						<view class="right" @click="addBillD">
							<u-icon name="plus" color="#91858b" size="40"></u-icon>
						</view>
					</u-form-item>
				</u-form>
			</view>
			<view class="" slot="foot">
				<u-button class="btn" @click="submit" type="primary" :disabled="buttonLoading">新增</u-button>
			</view>
		</u-card>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				inBillForm: {
					inbillNo: null,
					inbillType: 0,
					memo: null,
					status: 0,
					erpCode: '',
					createOwner: '',
					inbillDs: [],
				},
				typeList: [{
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
					}
				],
				stateusList: [{
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
				],
				ShowBillDList: true,
				showTypeList: false,
				partTypeLabel: '采购入库',
				showInBillDForm: false,
				csList: [],
				partList: [],
				buttonLoading: false,
			}
		},
		methods: {
			getImgUrl(image) {
				return this.baseUrl + image;
			},
			editDetailed(path, index) {
				this.$u.route({
					url: '/pages/A03inventoryM/' + path,
					params: {
						inBillDForm: JSON.stringify(this.inBillForm.inbillDs[index])
					}
				});
			},
			openPage(path) {
				this.$u.route({
					url: '/pages/A03inventoryM/' + path
				});
			},
			scan() {
				let s = this
				uni.scanCode({
					success: function(res) {
						s.inBillForm.inbillNo = res.result + ''
					}
				});
			},
			confirmPartType(e) {
				this.partTypeLabel = e[0].label
				this.inBillForm.inbillType = e[0].value
			},
			showPartType() {
				this.showTypeList = true
			},
			addBillD() {
				this.openPage('addDetailed')
			},
			//移除明细
			tagClick(index) {
				this.inBillForm.inbillDs.splice(index, 1);
			},
			async submit() {
				this.buttonLoading = true;
				this.inBillForm.createOwner = this.vuex_user.id
				if (this.inBillForm.inbillDs.length == 0) {
					this.buttonLoading = false;
					return this.$refs.uToast.show({
						title: '明细不能为空',
						type: 'error',
					})
				}
				for (let i = 0; i < this.inBillForm.inbillDs.length; i++) {
					this.inBillForm.inbillDs[i].lineNo = i + 1
				}
				await this.$u.api.createInBill(this.inBillForm).then(res => {
						if (res.code == 200) {
							this.$refs.uToast.show({
								title: '新增成功',
								type: 'success',
								icon: true,
							})
							setTimeout(() => {
								this.buttonLoading = false;
								uni.navigateBack({});
							}, 1000);

						} else {
							this.buttonLoading = false;
							return this.$u.toast(res.msg);
						}
					})
					.catch(err => {
						this.buttonLoading = false;
						return this.$u.toast('出错，请稍后再试');
					});
			},
		},
		watch: {
			inBillForm: { //深度监听，可监听到对象、数组的变化
				handler(val, oldVal) {
					if (val.inbillDs.length != 0) {
						this.ShowBillDList = false
					}
				},
				deep: true //true 深度监听
			}
		}
	}
</script>

<style>
	.form-box {
		width: 80%;

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

	.left {
		float: left;
		width: 60%;
	}

	.right {
		float: right;
		width: 40%;
		text-align: center;
	}
</style>
