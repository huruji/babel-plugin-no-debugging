const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const noDebuggerPlugin = require('../index');


const code = fs.readFileSync(path.resolve(__dirname, './code.js'), 'utf-8');

const result = babel.transform(code, {
  plugins: [
    [
      noDebuggerPlugin,
      {
        // console: true,
        // debugFn: 'debug'
        alert: true,
        console: true
      }
    ]
  ]
})

console.log(result.code);
