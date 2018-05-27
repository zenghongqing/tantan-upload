const puppeteer = require('puppeteer');
const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const convert = require('koa-convert');
const static = require('koa-static');
const app = new Koa();
const router = new Router();
const { uploadImg } = require('./upload');
// 静态资源目录相对于入口文件index.js的路径
const staticPath = './static'
app.use(convert(static(
  path.join(__dirname, staticPath)
)))

const crawer = async () => {
  // 先通过 puppeteer.launch() 创建一个浏览器实例 Browser 对象
  const browser = await puppeteer.launch();
  // 然后通过 Browser 对象创建页面 Page 对象
  const page = await browser.newPage();
  // 然后 page.goto() 跳转到指定的页面
  await page.goto(`https://www.douban.com/`);
  await page.waitFor(1000);
  // 要获取打开的网页中的宿主环境
  const dimensions = await page.evaluate(() => {
    /* page.$(selector) 与我们常用的 document.querySelector(selector) 一致，返回的是一个 ElementHandle 元素句柄
    page.$$(selector) 与我们常用的 document.querySelectorAll(selector) 一致，返回的是一个数组 */
    // let aDivs = document.querySelectorAll('#anony-sns > div > div.main > div > div.albums > ul > li > div > a > img')
    // return aDivs
    var list = [];
    var $ = window.$;
    var items = $('.albums img')
    if (items.length > 0) {
      items.each((index, item) => {
        list.push($(item).attr('src'))
      })
    }
    return list
  });
  // 将城市信息写入文件
  return dimensions
  // console.log('Dimensions:', dimensions);
  await browser.close();
};
// 接受多文件
router.post('/api/uploadUrl', async (ctx, next) => {
  // console.log(ctx.request.body)
  let result = {success: false};
  let serverPath = path.join(__dirname, 'static/image')
  result = await uploadImg(ctx, {
    fileType: 'album',
    path: serverPath
  });
  console.log(serverPath, result, 'result111');
  ctx.body = result

});
router.get('/api/getImg', async (ctx, next) => {
  ctx.succuss = true;
  ctx.status = 200;
  const data = await crawer();
  ctx.body = data
})

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('程序正在运行中....')
})
