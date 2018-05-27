import Vue from 'vue'
import Router from 'vue-router'
import TanTan from '../components/tantan/tantan-wrapper'
import UploadImage from '../components/upload/upload-image'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'tantan',
      component: TanTan
    },
    {
      path: '/upload',
      name: 'upload',
      component: UploadImage
    }
  ]
})
