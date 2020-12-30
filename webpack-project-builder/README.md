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