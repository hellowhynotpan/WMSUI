<script>
	export default {
		onLaunch: function() {
			var self = this;
			uni.getSystemInfo({
				success: function(res) {
					self.platform = res.platform;
				}
			});
			plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
				version = wgtinfo.version
			})
			var data = {
				version: plus.runtime.version,
				os: this.platform
			};
			if (data.os == 'android') {
				this.$u.api.AutoUpdApk(data)
					.then(resp => {
						if (resp.code == 200) {
							uni.showModal({
								title: "检测到有新版本！",
								content: "请升级app到最新版本！",
								showCancel: true,
								confirmText: "立即升级",
								cancelText: "暂不升级",
								success: res => {
									if (!res.confirm) {
										console.log('取消了升级');
										return;
									} else {
										/* plus.runtime.openURL(resp.data);  */
										var downloadApkUrl = resp.data;
										console.log(downloadApkUrl)
										var dtask = plus.downloader.createDownload(downloadApkUrl, {},
											function(d, status) {
												console.log(downloadApkUrl);
												// 下载完成  
												if (status == 200) {
													plus.runtime.install(plus.io
														.convertLocalFileSystemURL(d
															.filename), {}, {},
														function(error) {
															uni.showToast({
																title: '安装失败',
																duration: 1500
															});
														})
												} else {
													uni.showToast({
														title: '更新失败',
														duration: 1500
													});
												}
											});
										dtask.start();
										var prg = 0;
										var showLoading = plus.nativeUI.showWaiting("正在下载");
										dtask.addEventListener('statechanged', function(task,
										status) { //添加下载任务事件监听器
											// 给下载任务设置一个监听 并根据状态 做操作
											switch (task.state) {
												case 1:
													showLoading.setTitle("正在下载");
													break;
												case 2:
													showLoading.setTitle("已连接到服务器");
													break;
												case 3:
													prg = parseInt( //下载的进度
														(parseFloat(task.downloadedSize) /
															parseFloat(task.totalSize)) *
														100
													);
													showLoading.setTitle("版本更新,正在下载" + prg +
														"% ");
													break;
												case 4:
													plus.nativeUI.closeWaiting(); //关闭系统提示框
													//下载完成
													break;
											}
										});
									}
								}
							})
						}
					})
					.catch(err => {
						this.$u.toast('出错，请稍后再试');
					});
			}
			plus.screen.lockOrientation('portrait-primary');
		},
		onShow: function() {
			//从前台到后台时候触发
		},
		onHide: function() {}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '~@/static/style/app.scss';
	@import 'uni.scss'
</style>
