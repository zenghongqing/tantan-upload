# tantan
任务: 完成一个爬虫豆瓣或微博一个话题的图片，仿照探探显示图片的3D功能，以及可以上传多张图片至服务端并能显示上传图片的进度。
> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# 开启服务端
cd server && node index.js
```
## 爬虫
使用了puppeteer能动态的获取网页图片的src，再通过axios请求获得图片内容，将该内容由stream写入到文件夹。
## 仿探探的图片展示
1. 布局上构造3D环境可以参考：https://www.cnblogs.com/st-leslie/p/5768524.html;
2. 需要考虑：判断图片何种条件下移动出去或者回到原位置，以及只显示前三张图片，第一张图片z轴移动的距离等。

## 多图片上传

服务端: 主要是使用koa2框架，busboy模块处理上传图片;
客户端： 使用了promise以及async异步控制，在兼容性以及图片处理上的大体流程：
<img src='https://segmentfault.com/img/bVQgvh?w=1132&h=1256'>
