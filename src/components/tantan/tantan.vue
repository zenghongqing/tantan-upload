<template>
  <ul class="stack">
    <li class="stack-item" v-for="(item, index) in imgData"
        :style="[transform(index), transformIndex(index)]"
        @touchstart.stop.capture="touchstart"
        @touchmove.stop.capture="touchmove"
        @touchend.stop.capture="touchend"
        @mousedown.stop.capture="touchstart"
        @mousemove.stop.capture="touchmove"
        @mouseup.stop.capture="touchend"
        @transitionend="onTransitionEnd"
        @webkit-transition-end="onTransitionEnd"
        :key="item.id">
      <img :src="item">
    </li>
  </ul>
</template>

<script>
// import TanTanWrapper from './tantan-wrapper'
export default {
  name: 'tanTan',
  props: {
    imgData: {
      type: Array
    }
  },
  data () {
    return {
      // basicData数据包含组件基本数据
      basicData: {
        currentPage: 0, // 默认首图的序列
        start: {}, // 记录起始位置
        end: {} // 记录终点位置
      },
      // temporaryData数据包含组件临时数据
      temporaryData: {
        opacity: 1, // 记录首图透明度
        zIndex: 10,
        // 记录默认显示堆叠数
        visible: 3,
        posWidth: 0, // 记录x方向的滑动值
        posHeight: 0, // 记录y方向的滑动值
        tracking: false, // 是否在滑动，防止多次操作
        animation: false, // 是否启用动画，默认为否
        lastPosWidth: 0, // 记录上一次x轴上滑动的距离
        lastPosHeight: 0, // 记录上一次y轴上滑动的距离
        swipe: false // onTransition的判定条件
      }
    }
  },
  created () {
    // 绑定事件
    this.$on('next', () => {
      this.next()
    })
    this.$on('prev', () => {
      this.prev()
    })
    document.addEventListener('touchmove', (e) => {
      e.preventDefault()
    })
  },
  // components: {
  //   TanTanWrapper
  // },
  methods: {
    /**
     * @description 根据当前首页索引，以及可显示的是visible张，填充stack数组，再判断第index张是不是在stack里
     * @param {Number} index 遍历图片的索引
     * @param {Number} currentPage 当前首图的索引值
     * @return 判断遍历的图片是不是可显示
     * */
    inStack (index, currentpage) {
      let stack = []
      let visible = this.temporaryData.visible
      let len = this.imgData.length
      for (let i = 0; i < visible; i++) {
        if (i + currentpage < len) {
          stack.push(currentpage + i)
        } else {
          stack.push(currentpage + i - len)
        }
      }
      return stack.indexOf(index) >= 0
    },
    /**
     * @description 遍历样式，对图片列表进行样式设置
     * @param {Number} index 当前图片的索引值
     * @return {Object} style 返回图片列表的样式对象
     * */
    transform (index) {
      if (this.basicData.currentPage === index) return
      let style = {}
      // let perIndex = index - this.basicData.currentPage
      let lastPage = this.basicData.currentPage === 0 ? this.imgData.length - 1 : this.basicData.currentPage - 1
      if (this.inStack(index, this.basicData.currentPage)) {
        let perIndex = index - this.basicData.currentPage > 0 ? index - this.basicData.currentPage : index - this.basicData.currentPage + this.imgData.length
        style.opacity = '1'
        style.transform = `translate3D(0, 0, -${perIndex * 60}px)`
        style.zIndex = this.temporaryData.visible - perIndex
        style.transitionDuration = 300 + 'ms'
        style.transitionTimingFunction = 'ease'
      } else if (index === lastPage) {
        console.log(this.temporaryData.lastPosWidth, '上一个首页')
        style.opacity = '0'
        style.transform = `translate3D(${this.temporaryData.lastPosWidth}px, ${this.temporaryData.lastPosHeight}, 0px)`
        style.zIndex = '-1'
        style.transitionTimingFunction = 'ease'
        style.transitionDuration = 1000 + 'ms'
      } else {
        style.opacity = 0
        style.zIndex = '-1'
        style.transform = `translate3D(0, 0, -${this.temporaryData.visible * 60}px)`
      }
      return style
    },
    /**
     * @description 首页样式切换
     * @param {Number} index 首页图片的系数索引
     * @return {Object} style 首页图片样式对象
     * */
    transformIndex (index) {
      if (index === this.basicData.currentPage) {
        let style = {}
        style.opacity = this.temporaryData.opacity
        style.zIndex = 10
        style.transform = `translate3D(${this.temporaryData.posWidth}px, ${this.temporaryData.posHeight}px, 0)`
        if (this.temporaryData.animation) {
          style.transitionTimingFunction = 'ease'
          style.transitionDuration = 300 + 'ms'
        }
        return style
      }
    },
    /**
     * @description 图片未移出的面积占比
     * @param {Number} offsetWidth 向左或者向右的滑动距离
     * @param {Number} width 图片的宽度
     * @return
     * */
    areaRatio () {
      let width = this.$el.offsetWidth
      let height = this.$el.offsetHeight
      let posHeight = this.temporaryData.posHeight
      let posWidth = this.temporaryData.posWidth
      return posHeight * posWidth > width * height ? 1 : (1 - posWidth * posHeight / width * height)
    },
    touchstart (e) {
      // 正在滑动, 直接返回
      if (this.temporaryData.tracking) return
      console.log('滑动开始')
      if (e.type === 'touchstart') {
        if (e.touches.length > 1) {
          this.temporaryData.tracking = false
          return
        } else {
          // 记录其实位置信息
          this.basicData.start.t = new Date().getTime()
          this.basicData.start.x = e.touches[0].pageX
          this.basicData.start.y = e.touches[0].pageY
          this.basicData.end.x = e.touches[0].pageX
          this.basicData.end.y = e.touches[0].pageY
        }
        // PC操作
      } else {
        this.basicData.start.t = new Date().getTime()
        this.basicData.start.x = e.clientX
        this.basicData.start.y = e.clientY
        this.basicData.end.x = e.clientX
        this.basicData.end.y = e.clientY
      }
      this.temporaryData.tracking = true
    },
    touchmove (e) {
      if (e.type === 'touchmove') {
        console.log('滑动进行')
        this.basicData.end.x = e.touches[0].pageX
        this.basicData.end.y = e.touches[0].pageY
      } else {
        this.basicData.end.x = e.clientX
        this.basicData.end.y = e.clientY
      }
      // 计算滑动值
      this.temporaryData.posWidth = this.basicData.end.x - this.basicData.start.x
      this.temporaryData.posHeight = this.basicData.end.y - this.basicData.start.y
    },
    touchend (e) {
      // 判断滑动的面积是否达到可以消失的条件
      if (this.areaRatio() <= 0.5) {
        // 设定X轴最终移动200px的偏移
        let ratio = Math.abs(this.temporaryData.posHeight / this.temporaryData.posWidth)
        this.temporaryData.posWidth = this.temporaryData.posWidth >= 0 ? this.temporaryData.posWidth + 200 : this.temporaryData.posWidth - 200
        this.temporaryData.posHeight = this.temporaryData.posHeight >= 0 ? Math.abs(this.temporaryData.posWidth * ratio) : -Math.abs(this.temporaryData.posWidth * ratio)
        this.nextTick()
      } else {
        this.temporaryData.posWidth = 0
        this.temporaryData.posHeight = 0
        this.temporaryData.swiper = false
      }
    },
    onTransitionEnd (index) {
      // dom发生变化后，正在执行的滑动动画序列变为上一层
      let lastPage = this.basicData.currentPage === 0 ? this.imgData.length - 1 : this.basicData.currentPage - 1
      if (this.temporaryData.swiper && index === lastPage) {
        this.temporaryData.animation = true
        this.temporaryData.lastPosHeight = 0
        this.temporaryData.lastPosWidth = 0
        this.temporaryData.animation = true
        this.temporaryData.opacity = 1
      }
    },
    prev () {
      // 获取计算划出后最终位置
      let offsetWidth = this.$el.offsetWidth
      this.temporaryData.posWidth = -offsetWidth
      console.log(this.temporaryData.posWidth, '高度')
      this.nextTick()
    },
    next () {
      // 获取计算划出后最终位置
      let offsetWidth = this.$el.offsetWidth
      this.temporaryData.posWidth = offsetWidth
      this.nextTick()
    },
    nextTick () {
      // 更新状态
      this.temporaryData.tracking = false
      this.temporaryData.animation = true
      // 记录上一次滑动的距离
      this.temporaryData.lastPosWidth = this.temporaryData.posWidth
      this.temporaryData.lastPosHeight = this.temporaryData.posHeight
      this.temporaryData.opacity = 0
      this.temporaryData.swiper = true
      this.basicData.currentPage = this.basicData.currentPage === this.imgData.length - 1 ? 0 : this.basicData.currentPage + 1
      // currentPage切换，整体dom进行变化，把第一层滑动置最低
      this.$nextTick(() => {
        this.temporaryData.posWidth = 0
        this.temporaryData.opacity = 1
        this.temporaryData.posHeight = 0
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .stack {
    width: 100%;
    height: 100%;
    position: relative;
    perspective: 1000px;
    -webkit-perspective: 1000px;
    transform-style: preserve-3d;
    perspective-origin: 50% 150%;
    -webkit-perspective-origin: 50% 150%;
    .stack-item {
      position: absolute;
      background: #fff;
      height: 100%;
      width: 100%;
      border-radius: 4px;
      text-align: center;
      overflow: hidden;
      /*&:nth-of-type(1) {
        transform: translate3d(0px, 0px, 0px);
        -webkit-transform: translate3d(0px, 0px, 0px);
        opacity: 1;
        z-index: 10;
      }
      &:nth-of-type(2) {
        transform: translate3d(0px, 0px, -60px);
        -webkit-transform: translate3d(0px, 0px, -60px);
        opacity: 1;
        z-index: 1;
      }
      &:nth-of-type(3) {
        transform: translate3d(0px, 0px, -120px);
        -webkit-transform: translate3d(0px, 0px, -120px);
        opacity: 1;
        z-index: 1;
      }
      &:nth-of-type(4) {
        transform: translate3d(0px, 0px, -180px);
        -webkit-transform: translate3d(0px, 0px, 0px);
        opacity: 0;
        z-index: -1;
      }
      &:nth-of-type(5) {
        transform: translate3d(0px, 0px, -180px);
        -webkit-transform: translate3d(0px, 0px, 0px);
        opacity: 0;
        z-index: -1;
      }*/
    }
  }
</style>
