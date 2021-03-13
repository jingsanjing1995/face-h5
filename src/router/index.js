import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import SignIn from '../views/signIn/signIn.vue' // 签到页面
import map from '../views/signIn/map.vue' // 签到页面
import UserInfo from '../views/user/userInfo/userInfo.vue' // 用户详情
import EditUserInfo from '../views/user/userInfo/editUserInfo.vue' // 用户详情
import GatherInfo from '../views/user/gatherInfo/gatherInfo.vue' // 用户详情
import face from '../views/face/face.vue' // 用户详情

Vue.use(VueRouter)

const routes = [
	{
		path: '/map',
		name: 'map',
		component: map,
		meta: {
			title: '地图',
		},
	},
	{
		path: '/face',
		name: 'face',
		component: face,
		meta: {
			title: '人脸',
		},
	},
	{
		path: '/home',
		name: 'Home',
		component: Home,
		meta: {
			title: '首页',
			keepAlive: true,
		},
	},
	{
		path: '/signIn',
		name: 'SignIn',
		component: SignIn,
		meta: {
			title: '签到',
		},
	},
	{
		path: '/userInfo',
		name: 'userInfo',
		component: UserInfo,
		meta: {
			title: '个人资料',
		},
	},
	{
		path: '/editUserInfo',
		name: 'EditUserInfo',
		component: EditUserInfo,
		meta: {
			title: '修改资料',
		},
	},
	{
		path: '/gatherInfo',
		name: 'gatherInfo',
		component: GatherInfo,
		meta: {
			title: '采集信息',
		},
	},
]

const router = new VueRouter({
	mode: 'history', // require service support
	routes,
})

export default router
