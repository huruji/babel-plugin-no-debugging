const babel = require('@babel/core');
const t = require('@babel/types');

const defualtOpts = {
  debugger: true,
  alert: true
}

const visitor = {
  DebuggerStatement(path, state) {
    if (state) {
      if (typeof state.opts === 'undefined') {
        state.opts = defualtOpts;
      }
      if (typeof state.opts.debugger === 'undefined') {
        state.opts.debugger = true;
      }
      if (state.opts.debugger) {
        path.remove();
      }
    }
  },
  ExpressionStatement(path, state) {
    if (state) {
      if (typeof state.opts === 'undefined') {
        state.opts = defualtOpts;
      }
    }
    if (path.node && path.node.expression && path.node.expression.type === 'CallExpression' && path.node.expression.callee && path.node.expression.callee.name === 'alert') {
      if (state && state.opts) {
        if (typeof state.opts.alert === 'undefined') {
          state.opts.alert = true;
        }
        if (state.opts.alert) {
          path.remove()
        }
      }
    }
  }
}

module.exports = function () {
  return {
    visitor
  }
}
