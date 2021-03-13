/*
 * @description: 公共接口
 * @author: Jsj
 * @Compile：2021-01-20 18：00
 * @update: Jsj(2021-01-20 18：00)
 */
import service from '@/utils/request'

/**
 * 用户信息是否存在
 */

export function get_user_info_path(data) {
	return service({
		url: '/v1/web/userInfoCollection/get',
		method: 'post',
		data,
	})
}
/**
 * 用户信息修改
 */

export function update_user_info_path(data) {
	return service({
		url: '/v1/web/userInfoCollection/update',
		method: 'post',
		data,
	})
}
/**
 * 用户信息保存
 */

export function save_by_pic_path(data) {
	return service({
		url: '/v1/web/userInfoCollection/saveByPic',
		method: 'post',
		data,
	})
}
/**
 * 添加人脸
 */

export function save_person_path(data) {
	return service({
		url: '/v1/web/userInfoCollection/savePerson',
		method: 'post',
		data,
	})
}
/**
 * 搜索人员
 */

export function search_person_path(data) {
	return service({
		url: '/v1/web/userInfoCollection/searchPerson',
		method: 'post',
		data,
	})
}
/**
 * 上传图片
 */

export function upload_image_path(data) {
	return service({
		url: '/file/uploadImage',
		method: 'post',
		data,
	})
}

/**
 * 签到
 */

export function log_signin_path(data) {
	return service({
		url: '/v1/web/logSignin/save',
		method: 'post',
		data,
	})
}
/**
 * 签到状态
 */

export function log_signin_history_path(data) {
	return service({
		url: '/v1/web/logSignin/signin',
		method: 'get',
		data,
	})
}
/**
 * 查询列表
 */

export function get_log_signin_path(data) {
	return service({
		url: '/v1/web/logSignin/getList',
		method: 'post',
		data,
	})
}

/**
 * 用户可签到的地点
*/
export function clock_coordinates_user_list(data) {
	return service({
		url: '/v1/web/clockCoordinatesUser/getUserData',
		method: 'post',
		data,
	})
}