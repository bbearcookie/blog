---
title: "Promise"
date: 2023-03-08
update: 2023-03-08
tags:
  - JavaScript
---

## ES6 이전의 비동기 처리
ES6 이전에는 자바스크립트로 비동기 작업의 처리를 할 때 콜백 함수를 인자로 전달하는 방식으로 비동기 작업의 처리 순서를 보장했었다.  

이런 방식은 코드를 읽기 난잡해지는 **콜백 지옥**의 문제와 **에러 핸들링을 유연하게 하기 어렵다**는 문제가 있었다.

### 콜백 지옥
```js
callback1(function(value1) {
  callback2(value1, function(value2) {
    callback3(value2, function(value3) {
      callback4(value3, function(value4) {
        callback5(value4, function(value5) {
          // 콜백 1~5 함수의 내용을 순차적으로 진행했지만 코드가 난잡하다.
        });
      });
    });
  });
});
```

### 에러 핸들링
```js
try {
  setTimeout(function() {
    throw new Error('Error');
  }, 100);
} catch (e) {
  // setTimeout의 콜백으로 전달된 함수에서 발생한 에러를 캐치하지 못한다.
  console.log(e);
}
```

## Promise
`Promise` 객체는 비동기 작업이 **미래에 성공적으로 이행하거나 실패했을 때의 결과 값**을 나타낸다.  
비동기 작업은 보통 즉시 완료되지 않기 때문에 결과를 반환받기까지 시간이 걸리는데 프로미스를 사용하면 비동기 메소드를 마치 동기 메소드처럼 값을 반환받을 수 있다.  
다만 최종 결과 자체를 반환하는 것이 아니라 <b style="color: red">**미래 어느 시점에 값을 반환하겠다는 약속**</b>을 반환한다.

### 상태
`Promise` 객체는 세 가지의 상태를 가진다.  
- **대기(pending):** Promise 객체가 생성된 초기 상태이다.
- **이행(fulfilled):** 비동기 처리가 성공적으로 완료된 상태이다.
- **거부(rejected):** 비동기 처리가 실패한 상태이다.  

### 생성자
`Promise` 생성자 함수는 내부적으로 `resolve` 함수와 `reject` 함수를 매개변수로 갖는 `executor` 함수를 인자로 받는데 이 함수의 내용은 Promise 객체가 생성되는 즉시 실행이 된다.  

실행자 함수 내부에서는 원하는 비동기 작업을 처리하면 되는데  
성공했다면 `resolve` 함수를 호출해 상태를 `fulfilled`로 만들고  
실패했다면 `reject` 함수를 호출해 상태를 `rejected`로 만들면 된다.
```js
new Promise((resolve, reject)) => {
  if () {
    resolve('비동기 작업의 결과');
  } else {
    reject(new Error('작업 실패'));
  }
});
```

### Promise.resolve()
`Promise.resolve(value)` 함수는 상태가 `fulfilled` 로 이행된 Promise를 반환한다.  
만약 인자가 값이라면 그 값으로 이행된 Promise를 반환하고, 인자 자체가 Promise라면 인자 자체를 반환한다.

```js
const pro = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (true) resolve('성공');
    else reject(new Error('실패'));
  }, 500);
});

const r1 = Promise.resolve('나는 값이에요'); // 값을 인자로 전달
const r2 = Promise.resolve(pro); // Promise를 인자로 전달
r1.then(value => console.log(value));
r2.then(value => console.log(value));
```

```
나는 값이에요
성공
```

### Promise.reject()
`Promise.reject()` 함수는 상태가 `rejected` 로 거부된 Promise를 반환한다.

```js{5}
const e1 = Promise.reject(new Error('거부된 프로미스'));

e1
  .then(value => console.log('여기서 then의 콜백 함수는 동작하지 않아요'))
  .catch(err => console.log(err))
```

```
Error: 거부된 프로미스
    at Object.<anonymous> (d:\bear\test.js:77:27)
    at Module._compile (internal/modules/cjs/loader.js:1085:14)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1114:10)
    at Module.load (internal/modules/cjs/loader.js:950:32)
    at Function.Module._load (internal/modules/cjs/loader.js:790:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:76:12)
    at internal/main/run_main_module.js:17:47

```


### then, catch, finally
Promise 객체의 프로토타입에는 `then` `catch` `finally` 등의 메소드가 존재한다.  
이 메소드는 모두 `Promise` 객체를 반환하기 때문에 체이닝해서 사용할 수 있다.  
- **then:** `Promise`가 `fulfilled` 상태가 되면 내부의 콜백 함수가 실행된다.
- **catch:** `Promise`가 `rejected` 상태가 되면 내부의 콜백 함수가 실행된다.
- **finally:** `Promise`의 성공 여부와는 상관 없이 `pending` 상태에서 벗어나기만 하면 인자로 보낸 콜백 함수가 실행된다.

```js{3}
const pro = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (true)
      resolve('성공');
    else
      reject(new Error('실패'));
  }, 500);
});

pro
  .then(value => console.log(value)) // executor 함수에서 resolve 함수를 호출하면 동작
  .catch(err => console.error(err)) // executor 함수에서 reject 함수를 호출하면 동작
  .finally(() => console.log('프로미스 종료')); // executor 함수에서 resolve 함수나 reject 함수를 호출하면 동작
```

```
성공
프로미스 종료
```

```
Error: 실패
    at d:\bear\test.js:56:12
    at new Promise (<anonymous>)
    at Object.<anonymous> (d:\bear\test.js:52:13)
    at Module._compile (internal/modules/cjs/loader.js:1085:14)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1114:10)
    at Module.load (internal/modules/cjs/loader.js:950:32)
    at Function.Module._load (internal/modules/cjs/loader.js:790:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:76:12)
    at internal/main/run_main_module.js:17:47
프로미스 종료
```

### 프로미스 체이닝
`then` `catch` 메소드는 `Promise` 객체를 반환해야 하기 때문에 콜백 함수 내부에서 비동기 작업을 수행한 뒤 반환된 값을 `Promise` 객체로 바꾸는 과정이 필요하다.  
- **값을 반환한 경우:** 해당 값을 결과값으로 이행한 프로미스를 반환한다.
- **값을 반환하지 않은 경우:** `undefined`를 결과값으로 이행한 프로미스를 반환한다.
- **오류가 발생한 경우:** 그 오류를 결과값으로 거부한 프로미스를 반환한다.
- **이미 이행한 프로미스를 반환한 경우:** 그 프로미스의 결과값을 자신의 결과값으로 하여 이행한 프로미스를 반환한다.
- **이미 거부한 프로미스를 반환한 경우:** 그 프로미스의 결과값을 자신의 결과값으로 하여 거부한 프로미스를 반환한다.
- **대기중인 프로미스를 반환한 경우:** 그 프로미스의 이행 여부와 결과값을 따른다.  

이렇게 `Promise` 객체를 반환하기 때문에 비동기 처리가 끝난 뒤에 다른 비동기 처리를 이어서 작업하도록 연결할 수 있다.

```js
const pro = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (true) resolve('성공');
    else reject(new Error('실패'));
  }, 500);
});

const resolved = Promise.resolve('이미 이행한 프로미스');
const rejected = Promise.reject(new Error('이미 거부한 프로미스'));
const pending = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('대기중인 프로미스');
  }, 2000);
});

pro.
  then(value => {
    console.log(value);
    return '값 반환'; // 값을 반환한 경우
  }).then(value => {
    console.log(value);
                     // 값을 반환하지 않은 경우
  }).then(value => {
    console.log(value);
    return resolved; // 이미 이행한 프로미스를 반환한 경우
  }).then(value => {
    console.log(value);
    return rejected; // 이미 거부한 프로미스를 반환한 경우
  }).catch(err => {
    console.log(err);
    return pending; // 대기중인 프로미스를 반환한 경우
  }).then(value => {
    console.log(value);
  });
```

```
성공
값 반환
undefined
이미 이행한 프로미스
Error: 이미 거부한 프로미스
    at Object.<anonymous> (d:\bear\test.js:38:33)
    at Module._compile (internal/modules/cjs/loader.js:1085:14)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1114:10)
    at Module.load (internal/modules/cjs/loader.js:950:32)
    at Function.Module._load (internal/modules/cjs/loader.js:790:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:76:12)
    at internal/main/run_main_module.js:17:47
(node:33504) PromiseRejectionHandledWarning: Promise rejection was handled asynchronously (rejection id: 1)
대기중인 프로미스
```

## 참고
https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise  
https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/then  
