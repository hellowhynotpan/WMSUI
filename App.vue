<script>
	export default {
		onLaunch: function() {
			//初始化完成的时候触发
			console.log('App Launch')
		},
		onShow: function() {
			//从前台到后台时候触发
			console.log('App Show')
		},
		onHide: function() {
			//从后台到前台时触发
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
/*每个页面公共css */
@import '~@/static/style/app.scss';
</style>
