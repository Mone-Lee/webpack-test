const Spritesmith = require('spritesmith');
const path = require('path');
const fs = require('fs');

module.exports = function(source) {
  const callback = this.async();
  var sprites = [];
  var images = source.match(/url\((\S*)\?__sprite/g);
  // console.log(match)

  for(let i=0; i<images.length; i++) {
    let img = images[i].match(/url\((\S*)\?__sprite/)[1];
    sprites.push(path.resolve(__dirname, img));
  }

  Spritesmith.run({src: sprites}, function handleResult (err, result) {
    // 输出到dist目录
    fs.writeFileSync(path.join(process.cwd(), 'dist/sprite.png'), result.image);

    // 替换源代码的图片路径
    source = source.replace(/url\((\S*)\?__sprite\);/g, (match) => {
      let tempUrl = match.match(/url\((\S*)\?__sprite\);/)[1];
      let url = path.resolve(__dirname, tempUrl);

      let coordinate = result.coordinates[url];
      let width = coordinate.width;
      let height = coordinate.height;
      let x = coordinate.x;
      let y = coordinate.y;
      return `url("sprite.png");width:${width}px;height:${height}px;background-position:-${x}px -${y}px;`;
    })

    // 输出替换后的样式文件
    fs.writeFileSync(path.join(process.cwd(), '/dist/index.css'), source);
    callback(null, source);
  });
}