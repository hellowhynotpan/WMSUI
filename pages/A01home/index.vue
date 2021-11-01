<template>
	<view >
		<view class="page-body">
			<u-card class="container-card" :border="false" :show-foot="false" 
			    border-radius='16'
				>
				<view slot="body">

				</view>
			</u-card>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.page-body{
		padding: 180rpx 3%;
		background-image:url(../../static/images/home.png);
		background-size: 100%;
		background-repeat: no-repeat;
		
	}
	.container-card {
		height: 480rpx;
		background-color: #FFFFFF;
		filter:alpha(Opacity=85);
		-moz-opacity:0.8;
		opacity: 0.85;
		box-shadow:0px 0px 3px 0px #000000 !important;
	}
</style>
