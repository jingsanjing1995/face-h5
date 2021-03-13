<template>
  <div class="home">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="首页" />
    <!-- banner块 -->
    <div class="swipes">
      <van-swipe class="my-swipe"
                 :autoplay="3000"
                 indicator-color="white">
        <van-swipe-item>
          <img src="../assets/images/banner.jpg"
               alt="">
        </van-swipe-item>

      </van-swipe>
    </div>

    <!-- 功能块 -->
    <div class="capacity">
      <!-- 个人资料 -->
      <div class="capacity-items-me"
           @click="go_user_info">
        <!-- <div class="capacity-items-img">
          <img src="https://img01.yzcdn.cn/vant/cat.jpeg" />
        </div> -->
        <div class="capacity-items-title">个人资料</div>
      </div>
      <!-- 场地签到  class="capacity-items"-->
      <div class="capacity-items-me"
           @click="go_sign_in">
        <div class="capacity-items-title">场地签到</div>
        <!-- <div class="capacity-items-img">
          <img width="100"
               height="100"
               src="https://img01.yzcdn.cn/vant/cat.jpeg" />
        </div> -->
      </div>
    </div>

  </div>
</template>

<script>
import { Toast } from 'vant'
import { log_signin_history_path, get_user_info_path } from '@/api/api'

export default {
  components: {},
  data() {
    return {
      id: this.$router.currentRoute.query.id,
      extraParams3:"",
      userInfoState: false,
    }
  },
  mounted() {
    this.to_load(this.id)
  },
  methods: {
    onClickLeft() {
      Toast('返回')
    },
    onClickRight() {
      Toast('按钮')
    },
    /**
     * 去往个人详情页面
     */
    go_user_info() {
        
      console.log(this.id)
      this.$router.push({ path: '/userInfo', query: { id: this.id } })
    },

    /**
     *  查询是否签过到
     */
    async log_signin_history_data() {
        
      let param = {
        userId: this.id,
      }
      let { code: res } = await log_signin_history_path(param)
        
      return res
    },

    /**
     * 去往签到页面
     */
    go_sign_in() {
        
    
      if (this.userInfoState) {
        this.$router.push({ path: '/signIn', query: { id: this.id,extraParams3: this.extraParams3 } })
      } else {
        Toast('请先完善个人信息！')
      }
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
              this.extraParams3=res.data.extraParams3
            this.userInfoState = true // 不可进入签到页面
          } else if (res.code == '200002') {
            Toast('请先完善个人信息！')
          }
        })
        .catch(() => {})
    },
    /**
     * 进入此页面就进此方法进行加载
     */
    to_load(userId) {
      if (userId) {
          
        this.get_user_info_data(userId)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.home {
  background-color: rgb(248, 248, 248);
  width: 100%; 
  // 顶部标题
  .top-title {
    padding-top: 80px;
    font-size: 25px;
    font-weight: 700;
  }
}
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
// 轮播图
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 420px;
  text-align: center;
  background-color: #39a9ed;
  img {
    width: 100%;
  }
}
// 功能区
.capacity {
  padding: 16px 26px;
  display: flex;
  justify-content: space-around;

  .capacity-items-me {
    width: 332px;
    height: 242px;
    background-color: #fff;
    border-radius: 15px;
    box-shadow: rgba(231, 231, 231, 0.8) 0px 0px 10px 5px; //边框阴影
    display: flex;
    justify-content: space-around;
    align-items: center;
    .capacity-items-img {
      border-radius: 5px;
      img {
        width: 156px;
        height: 156px;
        border-radius: 5px;
      }
    }
    .capacity-items-title {
      display: flex;
      align-items: center;
      font-size: 36px;
      font-weight: 600;
    }
  }
  .capacity-items {
    width: 332px;
    height: 242px;
    background-color: #fff;
    border-radius: 15px;
    box-shadow: rgba(231, 231, 231, 0.8) 0px 0px 10px 5px; //边框阴影
    display: flex;
    flex-direction: column;
    align-items: center;
    .capacity-items-title {
      display: flex;
      align-items: center;
      margin-top: 28px;
      font-size: 36px;
      font-weight: 600;
    }
    .capacity-items-img {
      margin-top: 55px;

      img {
        width: 270px;
        height: 114px;
        border-radius: 5px;
      }
    }
  }
}
</style>
