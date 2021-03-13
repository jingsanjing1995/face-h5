import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAwesomeSwiper from 'vue-awesome-swiper'
// import VueSocketIO from 'vue-socket.io'
import '@/assets/styles/css/reset.css'
import '@/assets/styles/css/border.css'
import '@/assets/js/rem.js' 
import '@/utils/permission.js' // 导航守卫
import '@/assets/styles/css/common.scss' // 公共样式
import 'swiper/css/swiper.min.css' // 轮播组件
import '@/assets/fonts/fonts.css' // 字体库 
import '@/assets/styles/css/iconfont.css' // icon库
import '@/assets/js/iconfont.js' // icon库
import AMap from 'vue-amap'
// import VConsole from 'vconsole'
// const vConsole = new VConsole()
// Vue.use(vConsole)
AMap.initAMapApiLoader({
	key: 'abeefcfd7f895607cf6f85baeac5d8a0', // 自己到官网申请
	plugin: [
		'AMap',
		'AMap.Autocomplete',
		'AMap.PlaceSearch',
		'AMap.Scale',
		'AMap.OverView',
		'AMap.ToolBar',
		'AMap.MapType',
		'AMap.PolyEditor',
		'AMap.CircleEditor',
		'AMap.Geolocation',
		'Geocoder',
	], //plugin所要用到的模块功能，按需添加
	v: '1.4.4', //高德 sdk 版本为 1.4.4
})
Vue.use(AMap)
// import { mockXHR } from '../mock';
import {
	Button,
	Tab,
	Tabs,
	Tabbar,
	TabbarItem,
	Toast,
	Notify,
	Swipe,
	SwipeItem,
	Lazyload,
	Grid,
	GridItem,
	Icon,
	Sticky,
	Collapse,
	CollapseItem,
	Progress,
	NavBar,
	Uploader,
	ActionSheet,
	DatetimePicker,
	Popup,
	Field,
	Switch,
	CountDown,
	Dialog,
	Loading,
	ShareSheet,
	Overlay,
	SwipeCell,
	DropdownMenu,
	DropdownItem,
	Divider,
	Search,
	Empty,
	List,
	Form,
} from 'vant'

Vue.use(Button)
	.use(Tab)
	.use(Tabs)
	.use(Tabbar)
	.use(TabbarItem)
	.use(Toast)
	.use(Notify)
	.use(Swipe)
	.use(SwipeItem)
	.use(Lazyload, {
		lazyComponent: true,
		loading: require('@/assets/images/loading.gif'),
	})
	.use(VueAwesomeSwiper)
	.use(Grid)
	.use(GridItem)
	.use(Icon)
	.use(Sticky)
	.use(Collapse)
	.use(CollapseItem)
	.use(Progress)
	.use(NavBar)
	.use(Uploader)
	.use(ActionSheet)
	.use(DatetimePicker)
	.use(Popup)
	.use(Field)
	.use(Switch)
	.use(CountDown)
	.use(Dialog)
	.use(Loading)
	.use(ShareSheet)
	.use(Overlay)
	.use(SwipeCell)
	.use(DropdownMenu)
	.use(DropdownItem)
	.use(Divider)
	.use(Search)
	.use(Empty)
	.use(List)
	.use(Form)
console.log(process.env)
// if (process.env.NODE_ENV === "development") {
// mockXHR()
// }

// if (process.env.NODE_ENV === 'development') {
//     const VConsole = require('vconsole')
//         // eslint-disable-next-line
//     const my_console = new VConsole()
// }
// Vue.use(new VueSocketIO({
//     debug: true,
//     connection: 'https://www.holiday.shunbokj.cn',
//     vuex: {
//         store,
//         actionPrefix: 'SOCKET_',
//         mutationPrefix: 'SOCKET_'
//     },
//     options: { path: "/web/v1/user/getInfo" } //Optional options
// }))

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount('#app')
