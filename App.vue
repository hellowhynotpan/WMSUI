<script>
	export default {
		onLaunch: function() {
			//初始化完成的时候触发
			console.log('App Launch')
			plus.screen.lockOrientation('portrait-primary');
		},
		onShow: function() {
			//从前台到后台时候触发
		},
		onHide: function() {
		}
	}
</script>

<style lang="scss">
/*每个页面公共css */
@import '~@/static/style/app.scss';
</style>
