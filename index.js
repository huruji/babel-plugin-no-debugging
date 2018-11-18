const babel = require('@babel/core');
const t = require('@babel/types');

const visitor = {
  DebuggerStatement(path, state) {
    if (state && state.opts && state.opts.debugger) {
      path.remove();
    }
  },
  ExpressionStatement(path, state) {
    if (path.expression && path.expression.type === 'CallExpression' && path.expression.callee && path.expression.callee.name === 'alert') {
      if (state && state.opts && state.opts.alert) {
        path.remove();
      }
    }
  }
}

module.exports = function (babel) {
  return {
    visitor
  }
}
