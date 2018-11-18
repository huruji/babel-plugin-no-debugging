const a = 12;
const b = 13;
debugger;

alert(123);

// function debug() {
//   console.log(123)
// }

const c = 15,
  debug = function () {
    console.log(123);
  }

debug();

function add(m, n) {
  return m + n;
}
add(a, b);

console.log('end')
