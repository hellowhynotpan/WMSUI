<template>
	<view class="">
	</view>
</template>

<script>
	// navigate.vue页面接受参数
	export default {
		created() { //option为object类型，会序列化上个页面传递的参数
		   console.log("asd");
			uni.reLaunch({
				url: '/pages/A06account/login/pwd-login',
			})
		}
	}
</script>

<style>

</style>
