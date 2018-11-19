const chainGet = require('chain-get');
const defualtOpts = {
  debugger: true,
  console: true
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
    if (chainGet(path).node.expression.type() === 'CallExpression' && chainGet(path).node.expression.callee()) {
      // remove alert
      if (path.node.expression.callee.name === 'alert') {
        if (state.opts.alert) {
          path.remove()
        }
        return;
      }

      // remove console
      if (path.node.expression.callee.type === 'MemberExpression' && chainGet(path).node.expression.callee.object.name() === 'console') {
        if (state && state.opts) {
          if (typeof state.opts.console === 'undefined') {
            state.opts.console = true;
          }
        }
        if (chainGet(state).opts.console()) {
          path.remove();
        }
        return;
      }

      // remove customized debugger function
      if (typeof chainGet(state).opts.debugFn() === 'string') {
        const fn = state.opts.debugFn;
        if (chainGet(path).node.expression.callee.name() === fn) {
          path.remove();
        }
      }
    }
  },
  FunctionDeclaration(path, state) {
    if (!state || typeof state.opts === 'undefined' || !state.opts.debugFn || typeof state.opts.debugFn !== 'string') return;
    if (chainGet(path).node.id.type() === 'Identifier' && path.node.id.name === state.opts.debugFn) {
      path.remove();
    }
  },
  VariableDeclarator(path, state) {
    if (!state || typeof state.opts === 'undefined' || !state.opts.debugFn || typeof state.opts.debugFn !== 'string') return;
    const fn = state.opts.debugFn;
    if (chainGet(path).node.id.name() === fn) {
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
