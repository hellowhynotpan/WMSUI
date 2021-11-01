<template>
	<view >
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="account-fill" title="人脸信息修改" @click="openPage('faceInfo')"></u-cell-item>
			</u-cell-group>
		</view>	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '个人信息',
			};
		},
		methods: {
			openPage(path) {
				this.$u.route({
					url: '/pages/A05mine/' + path
				});
			},
		}
	}
</script>


<style lang="scss" >
page{
	background-color: #ededed;
}

</style>
