
// A Controlled Promise for unit testing, exposes the promise continuation callbacks
// on the promise itself so it can be resolved/rejected externally.

var ControlledPromise = module.exports = function ControlledPromise () {
  var control = {}

  var promise = new Promise(function (resolve, reject) {
    // This is called synchronously when promise is created...
    control.resolve = resolve
    control.reject = reject
  })

  promise.resolve = control.resolve
  promise.reject = control.reject

  // ... so at this point resolve/reject methods have been assigned
  return promise
}

/* Usage
var promise = ControlledPromise()

promise.resolve('hello')
promise.reject('boom')

promise.then(function (value) {
  console.log(value) // hello
})
*/

// var result1, result2, result3;
//
// Promise.resolve('hello1')
// .then(function(data) {
//   console.log(data)
//     result1 = data;
//     return 'hello2';
// }).then(function(data) {
//     console.log(data)
//     result2 = data;
//     return 'hello3';
// }).then(function(data) {
//     console.log(data)
//     result3 = data;
//
// });
//
// then/catch continuation handlers are always called asynchronously so:
// console.log(result1, result2, result3) // undefined, undefined, undefined
