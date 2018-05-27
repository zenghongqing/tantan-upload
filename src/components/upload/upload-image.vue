<template>
  <div class="upload">
    <div class="file-wrap">
      <input type="file" accept="image/*" @change="uploadImg" multiple>
    </div>
    <hr>
    <p>上传结果图片</p>
    <div id="J_PicturePreview" class="preview-picture">
      <ul>
        <li v-for="(item, index) in imgList" :key="index">
          <img :src="item">
          <p>上传进度<span id="J_UploadProgress">{{progressList[index] * 100}}</span>%</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      imgList: [],
      progressList: [],
      imgFile: {},
      sendFile: ''
    }
  },
  methods: {
    /**
     * @desc 给后台发送ajax请求
     * @param file 文件对象
     * */
    requestEvent (file) {
      let formData = new FormData()
      formData.append('file', file)
      // formData.append('type', file.type)
      return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()
        let ratio = 0
        xhr.upload.addEventListener('progress', (e) => {
          ratio = e.loaded / e.total
        }, false)
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            console.log(xhr, 'xhr')
            const result = JSON.parse(xhr.responseText)
            if (xhr.status === 200) {
              resolve({
                fileObj: result,
                progress: ratio
              })
            } else {
              reject(result)
            }
          }
        }
        xhr.open('POST', '/api/uploadUrl', true)
        xhr.send(formData)
      })
    },
    /**
     * @desc 将文件对象转换为dataURL
     * @param file 文件对象
     * */
    transformFileToDataUrl (file) {
      return new Promise((resolve) => {
        const reader = new FileReader()
        const imgMaxSize = 200 * 1024 // 超过200kb就压缩
        console.log(file.type, 'type')
        // 存储文件相关信息
        this.imgFile.type = file.type || 'image/png' // 部分安卓出现获取不到type的情况
        this.imgFile.size = file.size
        this.imgFile.name = file.name
        this.imgFile.lastModifiedDate = file.lastModifiedDate
        reader.onload = (e) => {
          const result = e.target.result
          if (result.length < imgMaxSize) {
            this.compress(result, false).then((res) => {
              resolve(res)
            })
          } else {
            this.compress(result, true).then((res) => {
              resolve(res)
            })
          }
        }
        reader.readAsDataURL(file)
      })
    },
    /**
     * @desc 根据文件大小判断是否进行压缩
     * @param {String} dataURL 根据文件对象转换的dataURL
     * @param {Boolean} shouldCompress 是否需要进行压缩
     * */
    compress (dataURL, shouldCompress = true) {
      const img = new Image()
      let compressedDataUrl = ''
      img.src = dataURL
      return new Promise((resolve) => {
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          if (shouldCompress) {
            compressedDataUrl = canvas.toDataURL(this.imgFile.type, 0.4)
          } else {
            compressedDataUrl = canvas.toDataURL(this.imgFile.type, 1)
          }
          resolve(this.processData((compressedDataUrl)))
        }
      })
    },
    /**
     * @desc 将生成的dataURL转换为Blob对象，再变为File返回
     * @param {String} dataURL 生成的dataURL
     * @return {Object} fileOfBlob 生成的上传文件对象
     * */
    processData (dataURL) {
      // 使用二进制方式处理dataUrl
      const binaryString = atob(dataURL.split(',')[1])
      const arrayBuffer = new ArrayBuffer(binaryString.length)
      const intArray = new Uint8Array(arrayBuffer)
      for (let i = 0, j = binaryString.length; i < j; i++) {
        intArray[i] = binaryString.charCodeAt(i)
      }
      const data = [intArray]
      let blob
      blob = new Blob(data, {type: this.imgFile.type})
      // blob 转file
      let fileOfBlob = new File([blob], this.imgFile.name, {type: this.imgFile.type})
      return fileOfBlob
    },
    async uploadImg (e) {
      const files = e.target.files
      let uploadImgArr = []
      for (let i = 0; i < files.length; i++) {
        let file = files[i]
        // 判断如果不是IOS系统，则进行转化base64
        if (!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
          let sendFile = await this.transformFileToDataUrl(file)
          uploadImgArr.push(this.requestEvent(sendFile))
        } else {
          uploadImgArr.push(this.requestEvent(file))
        }
        // uploadImgArr.push(this.requestEvent(file))
      }
      Promise.all([...uploadImgArr]).then((res) => {
        console.log(res, '**')
        for (let i = 0; i < res.length; i++) {
          this.imgList.push(res[i].fileObj.data.picUrl)
          this.progressList.push(res[i].progress)
        }
      })
    }
  }
}
</script>
