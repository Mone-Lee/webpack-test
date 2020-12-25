const { getAST, getDependencies, transform } = require('./parser');
const path = require('path');

const ast = getAST(path.join(__dirname, '../src/index.js'));
const dependencies = getDependencies(ast);
const transformSource = transform(ast);
console.log(transformSource)