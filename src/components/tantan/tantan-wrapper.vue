<template>
  <div class="main">
    <div class="mid-center">
      <div class="stack-wrapper">
        <tan-tan-component ref="stack" :imgData="imgData"></tan-tan-component>
      </div>
      <div class="controls">
        <button @click="prev">
          <i class="prev"></i>
          <span class="hide-text">prev</span>
        </button>
        <button @click="next">
          <i class="next"></i>
          <span class="hide-text">next</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import TanTanComponent from './tantan'
export default {
  data () {
    return {
      imgData: [
        // {src: require('@/assets/img/1.png'), alt: '1.png'},
        // {src: require('@/assets/img/2.png'), alt: '2.png'},
        // {src: require('@/assets/img/3.png'), alt: '3.png'},
        // {src: require('@/assets/img/4.png'), alt: '4.png'},
        // {src: require('@/assets/img/5.png'), alt: '5.png'}
      ]
    }
  },
  components: {
    TanTanComponent
  },
  created () {
    this.$http.get('/api/getImg').then((res) => {
      console.log(res)
      this.imgData = res.data
    })
  },
  methods: {
    prev () {
      this.$refs.stack.$emit('prev')
    },
    next () {
      this.$refs.stack.$emit('next')
    }
  }
}
</script>
<style lang="scss" scoped>
  .main {
    display: flex;
    background: #565f77 none repeat scroll 0 0;
    -webkit-display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    .stack-wrapper {
      margin: 0 auto;
      position: relative;
      width: 320px;
      height: 320px;
      z-index: 1000;
    }
    .controls {
      width: 200px;
      display: flex;
      -webkit-display: flex;
      text-align: center;
      margin: 0 auto;
      margin-top: 50px;
      justify-content: space-around;
      button {
        display: inline-block;
        position: relative;
        height: 50px;
        width: 50px;
        border-radius: 50%;
        background: #fff;
        cursor: pointer;
        z-index: 100;
        border: none;
        font-size: 16px;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        outline: none;
        .prev, .next {
          height: 5px;
          position: relative;
          display: inline-block;
          line-height: 0;
          font-size: 0;
          vertical-align: middle;
          -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
        }
        .prev {
          width: 20px;
          background: #e66868;
          &:after {
            content: '/';
            display: block;
            width: 20px;
            height: 5px;
            -webkit-transform: rotate(-90deg);
            background: #e66868;
          }
        }
        .hide-text {
          position: absolute;
          overflow: hidden;
          width: 10px;
          height: 10px;
          color: transparent;
          display: block;
        }
        .next {
          width: 10px;
          background: #81d47d;
          left: -5px;
          top: 2px;
          text-align: center;
          &:after {
            content: '/';
            display: block;
            width: 20px;
            height: 5px;
            -webkit-transform: rotate(-90deg) translateY(-50%) translateX(50%);;
            background: #81d47d;
          }
        }
      }
    }
  }
</style>
