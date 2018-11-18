/** 链式取值
 *
 * @param {*} obj
 *
 * example:
 * let person = {age: 12, name: 'huruji', sisters: ['a']}
 * chainGet(person).age()  // 12
 * chainGet(person).sisters[0]() // a
 * chainGet(person).sisters[1]() // undefined
 * chainGet(person).brothers[1]() // undefined
 */
function chainGet(obj, path = []) {
  return new Proxy(() => {}, {
    get(target, property) {
      return chainGet(obj, path.concat(property))
    },
    apply(target, self, args) {
      let val = obj;
      let und;
      for (let i = 0; i < path.length; i++) {
        if (val === null || val === und) break;
        val = val[path[i]];
      }
      if (val === null || val === und) {
        val = args[0]
      }
      return val;
    }
  })
}


module.exports = {
  chainGet
}
