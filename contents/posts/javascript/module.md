---
title: "모듈"
date: 2023-05-26
update: 2023-05-26
tags:
  - JavaScript
  - Module
  - CommonJS
  - ESM
---

자바스크립트가 만들어진지 얼마 되지 않았을 때에는 스크립트의 크기도 작고 기능도 단순했기 때문에 모듈 시스템이 존재하지 않았다.  

그런데 `node.js` 와 같은 자바스크립트 런타임 환경이 등장하는 등 자바스크립트가 활용되는 곳이 점차 많아지고 기능도 복잡해지면서 코드를 여러 개의 파일로 분할해야 할 필요성이 대두되었다.

노드 환경에서는 `CommonJS(CJS)` 라는 것을 기본 모듈 시스템으로 채택해서 사용하고 있었고, 이후에 `ES6` 버전에 들어서는 브라우저에서 사용할 수 있는 모듈 시스템인 `ECMAScript Module(ESM)` 이 등장하게 되었다.  

이번 글에서는 `CommonJS` 와 `ESM` 의 사용 방법이나 차이점에 대해서 정리해 보고자 한다.  

## CommonJS
`node.js` 에서 기본적으로 사용되는 모듈 시스템이다.  
`require()` 함수를 통해서 외부의 모듈을 가져오고, `module` 객체를 통해서 모듈을 내보낼 수 있다.  

### 내보내기
```js
const add = (a, b) => a + b;
const minus = (a, b) => a - b;

const calculator = {
  add,
  minus,
};

module.add = add;
module.minus = minus;
module.exports = calculator;
```

### 가져오기
`CommonJS` 에서는 `require()` 함수에 정확한 확장자 명을 주지 않아도 정상적으로 작동하는데, 이는 `require()` 함수가 자체적으로 순회하면서 파일을 찾아주기 때문이다. 다만 성능에는 좋지 않은 영향을 준다고 한다.

```js
const calculator = require('./calculator');
const { add, minus } = require('./calculator');

console.log(`1 + 2 = ${calculator.add(1, 2)}`);
console.log(`5 + 10 = ${add(5, 10)}`);
console.log(`15 - 3 = ${minus(15, 3)}`);
```

## ECMAScript Module
`ES6` 에서 등장한 표준 모듈 시스템으로, 브라우저, `node.js`, `Deno` 등 다양한 런타임 환경에서 사용할 수 있다.  
`import` 키워드를 통해서 외부의 모듈을 가져오고, `export` 키워드를 통해서 모듈을 내보낼 수 있다.

`<script>` 태그로 가져올 때는 `type="module"` 속성을 줘야 한다.

### 내보내기
```js
export const add = (a, b) => a + b;
export const minus = (a, b) => a - b;

const calculator = {
  add,
  minus,
};

export default calculator;
```

### 가져오기
`ESM` 모듈을 가져올 때 주의해야할 점이 있는데, 반드시 <b style="color: red">**확장자 명을 붙혀야한다**</b>는 점이다!!  

`VSCode` 의 자동완성 기능을 사용하다 보면 간혹 확장자 명을 붙여주지 않아서 모듈을 정상적으로 가져올 수 없던 경우가 있었는데 이 점을 유의해야 할 것 같다.

#### js 파일에서
```js
import calculator, { add, minus } from './calculator.js';

console.log(`1 + 2 = ${calculator.add(1, 2)}`);
console.log(`5 + 10 = ${add(5, 10)}`);
console.log(`15 - 3 = ${minus(15, 3)}`);
```

#### html 파일에서
```html
<html>
  <head>
    <script type="module">
      import calculator, { add, minus } from './calculator.js';
      
      console.log(`1 + 2 = ${calculator.add(1, 2)}`);
      console.log(`5 + 10 = ${add(5, 10)}`);
      console.log(`15 - 3 = ${minus(15, 3)}`);
    </script>
  </head>
</html>
```

### 특징
1. **모듈은 HTTP 또는 HTTPS 프로토콜을 통해서만 동작함**  
로컬에서 단순히 html 파일을 열어서 `file://` 프로토콜을 사용하면 모듈이 동작하지 않는다.  
모듈을 사용하기 위해서는 반드시 HTTP 나 HTTPS 프로토콜을 통해야 하며, `Live Server` 나 `Vite` 같이 런타임 환경을 제공해주는 도구가 필요하다.  
2. **모듈 스코프**  
모듈은 자신만의 스코프가 존재한다. 따라서 모듈 내에서 `var` 키워드로 자원을 선언하더라도 외부에 영향을 주지 않는다.  
3. **this 값**  
모듈 최상위 레벨에서의 `this` 의 값은 `undefined` 이다.  
일반 스크립트의 `this` 는 전역 객체였던 점과 대조되는 부분이다.   
4. **단 한 번만 평가됨**  
동일한 모듈이 여러 곳에서 여러 번 `import` 해서 사용되더라도 모듈은 최초 호출시 단 한 번만 실행된다.  
5. **지연 실행**  
모듈 스크립트는 항상 지연 실행되기 때문에 `defer` 속성과 동일하게 동작한다.  
따라서 HTML 문서가 완전히 준비된 이후에야 모듈 스크립트가 실행된다.  
6. **strict 모드로 동작함**

## 가짜 import
```ts
import { Component } from './Component';
```
`React` 로 개발했었을때 위와 같은 `import` 문을 자주 사용했었다. 생긴 것은 `ESM` 처럼 생겼지만 사실 확장자 명이 정확하게 입력되지 않았는데도 컴포넌트를 정상적으로 불러와졌기에 `ESM` 은 아니다.  

`TypeScript` 나 `Babel` 같은 트랜스파일러를 사용하면 `ESM` 처럼 생긴 `import` 를 자체적으로 `require()` 함수를 호출하는 구문으로 변경하기 때문에 위와 같은 코드가 정상 작동했던 것이다. [(22:03)](https://youtu.be/mee1QbvaO10?t=1323)

## Node.js
`Node.js` 에서의 모듈 시스템은 기본적으로 `commonJS` 를 사용한다.  
다만, `package.json` 에 `{ "type": "module" }` 옵션을 추가하면 `ESM` 을 사용하도록 설정할 수 있다.  

또 설정과는 별개로 `.cjs` 확장자에 대해서는 `commonJS` 로 동작하고, `.mjs` 확장자에 대해서는 `ESM` 으로 동작한다.


## 참고 자료
모던 자바스크립트 Deep Dive 48장 모듈  
[require vs import 문법 비교 (CommonJS vs ES6) (Inpa)](https://inpa.tistory.com/entry/NODE-%F0%9F%93%9A-require-%E2%9A%94%EF%B8%8F-import-CommonJs%EC%99%80-ES6-%EC%B0%A8%EC%9D%B4-1)  
[코어 자바스크립트 모듈](https://ko.javascript.info/modules-intro)  
[FECONF 2022 [B4] 내 import 문이 그렇게 이상했나요?](https://www.youtube.com/watch?v=mee1QbvaO10)  