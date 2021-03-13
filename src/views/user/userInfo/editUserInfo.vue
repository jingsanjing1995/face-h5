<template>
  <div class="home">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="修改资料"
                 left-arrow
                 @click-left="on_click_left" />

    <!-- 信息编辑显示部分 -->
    <div class="redact-user-info">
      <van-form @submit="onSubmit">
        <van-field v-model="userInfo.phone"
                   name="电话"
                   label="电话"
                   placeholder="电话"
                   :rules="[{ required: true, message: '请填写电话' }]" />
        <van-field v-model="userInfo.position"
                   name="职位"
                   label="职位"
                   placeholder="职位"
                   :rules="[{ required: true, message: '请填写职位' }]" />
        <div style="margin: 16px;">
          <van-button round
                      block
                      type="info"
                      native-type="submit"
                      class="success-btn">提交</van-button>

        </div>
      </van-form>
    </div>

  </div>
</template>

<script>
import { Toast } from 'vant'
import { get_user_info_path, update_user_info_path } from '@/api/api'
export default {
  components: {},
  data() {
    return {
      userId: this.$router.currentRoute.query.id,
      userInfo: {
        id: '', //类型：String  必有字段  备注：无
        phone: '', //类型：String  必有字段  备注：电话
        position: '', //类型：String  必有字段  备注：职位
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
     * 修改接口
     */
    async update_user_info_data() {
      let param = {
        id: this.userInfo.id, //类型：String  必有字段  备注：用户id
        phone: this.userInfo.phone, //类型：String  必有字段  备注：电话
        position: this.userInfo.position, //类型：String  必有字段  备注：职位
      }
      await update_user_info_path(param)
        .then((res) => {
          // 修改成功
          Toast(res.message)
          this.$router.go(-1)
        })
        .catch((err) => {
          // 修改失败
          Toast(err.message)
        })
    },
    /**
     * 提交修改
     */
    onSubmit() {
      console.log('zoule ')
      this.update_user_info_data()
    },
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
      this.step = 2 // 步骤2
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
            debugger
            this.userInfo = {
              id: res.data.id, //类型：String  必有字段  备注：无
              phone: res.data.phone, //类型：String  必有字段  备注：姓名
              position: res.data.position, //类型：String  必有字段  备注：职位
            }
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
.van-form{
    margin-top:50px
}
.van-cell{
    line-height:90x;
}
.van-field__label{
    line-height: 50px;
}
  .van-nav-bar__left {
    .van-icon-arrow-left {
      font-size: 40px;
      color: rgba(51, 51, 51, 1);
    }
  }

  // 完成按钮
  .success-btn {
    width: 100%;
    height: 95px;
    font-size: 30px;
    // position: fixed;
    // left: 45px;
    // bottom: 130px;
    border-radius: 10px;
  }
}
</style>
