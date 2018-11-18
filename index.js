const utils = require('./utils');

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
    if (utils.chainGet(path).node.expression.type() === 'CallExpression' && utils.chainGet(path).node.expression.callee()) {
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
      if (path.node.expression.callee.type === 'MemberExpression' && utils.chainGet(path).node.expression.callee.object.name() === 'console') {
        if (utils.chainGet(state).opts.console()) {
          path.remove();
        }
      }

      // remove customized debugger function
      if (typeof utils.chainGet(state).opts.debugFn() === 'string') {
        const fn = state.opts.debugFn;
        if (utils.chainGet(path).node.expression.callee.name() === fn) {
          path.remove();
        }
      }
    }
  },
  FunctionDeclaration(path, state) {
    if (!state || typeof state.opts === 'undefined' || !state.opts.debugFn || typeof state.opts.debugFn !== 'string') return;
    if (utils.chainGet(path).node.id.type() === 'Identifier' && path.node.id.name === state.opts.debugFn) {
      path.remove();
    }
  },
  VariableDeclarator(path, state) {
    if (!state || typeof state.opts === 'undefined' || !state.opts.debugFn || typeof state.opts.debugFn !== 'string') return;
    const fn = state.opts.debugFn;
    if (utils.chainGet(path).node.id.name() === fn) {
      if (path.inList) {
        path.remove();
      } else {
        const parentPath = path.parentPath;
        parentPath.remove();
      }
    }
  }
}


module.exports = function () {
  return {
    visitor
  }
}
