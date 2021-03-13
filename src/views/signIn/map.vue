<template>
  <div>
    <div id="MAps"
         ref="map"></div>
  </div>
</template>

<script>
import { Toast } from 'vant'
export default {
  name: 'Maps',
  props: {
    signInList: {
      type: Array,
      default() {
        return [
          {
            longitude: 116.408745, // 经度
            latitude: 39.955597, // 纬度
          },
        ]
      },
    },
  },
  data() {
    return {
      signInLists: [],
      MAps: null, // 地图实例
      geolocation: null, // 定位实例
      circle: null, // 画圆实例
      userDot: {
        lng: '',
        lat: '',
      },
      // 园中心的点坐标
    }
  },
  watch: {
    signInList: {
      immediate: true,
      handler(val) {
        this.signInLists = val
      },
    },
  },
  mounted() {
    console.log('传过来了1', this.signInList)
    console.log('传过来了', this.signInLists)
    this.initMaps()
    //  - 45.98 - 51.98 - 24.99 - 24.99 + 'px'
  },
  methods: {
    /**
     * 计算两点的距离
     */
    getDistance(lat1, lng1, lat2, lng2, distance) {
      var radLat1 = (lat1 * Math.PI) / 180.0
      var radLat2 = (lat2 * Math.PI) / 180.0
      var a = radLat1 - radLat2
      var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0
      var s =
        2 *
        Math.asin(
          Math.sqrt(
            Math.pow(Math.sin(a / 2), 2) +
              Math.cos(radLat1) *
                Math.cos(radLat2) *
                Math.pow(Math.sin(b / 2), 2)
          )
        )
      s = s * 6378.137 // EARTH_RADIUS;
      s = Math.round(s * 1000) / 1000

      if (s > distance / 1000) {
        return true
      } else {
        return false
        // this.$emit('sign_in_position', userPosition) // 定位成功且距离在可签到范围内的向父组件传递当前用户的坐标
        // this.$emit('sign_in', false)
      }
    },

    /**
     * 画圆半径
     */
    make_circle(lng, lat) {
      let that = this
      // eslint-disable-next-line no-undef
      that.circle = new AMap.Circle({
        center: [lng, lat],
        radius: 500, //半径
        borderWeight: 3,
        strokeColor: '#FF33FF',
        strokeOpacity: 1,
        strokeWeight: 6,
        // eslint-disable-next-line no-dupe-keys
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        strokeStyle: 'dashed',
        strokeDasharray: [10, 10],
        // 线样式还支持 'dashed'
        fillColor: '#1791fc',
        zIndex: 50,
      })

      that.circle.setMap(that.MAps)
      // 缩放地图到合适的视野级别
      that.MAps.setFitView([that.circle])

      // eslint-disable-next-line no-undef
      var circleEditor = new AMap.CircleEditor(that.MAps, that.circle)

      circleEditor.on('move', function (event) {
        console.log('触发事件：move', event)
      })

      circleEditor.on('adjust', function (event) {
        console.log('触发事件：adjust', event)
      })

      circleEditor.on('end', function (event) {
        console.log('触发事件： end', event)
        // event.target 即为编辑后的圆形对象
      })
    },

    /**
     * 解析定位结果
     * 当前用户位置的坐标
     */
    onComplete(data) {
      debugger
      this.userDot = {
        lat: data.position.lat,
        lng: data.position.lng,
      }
      debugger
      for (let i in this.signInLists) {
        if (this.signInLists[i].longitude) {
          this.make_circle(
            this.signInLists[i].longitude,
            this.signInLists[i].latitude
          ) // 画圆
        }
      }

      for (let l in this.signInLists) {
        let state = this.getDistance(
          this.userDot.lat,
          this.userDot.lng,
          this.signInLists[l].latitude,
          this.signInLists[l].longitude,
          this.signInLists[l].distance
        ) // 计算当前位置是否可签到
        debugger
        if (!state) {
          this.$emit('sign_in_position', this.userDot) // 定位成功且距离在可签到范围内的向父组件传递当前用户的坐标
          this.$emit('sign_in', false)
          return
        }
      }

      this.$emit('sign_in_state', false) // 向父组件传递加载状态为true
    },

    /**
     * 解析定位错误信息
     */
    onError() {
      Toast('定位失败')
      this.$emit('sign_in_state', true) // 向父组件传递加载状态为true
    },

    /**
     * 定位方法
     */
    map_orientation() {
      // 定位方法
      let that = this
      that.MAps.plugin('AMap.Geolocation', function () {
        // eslint-disable-next-line no-undef
        that.geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000, //超过10秒后停止定位，默认：5s
          buttonPosition: 'RB', //定位按钮的停靠位置
          // eslint-disable-next-line no-undef
          buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
        })

        that.MAps.addControl(that.geolocation)

        that.geolocation.getCurrentPosition((status, result) => {
          debugger
          if (status == 'complete') {
            debugger
            that.onComplete(result)
          } else {
            that.onError(result)
          }
        })
      })
    },

    /**
     * 地图初始化
     * 进入此页面首先加载此方法然后进行定位和画圆
     */
    initMaps() {
      // .documentElement.clientHeight

      let height = document.documentElement.clientHeight
      console.log(height)
      let a = height - 46 - 52 - 25 - 25 - 20
      let MAps = document.getElementById('MAps')
      MAps.style.height = a + 'px'
      console.log('map的高度', a)
      /**
       * 配置地图的基本显示
       */
      let that = this
      // 初始化地图实例
      // eslint-disable-next-line no-undef
      that.MAps = new AMap.Map('MAps', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 11, //初始化地图层级
        center: [116.408745, 39.955597], //初始化地图中心点
        viewMode: '3D', //使用3D视图
      })
      that.map_orientation() // 调定位的方法
    },
  },
}
</script>

<style lang="scss">
#MAps {
  width: 100%;
  height: 100%;
}
</style>