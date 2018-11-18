const babel = require('@babel/core');
const t = require('@babel/types');
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
        if (utils.chainGet(path).node.expression.callee.name() === fn) {
          path.remove();
        }
      }
    }
  },
  FunctionDeclaration(path, state) {
    if (!state || typeof state.opts === 'undefined' || !state.opts.debugFn || typeof state.opts.debugFn !== 'string') return;
    if (path && path.node && path.node.id && path.node.id.type === 'Identifier' && path.node.id.name === state.opts.debugFn) {
      path.remove();
    }
  },
  VariableDeclaration(path, state) {
    // console.log('variable');
    // console.log(utils.chainGet(path).node.declarations[0]().path.remove())
    if (!state || typeof state.opts === 'undefined' || !state.opts.debugFn || typeof state.opts.debugFn !== 'string') return;
    const fn = state.opts.debugFn;
    if (utils.chainGet(path).node.declarations[0]()) {
      const declarations = utils.chainGet(path).node.declarations();
      let remove = false;
      declarations.forEach((declaration) => {
        if (utils.chainGet(declaration).init.type() === 'FunctionExpression' && utils.chainGet(declaration).id.name() === fn) {
          remove = true;
        }
      })
      if (remove) {
        path.remove();
      }
    }
  }
}


module.exports = function () {
  return {
    visitor
  }
}
