const path = require('path');
const fs = require('fs');
const Busboy = require('busboy');
/**
 * @desc 创建文件目录同步方法
 * @param {string} dirname 目录的绝对地址
 * @return {boolean} 创建目录的结果
 * */
function mkdirsSync (dirname) {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
}
/**
 * @desc 获取上传文件的后缀名
 * @return {string}
 */
function getSuffixName (fileName) {
  let nameList = fileName.split('.')
  return nameList[nameList.length - 1]
}
/**
 * @desc 上传文件
 * @param {Object} ctx koa上下文
 * @param {Object} options 文件上传参数 fileType文件类型， path文件存放路径
 * @return promise
 * */
function uploadImg (ctx, options) {
  let req = ctx.req;
  let res = ctx.res;
  let busboy = new Busboy({headers: req.headers});
  // 获取类型
  let fileType = options.fileType || 'common';
  let filePath = path.join(options.path, fileType);
  let mkdirResult = mkdirsSync(filePath);
  return new Promise((resolve, reject) => {
    let result = {
      success: false,
      message: '',
      data: null
    }
    busboy.on('file', (fieldname, file, filename, encoding, mimeType) => {
      let fileName = Math.random().toString(16).substr(2) + '.' + getSuffixName(filename)
      let uploadFilePath = path.join(filePath, fileName)
      let saveTo = path.join(uploadFilePath)
      // 保存文件到制定的文件夹下
      file.pipe(fs.createWriteStream(saveTo))
      file.on('end', function () {
        result.success = true
        result.message = '文件上传成功'
        result.data = {
          picUrl: `//${ctx.host}/image/${fileType}/${fileName}`
        }
        console.log(result, '文件上传成功')
        resolve(result)
      })
    })
    // 解析结束事件
    busboy.on('finish', function () {
      console.log('文件上结束')
      resolve(result)
    })
    // 解析错误事件
    busboy.on('error', function () {
      reject(result)
    })
    req.pipe(busboy)
  })
}
module.exports = {
  uploadImg
}
