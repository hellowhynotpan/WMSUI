<template>
	<view>
		<u-card margin="30rpx" class="container-card" :border="false" border-radius='16'>
			<view class="" slot="head">
				<u-icon :name="getImgUrl('/img/icon/入库单点击.png')" size="44" color="#0067be" label="修改明细">
				</u-icon>
			</view>
			<view slot="body">
				<u-form v-model="inBillDForm" ref="inBillDForm" style="margin: 20rpx 40rpx;">
					<u-form-item label="ERP单号项次:" label-width="200rpx">
						<u-input v-model="inBillDForm.erpCodeLine" placeholder="" type="text"></u-input>
					</u-form-item>
					<u-form-item label="条码编号:" label-width="160rpx">
						<u-input v-model="inBillDForm.snNo" placeholder="" type="text"></u-input>
						<view class="u-m-l-10 u-p-10" @click="scan">
							<u-icon name="scan" color="#969799" size="40"></u-icon>
						</view>
					</u-form-item>
					<u-form-item label="条码数量:" label-width="160rpx">
						<u-input v-model="inBillDForm.snQty" placeholder="请输入条码数量" type="number"></u-input>
					</u-form-item>
					<u-form-item label="条码类型:" label-width="160rpx">
						<u-input v-model="snTypeLabel" placeholder="请选择条码类型" @click="showSnTypeList" type="select"></u-input>
						<u-select :list="snTypeList"  mode="single-column" v-model="showSnType" @confirm="confirmSnType"></u-select>
					</u-form-item>
					<u-form-item label="日期:" label-width="160rpx">
						<u-input v-model="inBillDForm.dateCode" placeholder="请填入日期" @click="chDate" type="select">
						</u-input>
						<u-calendar v-model="showDate" @change="changeSnDateCode"></u-calendar>
					</u-form-item>
					<u-form-item label="批次号:" label-width="160rpx">
						<u-input v-model="inBillDForm.batchNo" placeholder="请填入批次号" type="text"></u-input>
					</u-form-item>
					<u-form-item label="栈板号:" label-width="160rpx">
						<u-input v-model="inBillDForm.palletNo" placeholder="请填入栈板号" type="text"></u-input>
					</u-form-item>
					<u-form-item label="物料:" label-width="160rpx">
						<u-input v-model="partLabel" placeholder="" @click="searchPart" type="select"></u-input>
						<u-select :list="partList" mode="single-column" v-model="showPartList"
							@confirm="confirmPartList"></u-select>
					</u-form-item>
					<u-form-item label="储位:" label-width="160rpx">
						<u-input v-model="csLabel" placeholder="" @click="searchCs" type="select"></u-input>
						<u-select :list="csList" mode="single-column" v-model="showCsList" @confirm="confirmCsList">
						</u-select>
					</u-form-item>
					<u-form-item label="入库数量:" label-width="160rpx">
						<u-input v-model="inBillDForm.inbillQty" placeholder="" type="number"></u-input>
					</u-form-item>
				</u-form>
			</view>
			<view class="" slot="foot">
				<u-button v-show='showEdit' class="btn" @click="submit" type="primary" :disabled="buttonLoading">修改</u-button>
			</view>
		</u-card>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				snTypeList: [{
						label: '单一货品条码',
						value: 0
					},
					{
						label: '箱条码',
						value: 1
					},
					{
						label: '栈板条码',
						value: 2
					}
				],
				inBillDForm: {
					id: null,
					partId: null,
					csId: null,
					erpCodeLine: '',
					snNo: null,
					snQty: 1,
					snType: 0,
					inbillQty: 1,
					dateCode: null,
					batchNo: '',
					palletNo: ''
				},
				showEdit:true,
				buttonLoading:false,
				showDate: false,
				showSnType: false,
				snTypeLabel: '单一货品条码',
				ShowBillDList: true,
				showTypeList: false,
				showCsList: false,
				showPartList: false,
				partLabel: null,
				csLabel: null,
				partTypeLabel: '采购入库',
				csList: [],
				partList: []
			}
		},
		onLoad: function(option) {
			this.inBillDForm = JSON.parse(option.inBillDForm)
			this.snTypeLabel=this.inBillDForm.snType==0?'单一货品条码':this.inBillDForm.snType==1?'箱条码':'栈板条码'
			this.partLabel=this.inBillDForm.partName
			this.csLabel=this.inBillDForm.csName
			if(option.status!=0)
			{
				this.showEdit=false
			}
		},
		methods: {
			getImgUrl(image) {
				return this.baseUrl + image;
			},
			scan() {
				let s = this
				uni.scanCode({
					success: function(res) {
						s.inBillDForm.snNo = res.result + ''
					}
				});
			},
			confirmPartList(e) {
				this.partLabel = e[0].label
				this.inBillDForm.partId = e[0].value
			},
			confirmCsList(e) {
				this.csLabel = e[0].label
				this.inBillDForm.csId = e[0].value
			},
			confirmPartType(e) {
				this.partTypeLabel = e[0].label
				this.inBillDForm.inbillType = e[0].value
			},
			changeSnDateCode(e) {
				this.inBillDForm.dateCode = e.result
			},
			confirmSnType(e) {
				this.snTypeLabel = e[0].label
				this.inBillDForm.snType = e[0].value
			},
			showPartType() {
				this.showTypeList = true
			},
			showSnTypeList() {
				this.showSnType = true
			},
			chDate() {
				this.showDate = true
			},
			//添加明细提交
			submit() {
				if (this.inBillDForm.csId == null) {
					return this.$refs.uToast.show({
						title: '储位不能为空',
						type: 'error',
					})
				}
				if (this.inBillDForm.partId == null) {
					return this.$refs.uToast.show({
						title: '物料不能为空',
						type: 'error',
					})
				}
				if (this.inBillDForm.dateCode == null) {
					return this.$refs.uToast.show({
						title: '日期不能为空',
						type: 'error',
					})
				}
				if (this.inBillDForm.snNo == null) {
					return this.$refs.uToast.show({
						title: '条码编号不能为空',
						type: 'error',
					})
				}
				this.buttonLoading=true
				let pages = getCurrentPages(); //获取所有页面栈实例列表
				let nowPage = pages[pages.length - 1]; //当前页页面实例
				let prevPage = pages[pages.length - 2]; //上一页页面实例
				for (var i = 0; i <= prevPage.$vm.inBillForm.inbillDs.length; i++) {
					if (prevPage.$vm.inBillForm.inbillDs[i].id == this.inBillDForm.id) {
						prevPage.$vm.inBillForm.inbillDs[i].partId = this.inBillDForm.partId
						prevPage.$vm.inBillForm.inbillDs[i].csId = this.inBillDForm.csId
						prevPage.$vm.inBillForm.inbillDs[i].erpCodeLine = this.inBillDForm.erpCodeLine
						prevPage.$vm.inBillForm.inbillDs[i].inbillQty = this.inBillDForm.inbillQty
						prevPage.$vm.inBillForm.inbillDs[i].snNo = this.inBillDForm.snNo
						prevPage.$vm.inBillForm.inbillDs[i].dateCode = this.inBillDForm.dateCode
						prevPage.$vm.inBillForm.inbillDs[i].snType = this.inBillDForm.snType
						prevPage.$vm.inBillForm.inbillDs[i].snQty = this.inBillDForm.snQty
						prevPage.$vm.inBillForm.inbillDs[i].palletNo = this.inBillDForm.palletNo
						prevPage.$vm.inBillForm.inbillDs[i].batchNo = this.inBillDForm.batchNo
						prevPage.$vm.inBillForm.inbillDs[i].partName = this.partLabel
						prevPage.$vm.inBillForm.inbillDs[i].csName = this.csLabel
						break;
					}
				}
				this.$refs.uToast.show({
					title: '修改明细成功',
					type: 'success',
				})
				this.buttonLoading=false
				setTimeout(function() {
					uni.navigateBack({ //uni.navigateTo跳转的返回，默认1为返回上一级
						delta: 1
					})
				}, 1000);
			},
			async searchCs() {
				await this.$u.api.queryCsName({
						createOwner: this.vuex_user.id
					}).then(res => {
						if (res.code == 200) {
							this.csList = []
							if (res.data.length == 0) {
								return this.$refs.uToast.show({
									title: '没有正常状态储位，请先添加储位',
									type: 'error',
								})
							}
							for (let i in res.data) {
								var it = {
									value: res.data[i].id,
									label: res.data[i].csName,
								}
								this.csList.push(it)
								this.showCsList = true
							}
						} else {
							return this.$u.toast(res.msg);
						}
					})
					.catch(err => {
						return this.$u.toast('出错，请稍后再试');
					});
			},
			async searchPart() {
				await this.$u.api.queryPartName({
						createOwner: this.vuex_user.id
					}).then(res => {
						if (res.code == 200) {
							this.partList = []
							if (res.data.length == 0) {
								return this.$refs.uToast.show({
									title: '没有正常状态物料，请先添加物料',
									type: 'error',
								})
							}
							for (let i in res.data) {
								var it = {
									value: res.data[i].id,
									label: res.data[i].partName,
								}
								this.partList.push(it)
								this.showPartList = true
							}
						} else {
							return this.$u.toast(res.msg);
						}
					})
					.catch(err => {
						return this.$u.toast('出错，请稍后再试');
					});
			},
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
</style>
