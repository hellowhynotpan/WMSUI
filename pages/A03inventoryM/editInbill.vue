<template>
	<view class="">
		<u-card margin="30rpx" class="container-card" :border="false" border-radius='16'>
			<view class="" slot="head">
				<u-icon :name="getImgUrl('/img/icon/入库单点击.png')" size="44" color="#0067be" label="入库单">
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
						<u-select :list="typeList" mode="single-column" v-model="showTypeList" @confirm="confirmPartType"></u-select>
					</u-form-item>
					<u-form-item label-width="160rpx" label="备注:">
						<u-input v-model="inBillForm.memo" placeholder="" type="text"></u-input>
					</u-form-item>
					<u-form-item label-width="160rpx" label="明细:">
						<view class="left">
							<view v-show="!ShowBillDList">
								<scroll-view scroll-y show-scrollbar style="height:200rpx;">
									<view v-for="(res, index) in inBillForm.inbillDs" :key="res.lineNo">
										<u-tag :text="'明细'+(index+1)" mode="light" type="info" @click="editDetailed('editDetailed',index)" style="width: 100%;text-align: center;" />
									</view>
								</scroll-view>
							</view>
							<view @click="addBillD" >
								<u-empty text="没有添加明细" mode="list" :show="ShowBillDList"></u-empty>
							</view>
						</view>
						<view class="right" @click="addBillD" v-show='!this.inBillForm.status'>
							<u-icon name="plus" color="#91858b" size="40"></u-icon>
						</view>
					</u-form-item>
				</u-form>
			</view>
			<view class="" slot="foot">
				<u-button class="btn" v-show='!this.inBillForm.status' @click="submit" type="primary" :disabled="buttonLoading">修改</u-button>
				<view class="u-m-t-20"></view>
				<u-button class="btn" v-show='!this.inBillForm.status' @click="examine" type="primary" :disabled="buttonLoading">扣账</u-button>
			</view>
		</u-card>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				apiRequest:{
				   user:'',
				   data:'',
				},
				inBillForm: {},
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
				buttonLoading: false,
				showTypeList: false,
				partTypeLabel: '采购入库',
				showInBillDForm: false,
				csList: [],
				partList: []
			}
		},
		onLoad: function(option) {
			this.showData(option.id)
		},
		methods: {
			getImgUrl(image) {
				return this.baseUrl + image;
			},
			scan() {
				let s = this
				uni.scanCode({
					success: function(res) {
						s.inBillForm.inbillNo = res.result + ''
					}
				});
			},
			editDetailed(path, index) {
				this.$u.route({
					url: '/pages/A03inventoryM/' + path,
					params: {
						inBillDForm: JSON.stringify(this.inBillForm.inbillDs[index]),
						status:this.inBillForm.status
					}
				});
			},
			openPage(path) {
				this.$u.route({
					url: '/pages/A03inventoryM/' + path
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
				if(this.inBillForm.status!=0)
				{
					return;
				}
				this.openPage('addDetailed')
			},
			//移除明细
			tagClick(index) {
				this.inBillForm.inbillDs.splice(index, 1);
			},
			async showData(id) {
				//查询
				let params = {
					Id: id
				}
				await this.$u.api.QueryInbillById(params)
					.then(res => {
						if (res.code == 200) {
							this.inBillForm = res.data
							this.partTypeLabel=res.data.inbillType==0?'采购入库':res.data.inbillType==1?'完工入库':res.data.inbillType==2?'工单退料':res.data.inbillType==3?'销售退回':res.data.inbillType==4?'其他入库':''
						} else {
							return this.$u.toast(res.msg);
						}
					})
					.catch(err => {
						return this.$u.toast('出错，请稍后再试');
					});
			},
			examine(){
				this.buttonLoading = true
				this.apiRequest.user=this.vuex_user.id
				this.apiRequest.data=this.inBillForm.id
				this.$u.api.examine(this.apiRequest).then(res => {
						if (res.code == 200) {
							this.$refs.uToast.show({
								title: '操作成功',
								type: 'success',
								icon: true,
							})
							setTimeout(() => {
								this.buttonLoading = false;
								uni.navigateBack({ //uni.navigateTo跳转的返回，默认1为返回上一级
									delta: 1
								})
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
			async submit() {
				this.buttonLoading = true
				this.inBillForm.createOwner = this.vuex_user.id
				if (this.inBillForm.inbillDs.length == 0) {
					this.buttonLoading = false
					return this.$refs.uToast.show({
						title: '明细不能为空',
						type:  'error',
					})
				}
				for (let i = 0; i < this.inBillForm.inbillDs.length; i++) {
					this.inBillForm.inbillDs[i].lineNo = i + 1
				}
				if(this.inBillForm.status!=0)
				{
					return;
				}
				await this.$u.api.editInBill(this.inBillForm).then(res => {
						if (res.code == 200) {
							this.$refs.uToast.show({
								title: '修改成功',
								type: 'success',
								icon: true,
							})
							setTimeout(() => {
								this.buttonLoading = false;
								uni.navigateBack({ //uni.navigateTo跳转的返回，默认1为返回上一级
									delta: 1
								})
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
