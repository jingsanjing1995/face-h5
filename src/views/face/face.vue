<template>
  <div class="home">
    <video id="video"
           preload
           autoplay
           loop
           playsinline
           webkit-playsinline="true"
           muted></video>
    <canvas id="canvas">
    </canvas>
  </div>
</template>
<script>
require('./tracking-min.js')
require('./face-min.js')
require('./mouth-min.js')
require('./stats.min.js')
export default {
  name: 'face',
  data() {
    return {
      videoEle: null,
      trackerTask: null,
      first: null,
      canvasWidth: 500,
      canvasHeight: 500,
    }
  },
  created() {},
  mounted() {
       
    this.openCamera()
  },
  methods: {
    onClickLeft() {},
    openCamera() {
         
      console.log('')
      var video = (this.videoEle = document.getElementById('video'))
      var canvas = document.getElementById('canvas')
      var context = canvas.getContext('2d')
      // eslint-disable-next-line no-undef
      var tracker = new tracking.ObjectTracker('face') // 引入第三方 库
      tracker.setInitialScale(1)
      tracker.setStepSize(2)
      tracker.setEdgesDensity(0.1)
      // eslint-disable-next-line no-undef
      this.trackerTask = tracking.track('#video', tracker, { camera: true })
      //-------  指定 canvas 的宽高 ，auto 自动播放
      let constraints = {
        video: { width: 500, height: 500 ,'facingMode': "user" },
        audio: false,
      }
      let promise = navigator.mediaDevices.getUserMedia(constraints) // h5 新的API
      promise
        .then(function (MediaStream) {
          video.srcObject = MediaStream
          video.play()
        })
        .catch(function (PermissionDeniedError) {
          console.log(PermissionDeniedError)
        })
      //--------------
      let that = this
      that.tracker_fun(tracker, video, context, canvas) //open 摄像头，执行tracker_fun( 传入参数 )
    },
    tracker_fun(tracker, video, context, canvas) {
      let that = this
      let set_clear
      set_clear = setTimeout(function () {
        // 每秒 检测人脸 结果
        tracker.on('track', function (event) {
          // 视频流
          // context.clearRect(0, 0, canvas.width, canvas.height);
          if (!that.first) {
            // if  --- > else  检测到人脸 success() =>{}
            event.data.forEach(function (rect) {
              if (rect.x) {
                that.first = rect.x
                video.pause() // success  将暂停 video
                console.log(rect)
                console.log(video)
                context.drawImage(video, 0, 0, 300, 150) // 绘制到 canvas
                context.font = '11px Helvetica'
                context.fillText('', 100, 40)
                context.strokeStyle = '#a64ceb'
                context.strokeRect(rect.x, rect.y, rect.width, rect.height)
                var data_url = canvas.toDataURL('image/png') //base64 request
                that.$emit('submit_face_url', data_url)
                that.destroyed()
              }
            })
          }
        })
        clearTimeout(set_clear)

        console.log('关闭摄像头')
      }, 5000)
    },
    destroyed() {
      console.log('关闭摄像头ing')
      // 停止侦测F
      this.trackerTask.stop()
      // 关闭摄像头
      this.videoEle.srcObject.getTracks()[0].stop()
    },
  },
}
</script>
<style lang="scss" scoped>
.home {
  position: relative;
  #video {
    width: 500px;
    height: 500px;
    border-radius:50%;
    padding: 0;
    margin: 0;
    object-fit: fill;
     
  }
  #canvas {
    position: absolute;
    top:0;
    left:0;
    height: 100%;
    width: 100%;
    border-radius: 50%;
    margin: 0;
    padding: 0;
    display: block;
    border: 10px solid #1890ff;
  }
}
</style>