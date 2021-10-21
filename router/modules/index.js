//这个文件主要作用是将所有路由整合成一个数组
const files = require.context('.', false, /\.js$/)
const modules = []

files.keys().forEach(key => {
	if (key === './index.js') return
	const item = files(key).default
	modules.push(...item)
})

export default modules
