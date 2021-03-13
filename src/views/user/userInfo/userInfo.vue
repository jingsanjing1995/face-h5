<template>
  <div class="home">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="个人资料"
                 right-text="修改资料"
                 left-arrow
                 @click-left="on_click_left"
                 @click-right="on_click_right" />
    <!-- 信息显示部分 -->
    <div class="user-info"
         v-if="step==1">
      <!-- 信息显示姓名 -->
      <div class="user-info-name">
        <div class="user-info-name-attribute">姓名</div>
        <div class="user-info-name-value">{{userInfo.name}}</div>
      </div>
      <!-- 信息显示 手机号 -->
      <div class="user-info-name">
        <div class="user-info-name-attribute">手机号</div>
        <div class="user-info-name-value">{{userInfo.phone}}</div>
      </div>
      <!-- 信息显示 职位名称 -->
      <div class="user-info-name">
        <div class="user-info-name-attribute">职位名称</div>
        <div class="user-info-name-value">{{userInfo.position}}</div>
      </div>
      <!-- 信息显示职位身份证照片 -->
      <div class="user-info-idcard">
        <div class="user-info-idcard-attribute">身份证</div>
        <div class="user-info-idcard-img">
          <img :src="userInfo.idcardFront"
               alt="">
        </div>
        <div class="user-info-idcard-img">
          <img :src="userInfo.idcardBack"
               alt="">
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { Dialog } from 'vant'
import { Toast } from 'vant'
import { get_user_info_path } from '@/api/api'
export default {
  components: {},
  data() {
    return {
      userId: this.$router.currentRoute.query.id,
      userInfo: {
        id: '', //类型：String  必有字段  备注：无
        address: '', //类型：String  必有字段  备注：住址
        name: '', //类型：String  必有字段  备注：姓名
        authority: '', //类型：String  必有字段  备注：发证机构
        updateOperatorID: '', //类型：Mixed  必有字段  备注：无
        position: '', //类型：String  必有字段  备注：职位
        sex: '', //类型：String  必有字段  备注：性别
        createTime: '', //类型：Number  必有字段  备注：无
        updateTime: '', //类型：Number  必有字段  备注：无
        memo: '', //类型：Mixed  必有字段  备注：无
        deleteTime: '', //类型：Mixed  必有字段  备注：无
        isDelete: '', //类型：Number  必有字段  备注：无
        birth: '', //类型：String  必有字段  备注：出生日期
        extraParams2: '', //类型：Mixed  必有字段  备注：无
        idNum: '', //类型：String  必有字段  备注：身份证号
        phone: '', //类型：String  必有字段  备注：电话
        nation: '', //类型：String  必有字段  备注：民族
        idcardBack: '', //类型：String  必有字段  备注：身份证背面照
        extraParams1: '', //类型：Mixed  必有字段  备注：无
        validDate: '', //类型：String  必有字段  备注：有效期
        idcardFront: '', //类型：String  必有字段  备注：身份证正面照
        extraParams3: '', //类型：String  必有字段  备注：腾讯云人员库中的人员id
        createOperatorID: '', //类型：Mixed  必有字段  备注：无
        updateOperatorName: '', //类型：Mixed  必有字段  备注：无
        deleteOperatorID: '', //类型：Mixed  必有字段  备注：无
        createOperatorName: '', //类型：Mixed  必有字段  备注：无
        deleteOperatorName: '', //类型：Mixed  必有字段  备注：无
      },
      step: 0, // 步骤的数， 0 当前刚进入此页面 1 显示用户详情 2 修改用户信息
    }
  },
  mounted() {
    debugger
    this.to_load(this.userId) // 进入此页面进行加载
  },
  methods: {
    /**
     * 返回上一层路由
     */
    on_click_left() {
      this.$router.go(-1) // 返回上一步
    },
    /**
     * 修改资料
     */
    on_click_right() {
      Toast('修改资料')

      this.$router.push({ path: '/editUserInfo', query: { id: this.userId } })
    },
    /**
     *显示弹窗
     */
    show_hint() {
      Dialog.alert({
        title: '请完善个人信息',
        message: '系统需要采集您的，用身份证信息、人脸信息、基础信息',
      }).then(() => {
        this.$router.push({ path: '/gatherInfo', query: { id: this.userId } })
      })
    },

    
    /**
     * 请求用户详情接口
     */
    async get_user_info_data(userId) {
      let param = {
        id: userId,
      }
      await get_user_info_path(param)
        .then((res) => {
          if (res.code == '100000') {
            let newObj = JSON.parse(JSON.stringify(res.data))
            this.userInfo = newObj
            debugger
            this.step = 1 // 当前步骤为 1 显示用户详情
          } else if (res.code == '200002') {
            this.show_hint()
          }
        })
        .catch(() => {})
    },
    /**
     * 进入此页面就进此方法进行加载
     */
    to_load(userId) {
      if (userId) {
        debugger
        this.get_user_info_data(userId)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.home {
  // 导航栏
  .van-nav-bar {
    height: 100px;
    z-index: 100;
    .van-nav-bar__title {
      font-size: 32px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #333333;
      line-height: 45px;
    }
  }

  .van-nav-bar__left {
    .van-icon-arrow-left {
      font-size: 40px;
      color: rgba(51, 51, 51, 1);
    }
  }
  //
  .user-info {
    .user-info-name {
      height: 92px;
      padding-left: 36px;
      line-height: 92px;
      border-bottom: 1px solid #ccc;
      display: flex;
      font-size: 30px;
      .user-info-name-attribute {
        width: 25%;
        text-align: left;
        color: #000;
      }
      .user-info-name-value {
        width: 70%;
        text-align: left;
        color: #ccc;
      }
    }
    .user-info-idcard {
      height: 92px;
      padding-left: 36px;
      line-height: 92px;
      font-size: 30px;
      .user-info-idcard-attribute {
        width: 25%;
        text-align: left;
        color: #000;
      }
      .user-info-idcard-img {
        // text-align: left;
        margin-bottom: 40px;
        img {
          width: 498px;
          height: 312px;
        }
      }
    }
  }
  .button {
    width: 660px;
    height: 95px;
    font-size: 30px;

    border-radius: 45px;
  }
}
</style>
