#### Depends on  
```javascript
"webpack": "^4.31.0"  
"webpack-cli": "^3.3.2"    

"webpack-dev-server": "^3.3.1"
```

#### How to use?  
`webapck.dev.js`  
```javascript  
module.exports = require('webpack-project-builder/lib/webpack.dev')
```
`webapck.prod.js`  
```javascript  
module.exports = require('webpack-project-builder/lib/webpack.prod')
```
`webapck.ssr.js`  
```javascript  
module.exports = require('webpack-project-builder/lib/webpack.ssr')
```  

#### Notes  
webpack-project-builder包只支持**多页面**入口打包，对入口文件路径有要求：  
入口文件为`/src/**/index.js`文件  

#### 应用实例  
[react-shop-h5](https://github.com/Mone-Lee/react-shop-h5)  
参考极客时间商城（h5），使用react进行开发，webpack配合进行项目构建，实现ssr渲染。