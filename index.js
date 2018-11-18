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
    if (path.node && path.node.expression && path.node.expression.type === 'CallExpression' && path.node.expression.callee) {
      // remove alert
      if (path.node.expression.callee.name === 'alert') {
        if (state && state.opts) {
          if (typeof state.opts.alert === 'undefined') {
            state.opts.alert = true;
          }
          if (state.opts.alert) {
            path.remove()
          }
        }
        return;
      }

      // remove console
      if (path.node.expression.callee.type === 'MemberExpression' && path.node.expression.callee.object && path.node.expression.callee.object.name === 'console') {
        if (state && state.opts && state.opts.console) {
          path.remove();
        }
      }

      // remove customized debugger function
      if (state.opts.debugFn && typeof state.opts.debugFn === 'string') {
        const fn = state.opts.debugFn;
        if (path.node.expression.callee.name === fn) {
          path.remove();
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
