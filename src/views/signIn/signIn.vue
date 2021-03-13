<template>
  <div class="home">
    <van-nav-bar title="人脸识别"
                 left-arrow
                 @click-left="onClickLeft" />
    <!-- 进度条 -->
    <div class="step-list">
      <div class="step-list-items">
        <div class="step-list-item"
             :class="{selected:step==1 && !stepOne,stepTrue: stepOne}">
          <div v-if="!stepOne"> 1</div>
          <div v-if="stepOne"> ✔ </div>

        </div>
        <div class="step-list-item-title">人脸识别</div>
      </div>

      <div class="step-list-item-traverse">

      </div>
      <div class="step-list-items">
        <div class="step-list-item"
             :class="{selected:step==2 && !stepTwo,stepTrue: stepTwo}">
          <div v-if="!stepTwo"> 2</div>
          <div v-if="stepTwo"> ✔ </div>
        </div>
        <div class="step-list-item-title">
          签到位置
        </div>
      </div>

      <div class="step-list-item-traverse">

      </div>
      <div class="step-list-items">
        <div class="step-list-item"
             :class="{selected:step==3&& !stepThree,stepTrue: stepThree}">
          <div v-if="!stepThree"> 3</div>
          <div v-if="stepThree"> ✔ </div>
        </div>
        <div class="step-list-item-title">签到结果</div>
      </div>

    </div>
    <!-- 人脸识别框 -->
    <div class="face-discern"
         v-if="step==1">
      <div class="face-frame">
        <Face @submit_face_url="submit_face_url"></Face>
      </div>
      <!-- 请直视手机 -->
      <div class="hint">请直视手机屏幕</div>
    </div>

    <!-- 地图定位签到 -->
    <div class="map-sign"
         v-if="step==2">
      <div class="map"
           id="map">
        <Map @sign_in="sign_in"
             @sign_in_position="sign_in_position"
             @sign_in_state="sign_in_state"
             :signInList="signInList"></Map>
      </div>
      <div type="info"
           :class="{'singinDisabled':disabled,'singin-btn':!disabled}"
           @click="singin_btn">
        <div class="singin-btn-title-succeed"
             v-if="!disabled">确认签到</div>
        <div class="singin-btn-title-lose"
             v-if="disabled">无法签到</div>
        <div class="singin-btn-time"> {{ sday }} </div>

      </div>
    </div>
    <van-overlay :show="loadState">
      <div class="wrapper">

        <van-loading type="spinner" />
      </div>

    </van-overlay>
    <!-- 签到成功 -->
    <div class="sign-success"
         v-if="step==3">
      <!-- 签到成功的图标 -->
      <div class="success-icon">
        <div class="success-ico-content">
          ✔
        </div>
      </div>
      <!-- 签到成功提示 -->
      <div class="success-title">
        签到成功
      </div>
      <!-- 签到成功内容 -->
      <div class="success-memo">

      </div>
      <!-- 完成button -->

      <van-button type="info"
                  class="success-btn"
                  @click="sing_in_success">完成</van-button>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import Face from '../face/face'
import Map from './map'
import {
  search_person_path,
  log_signin_path,
  clock_coordinates_user_list,
} from '@/api/api'
import { Toast } from 'vant'
//创建一个函数来增加月日时小于10在前面加0
var padaDate = function (value) {
  return value < 10 ? '0' + value : value
}
export default {
  name: 'Home',
  components: {
    Face,
    Map,
  },
  data() {
    return {
      date: new Date(), //实时时间
      timeId: '',
      sday: '',
      userId: this.$router.currentRoute.query.id,
      extraParams3: this.$router.currentRoute.query.extraParams3,
      step: 1,
      stepOne: false,
      stepTwo: false,
      stepThree: false,
      faceUrl: '', // 人脸识别的base64位的
      disabled: true, // 是否可点击签到按钮
      loadState: false, // 定位中的懒加载
      time: '2021-02-27 13:26', // 当前时间
      signInList: [],
      userPosition: {
        lat: '',
        lng: '',
      },
    }
  },
  filters: {
    //设置一个函数来进行过滤
    formaDate: function () {
      //创建一个时间日期对象
      var date = new Date()
      var year = date.getFullYear() //存储年
      var month = padaDate(date.getMonth() + 1) //存储月份
      var day = padaDate(date.getDate()) //存储日期
      var hours = padaDate(date.getHours()) //存储时
      var minutes = padaDate(date.getMinutes()) //存储分
      var seconds = padaDate(date.getSeconds()) //存储秒
      //返回格式化后的日期
      return (
        year +
        '/' +
        month +
        '/' +
        day +
        ' ' +
        hours +
        ':' +
        minutes +
        ':' +
        seconds
      )
    },
  },
  mounted() {
    this.to_load()
  },
  methods: {
    /**
     * 签到成功
     */
    sing_in_success() {
      this.$router.push({ path: '/home', query: { id: this.userId } })
    },

    /**
     *  签到接口
     */
    async log_signin_data() {
      let param = {
        longitude: this.userPosition.lng, //类型：String  必有字段  备注：经度
        latitude: this.userPosition.lat, //类型：String  必有字段  备注：纬度
        createOperatorID: this.userId, //类型：String  必有字段  备注：用户id
      }
      const { code: res } = await log_signin_path(param)
      return res
    },
    /**
     * 点击签到
     */
    singin_btn() {
      if (!this.disabled) {
        this.log_signin_data()
          .then((res) => {
            if (res == 100000) {
              Toast('签到成功！')
              this.next_step()
            } else if (res == 300006) {
              Toast('用户已签到')
            } else {
              Toast('签到失败!')
            }
          })
          .catch(() => {})
      } else {
        Toast('当前状态不可签到')
      }
    },

    /**
     * 用户定位且在签到范围内之后
     */
    sign_in_position(position) {
      this.userPosition = {
        lat: position.lat,
        lng: position.lng,
      }
    },

    /**
     * 用户定位之后
     * 关闭遮罩层
     */
    sign_in_state(state) {
      this.loadState = state
    },

    /**
     * 地图签到版块儿
     * 子传父可以签到
     */
    sign_in(sign_in) {
      this.disabled = sign_in
    },
    /**
     * 搜索人员的接口
     * 需要传递两个参数一个是id，一个是人脸的base64
     */
    async search_person_data() {
      let param = {
        id: this.userId,
        image64: this.faceUrl,
      }
      await search_person_path(param)
        .then((res) => {
          console.log('人脸识别成功')
          console.log(res)
          if (res.code == 100000) {
            this.next_step() // 下一步
          } else {
            Toast('人脸识别失败！')
          }
        })
        .catch(() => {})
    },

    /**
     * 子传父 人脸识别成功
     * 调用搜索人员的接口
     */
    submit_face_url(data_url) {
      this.faceUrl = data_url // 将base64位的人脸保存到本地
      this.search_person_data() // 调用搜索人员的接口查询这个人是否是本人
    },
    /**
     * 返回上一层路由
     */
    onClickLeft() {
      this.$router.go(-1) // 返回上一步
    },
    /**
     * 点击步骤1
     */
    step_one() {
      this.step = 1
    },

    /**
     * 点击步骤2
     */
    step_two() {
      this.step = 2
    },

    /**
     * 点击步骤3
     */
    step_three() {
      this.step = 3
    },

    /**
     * 下一步
     */
    next_step() {
      if (this.step < 3) {
        this.step++
        if (this.step == 2) {
          let a = document.body.clientHeight
          let map = document.getElementById('map')
          map.style.height = a + 'px'
          console.log('mapA的高度', a)
          this.stepOne = true
          this.loadState = true
        }
        if (this.step == 3) {
          this.stepOne = true
          this.stepTwo = true
          this.loadState = false
        }
      } else {
        this.step = 1
      }
    },

    /**
     * 请求用户签到类表
     */
    async get_user_sign_adress_list(createOperatorID) {
      let param = {
        createOperatorID: createOperatorID,
      }
      await clock_coordinates_user_list(param)
        .then((res) => {
          let signInArry = res.data

          for (let i in signInArry) {
            this.$set(this.signInList, i, signInArry[i])
          }

          console.log('签到地点', this.signInList)
        })
        .catch(() => {})
    },

    /**
     * 进入此页面进行加载
     */
    to_load() {
      //创建定时器更新最新的时间
      var _this = this
      this.timeId = setInterval(function () {
        _this.sday = dayjs().format('YYYY-MM-DD HH:mm:ss')
      }, 1000)

      _this.get_user_sign_adress_list(_this.extraParams3)
    },
  },
  beforeDestroy: function () {
    //实例销毁前青出于定时器
    if (this.timeId) {
      clearInterval(this.timeId)
    }
  },
}
</script>

<style lang="scss" scoped>
.home {
  // 顶部标题
  .top-title {
    padding-top: 80px;
    font-size: 25px;
    font-weight: 700;
  }
  // 进度条
  //   .step-list {
  //     padding: 0 50px;
  //     margin-top:50px;
  //     margin-bottom: 50px;
  //     display: flex;
  //     justify-content: space-between;
  //     // 连接处横线
  //     .step-list-item-traverse {
  //       width: 100px;
  //       border-top: 1px solid #ccc;
  //       margin-top: 20px;
  //     }
  //     .step-list-items {
  //       display: flex;
  //       flex-direction: column;
  //       align-items: center;
  //       .step-list-item {
  //          width:60px;
  //         height: 60px;
  //         border: 1px solid #ccc;
  //         border-radius: 50%;
  //         text-align: center;
  //         line-height: 60px;
  //         color: #ccc;
  //       }
  //       .selected {
  //         background-color: #1890ff;
  //         color: #fff;
  //       }
  //       .stepTrue {
  //         border: 1px solid #1890ff;
  //         color: #1890ff;
  //         background-color: '';
  //       }
  //       .step-list-item-title {
  //         margin-top: 20px;
  //       }
  //     }
  //   }
  // 人脸识别框
  .face-discern {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    .face-frame {
      width: 500px;
      height: 500px;
      //   border: 10px solid #1890ff;
      border-radius: 50%;
      overflow: hidden;
      -webkit-backface-visibility: hidden;
      -webkit-transform: translate3d(0, 0, 0);
      display: flex;
    }
    // 提示
    .hint {
      margin-top: 20px;
      color: #ccc;
    }
  }
  // 识别成功
  .sign-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 200px 0 0;
    padding: 0 50px;
    .success-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 220px;
      height: 220px;
      background-color: #b0d6fa;
      border-radius: 50%;
      .success-ico-content {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 140px;
        height: 140px;
        background-color: #1890ff;
        border-radius: 50%;
        color: #fff;
        font-size: 50px;
      }
    }
    .success-title {
      margin-top: 40px;
      font-size: 40px;
    }
    .success-btn {
      width: 660px;
      height: 95px;
      font-size: 30px;
      //   position: fixed;
      //   left: 45px;
      //   bottom: 130px;
      border-radius: 10px;
      margin-top: 200px;
    }
  }

  // 地图部分
  .map-sign {
    width: 100%;

    background-color: #ccc;
    .map {
      width: 100%;
    }
    .singin-btn {
      width: 250px;
      height: 250px;
      border-radius: 50%;
      background-color: #1890ff;
      position: fixed;
      left: 50%;
      margin-left: -125px;
      bottom: 150px;
      text-align: center;
      font-size: 40px;
      font-weight: 700;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .singinDisabled {
      width: 250px;
      height: 250px;
      border-radius: 50%;
      background-color: #8a8c8d;
      position: fixed;
      left: 50%;
      margin-left: -125px;
      bottom: 150px;
      text-align: center;
      font-size: 40px;
      font-weight: 700;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .singin-btn-title-succeed {
      height: 50px;
      color: rgb(15, 15, 15);
    }
    .singin-btn-title-lose {
      height: 50px;
      color: rgb(248, 4, 4);
    }
    .singin-btn-time {
      height: 50px;
      line-height: 50px;
      font-size: 20px;
      color: #fff;
    }
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 25px;
    color: #fff;
  }
}
</style>
