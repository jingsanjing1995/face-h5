import router from '@/router'

import getPageTitle from '@/utils/get-page-title.js'

router.beforeEach(async (to, from, next) => {
	// 设置页面标题
	document.title = getPageTitle(to.meta.title)

	if (to.path === '/') {
        let id = to.query.id
		// 已经登录，跳转到首页
		next({ path: '/home',query:{id:id} })
	} else {
		// 获取用户信息
		next()
	}
})
