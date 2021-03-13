<template>
  <div class="home">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="采集信息"
                 left-arrow
                 @click-left="on_click_left" />

    <!-- 进度条 -->
    <div class="step-list">
      <div class="step-list-items">
        <div class="step-list-item"
             :class="{selected:step==1 && !stepOne,stepTrue: stepOne}">
          <div v-if="!stepOne"> 1</div>
          <div v-if="stepOne"> ✔ </div>

        </div>
        <div class="step-list-item-title">信息录入</div>
      </div>

      <div class="step-list-item-traverse">

      </div>
      <div class="step-list-items">
        <div class="step-list-item"
             :class="{selected:step==2 && !stepTwo,stepTrue: stepTwo}">
          <div v-if="!stepTwo"> 2</div>
          <div v-if="stepTwo"> ✔ </div>
        </div>
        <div class="step-list-item-title">人脸识别</div>
      </div>

      <div class="step-list-item-traverse">

      </div>
      <div class="step-list-items">
        <div class="step-list-item"
             :class="{selected:step==3&& !stepThree,stepTrue: stepThree}">
          <div v-if="!stepThree"> 3</div>
          <div v-if="stepThree"> ✔ </div>
        </div>
        <div class="step-list-item-title">基础信息</div>
      </div>

    </div>
    <!-- 中间部分 -->
    <!-- sept 1 信息录入-->
    <div v-if="step==1">
      <!-- 身份证上传部分 -->

      <div class="upload-idcard-list">
        <div class="upload-idcard-list-title">身份证识别</div>
        <van-uploader :after-read="after_read_card_front">

          <div class="upload-idcard-item">
            <div class="upload-idcard-img-positive"
                 :style="backgroundCard.front">
            </div>
            <div class="border-left-top"></div>
            <div class="border-right-top"></div>
            <div class="border-left-bottom"></div>
            <div class="border-right-bottom"></div>
          </div>

        </van-uploader>
      </div>

      <!-- 身份证上传部分 -->
      <div class="upload-idcard-list">
        <van-uploader :after-read="after_read_card_back">
          <div class="upload-idcard-item">
            <div class="upload-idcard-img-against"
                 :style="backgroundCard.back">
            </div>
            <div class="border-left-top"></div>
            <div class="border-right-top"></div>
            <div class="border-left-bottom"></div>
            <div class="border-right-bottom"></div>
          </div>
        </van-uploader>
      </div>
    </div>
    <!-- sept 2 人脸识别-->
    <div v-if="step==2">
      <!-- 人脸识别框 -->
      <div class="face-discern">

        <div class="face-frame">
          <Face @submit_face_url="submit_face_url"></Face>
        </div>

        <!-- 请直视手机 -->
        <div class="hint">请直视手机屏幕</div>
      </div>
    </div>

    <!-- sept 3 基础信息-->
    <div v-if="step==3">
      <!-- 基础信息 -->
      <div>
        <van-form>
          <!-- 姓名 -->
          <van-field v-model="userInfo.name"
                     required
                     name="姓名"
                     label="姓名"
                     disabled
                     placeholder="请输入姓名"
                     :rules="[{ required: true, message: '请填写用户名' }]" />
          <!-- 手机号 -->
          <van-field v-model="userInfo.phone"
                     required
                     label="手机号"
                     placeholder="请输入手机号"
                     :rules="[{ required: true, message: '请输入手机号' }]" />
          <!-- 职业名称 -->
          <van-field v-model="userInfo.position"
                     required
                     name="职业名称"
                     label="职业名称"
                     placeholder="请输入职业名称"
                     :rules="[{ required: true, message: '请填写职业名称' }]" />
        </van-form>
      </div>
    </div>

    <!-- 下一步按钮 -->
    <van-button type="info"
                v-if="step==1 || step==2"
                class="success-btn"
                @click="next_step"
                :disabled="get_next_step_disabled()">下一步</van-button>
    <van-button type="info"
                v-if="step==3"
                class="success-btn"
                :disabled="get_next_step_disabled()"
                @click="submit_user_info">完成</van-button>
  </div>
</template>

<script>
import { img_size, get_file_url } from '@/utils/imageMethod' // 引入图片处理包;
import { compressImg } from '@/utils/compressImg'
import { Toast } from 'vant'
import Face from '../../face/face'
import {
  save_by_pic_path,
  update_user_info_path,
  get_user_info_path,
  save_person_path,
} from '@/api/api'
export default {
  components: {
    Face,
  },
  data() {
    return {
      userId: this.$router.currentRoute.query.id,
      step: 1,
      stepOne: false,
      stepTwo: false,
      stepThree: false,
      userInfo: {
        id: '',
        name: '',
        phone: '',
        position: '',
      },
      image: [],
      backgroundCard: {
        front: {
          backgroundImage: '',
        },
        back: {
          backgroundImage: '',
        },
      },
      frontImage: '', // 正面照
      backImage: '', // 正面照
      frontImagePath: '', // 正面照
      backImagePath: '', // 正面照
      faceUrl: '', // 人脸识别的base64位图像
    }
  },
  watch: {},
  mounted() {},

  methods: {
    /**
     * 修改用户的接口
     */
    async update_user_info_data() {
      let param = {
        id: this.userInfo.id, //类型：String  必有字段  备注：用户id
        phone: this.userInfo.phone, //类型：String  必有字段  备注：电话
        position: this.userInfo.position, //类型：String  必有字段  备注：职位
      }
      await update_user_info_path(param)
        .then(() => {
          Toast('采集成工')
          this.$router.push({ path: '/home', query: { id: this.userInfo.id } })
        })
        .catch(() => {})
    },

    /**
     * 保存信息按钮
     */
    submit_user_info() {
      this.update_user_info_data()
    },

    /**
     * 保存人脸信息接口
     */
    async save_person_data() {
      let param = {
        id: this.userId, //类型：String  必有字段  备注：id
        image64: this.faceUrl,
      }
      await save_person_path(param)
        .then((res) => {
          console.log(res)
          // 保存人脸成功
          if (res.code == 100000) {
            this.step++
            console.log(res.message)
          } else {
            Toast('人脸识别失败，请重新录入！')
            this.step = 1
          }
        })
        .catch(() => {})
    },

    /**
     * 接收视频流中获取的
     */
    submit_face_url(data_url) {
      this.faceUrl = data_url
      this.get_next_step_disabled()
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
            this.userInfo = {
              id: res.data.id,
              name: res.data.name,
              phone: '',
              position: '',
            }
          } else if (res.code == '200002') {
            this.show_hint()
          }
        })
        .catch(() => {})
    },

    /**
     * 调用用户信息保存接口，保存身份证正反面，接口会返回用户姓名
     */
    async save_user_id_card_data() {
      let param = {
        id: this.userId,
        extraParams1: this.frontImagePath,
        extraParams2: this.backImagePath,
      }
      await save_by_pic_path(param)
        .then((res) => {
          if (res.code == 100000) {
            this.userInfo.id = res.data
            this.step++
            this.get_user_info_data(res.data)
          } else {
            Toast('身份证保存失败！')
          }
        })
        .catch(() => {})
    },
    /**
     * 保存用户信息方法
     * 身份证的正反面
     */
    submit_user_id_card() {
      Promise.all([
        this.upload_id_card_front_data(this.frontImage),
        this.upload_id_card_back_data(this.backImage),
      ])
        .then((res) => {
              
          // 使用 Promise 执行多项任务执行完成后返回一个数
          this.frontImagePath = res[0] // 正面照
          this.backImagePath = res[1] // 正面照
          this.save_user_id_card_data()
        })
        .catch((err) => {
          console.log(err)
        })
    },

    /**
     *  上传接口-反面
     */
    async upload_id_card_back_data(image) {
      if (image) {
        return new Promise(function (resolve, reject) {
          compressImg(image)
            .then((imgRes) => {
                  
              resolve(imgRes)
            })
            .catch(() => {
              console.log(reject.message)
            })
        })
      } else {
        return ''
      }
    },

    /**
     *  上传接口-正面
     */
    async upload_id_card_front_data(image) {
      if (image) {
        return new Promise(function (resolve, reject) {
          compressImg(image)
            .then((imgRes) => {
                  
              resolve(imgRes)
            })
            .catch(() => {
              console.log(reject.message)
            })
        })
      } else {
        return ''
      }
    },

    /**
     * 判断尺寸大小
     */
    before_avatar_upload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension =
        testmsg == 'jpg' ||
        testmsg == 'JPG' ||
        testmsg == 'png' ||
        testmsg == 'PNG'
      /* 限制格式：jpg、png */
      if (!extension) {
        Toast('上传文件只能是jpg或者png格式!')
        return false /* 必须加上return false; 才能阻止 */
      }
      /* 限制大小 */
      const isLt50M = file.size / 1024 / 1024 < 5
      if (!isLt50M) {
        Toast('上传文件大小不能超过 5MB!')
        return false
      }
      let isSize = img_size(file, 3000, 4000, this)
      return extension && isLt50M && isSize
    },

    /**
     * 选身份证正面片之后触发的事件
     */
    after_read_card_front(file) {
      if (this.before_avatar_upload(file.file)) {
        this.backgroundCard.front = {
          backgroundImage: 'url(' + get_file_url(file.file) + ')',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
        }
        this.frontImage = file.file // 正面照
        this.get_next_step_disabled()
      }
    },

    /**
     * 选身份证反面之后触发的事件
     */
    after_read_card_back(file) {
      if (this.before_avatar_upload(file.file)) {
        this.backgroundCard.back = {
          backgroundImage: 'url(' + get_file_url(file.file) + ')',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
        }
        this.backImage = file.file // 反面照
        let i = this.get_next_step_disabled()
        console.log(i)
      }
    },

    /**
     * 返回上一层路由
     */
    on_click_left() {
      this.$router.push({ path: '/home', query: { id: this.userId } }) // 返回上一步
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
        if (this.step == 1) {
          this.stepOne = true
              
          this.submit_user_id_card() // 调用上传用户信息的方法
        }
        if (this.step == 2) {
          this.stepOne = true
          this.stepTwo = true
          this.save_person_data() // 调用保存人脸
        }
      } else {
        this.step = 1
      }
    },

    /**
     * 获取下一步的按钮是否可点击
     */
    get_next_step_disabled() {
      if (this.step == 1) {
            
        if (this.frontImage && this.backImage) {
          return false
        } else {
          return true
        }
      } else if (this.step == 2) {
        if (this.faceUrl) {
          return false
        } else {
          return true
        }
      } else if (this.step == 3) {
        if (
          this.userInfo.id &&
          this.userInfo.name &&
          this.userInfo.phone &&
          this.userInfo.position
        ) {
          return false
        } else {
          return true
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.home {
  //   // 进度条
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
  //         width:60px;
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
  // 身份证上传部分
  .upload-idcard-list {
    .upload-idcard-list-title {
      font-size: 40px;
      margin-bottom: 50px;
      color: #000;
    }
    .upload-idcard-item {
      display: flex;
      justify-content: center;
      margin-bottom: 50px;
      padding: 50px;
      position: relative;
      .upload-idcard-img-positive {
        width: 510px;
        height: 310px;
        background-image: url(~@/assets/images/idCard-positive.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        border: 3px solid #ccc;
        border-radius: 20px;
      }
      .upload-idcard-img-against {
        width: 510px;
        height: 310px;
        background-image: url(~@/assets/images/idCard-against.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        border: 3px solid #ccc;
        border-radius: 20px;
      }
      .border-left-top {
        width: 40px;
        height: 40px;
        border-left: 10px solid #1890ff;
        border-top: 10px solid #1890ff;
        position: absolute;
        left: 50px;
        top: 0;
      }
      .border-right-top {
        width: 40px;
        height: 40px;
        border-right: 10px solid #1890ff;
        border-top: 10px solid #1890ff;
        position: absolute;
        right: 50px;
        top: 0;
      }
      .border-left-bottom {
        width: 40px;
        height: 40px;
        border-left: 10px solid #1890ff;
        border-bottom: 10px solid #1890ff;
        position: absolute;
        left: 50px;
        bottom: 0;
      }
      .border-right-bottom {
        width: 40px;
        height: 40px;
        border-right: 10px solid #1890ff;
        border-bottom: 10px solid #1890ff;
        position: absolute;
        right: 50px;
        bottom: 0;
      }
    }
  }
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
      margin: 50px 0;
      color: #ccc;
      font-size: 32px;
    }
  }
  // 完成按钮
  .success-btn {
    width: 90%;
    height: 95px;
    font-size: 30px;
    // position: fixed;
    // left: 5%;
    // bottom: 0;
    border-radius: 10px;
    margin: 0 0 50px;
  }
}
::v-deep.van-uploader {
  display: block;
  .van-uploader__wrapper {
    display: block;
  }
}
</style>
