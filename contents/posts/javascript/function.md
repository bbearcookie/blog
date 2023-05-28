---
title: "함수(Function)"
date: 2023-05-27
update: 2023-05-27
tags:
  - JavaScript
  - Function
---

## 함수란?
프로그래밍에서 함수는 <b style="color: red">**일정한 동작을 수행하는 코드들의 집합**</b>이다.   

자바스크립트에서의 함수는 일급 객체의 특징을 가지며 `Function` 객체이다.

스코프, 실행 컨텍스트, 클로저, 생성자 함수에 의한 객체 생성, 메소드, this, 프로토타입, 모듈화 등의 다양한 개념이 모두 함수와 깊은 관련이 있으므로 자바스크립트에서 굉장히 중요한 핵심이라고 할 수 있다.

> #### 일급 객체의 특징
> - 무명의 리터럴로 생성할 수 있다. 즉, **런타임에 생성**이 가능하다.  
> - 변수나 **자료구조**에 저장할 수 있다.  
> - 함수의 **매개변수**에 전달할 수 있다.  
> - 함수의 **반환 값**으로 사용할 수 있다.  

## 함수 표현 방법
### 함수 리터럴
`function` 키워드로 함수를 표현하는 방법이다.

```js
function sum(a, b) {
  return a + b;
}
```

### 화살표 함수  
`ES6` 에서 등장한 화살표 함수 표현을 이용하는 방법이다.  

화살표 함수로 표현한 함수는 몇 가지의 특징을 가지고 있는데: 
- [this](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/this), [arguments](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/arguments), [super](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/super) 에 대한 자체 바인딩이 없고, [method](https://developer.mozilla.org/ko/docs/Glossary/Method) 로 사용할 수 없다.  
- [new.target](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/new.target) 키워드가 없다.  
- 함수이지만 자체적인 렉시컬 스코프를 갖지 않기 때문에 일반적으로 스코프를 지정할 때 사용하는 `call` `apply` `bind` 메소드를 사용할 수 없다.  
- 생성자로 사용할 수 없다.  
- [yield](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/yield) 키워드를 화살표 함수 내부에서 사용할 수 없다.  

```js
(a, b) => {
  return a + b;
}
```

### Function 생성자 함수 호출
`Function` 생성자 함수를 `new` 연산자로 호출해서 `Function` 인스턴스를 생성하는 방법이다. 다만, 클로저를 생성하지 않고 보안 문제와 성능 문제가 발생할 수 있는 일반적이지 않은 방법이다.

```js
new Function('a', 'b', 'return a + b;');
```

## 함수 정의 방법
위 3가지의 함수 표현을 어떤 방법으로 사용하냐에 따라서  
**함수 선언문(function declaration)**과 **함수 표현식(function expression)**이 된다.

### 함수 선언문
함수 리터럴로 표현하는 방법으로, 반드시 함수의 이름을 적어야 한다.

```js
console.log(sum(10, 20)); // 30

function sum(a, b) {
  return a + b;
}
```

- **호이스팅시**: 함수 호이스팅이 발생하여 해당 식별자가 함수라는 점을 알 수 있으므로, 함수 정의 구문 이전에도 호출이 가능하다.

### 함수 표현식
`var` `let` `const` 등의 키워드로 선언한 변수에 함수의 표현 내용을 대입하는 방법이다.  

```js
const sum1 = function(a, b) { return a + b; } // 함수 리터럴을 사용해서 함수 표현식을 사용할 때에는 function의 이름을 생략할 수 있다.
const sum2 = (a, b) => { return a + b; }
const sum3 = new Function('a', 'b', 'return a + b;');

console.log(sum1(10, 20)); // 30
console.log(sum2(10, 20)); // 30
console.log(sum3(10, 20)); // 30
```

- **호이스팅시**: 변수 호이스팅과 동일하게 동작하며, 해당 식별자가 아직 함수인지 알 수 없으므로 함수 정의 구문 이전에 호출이 불가능하다.

## 즉시 실행 함수(IIFE)
`즉시 실행 함수(Immediately Invoked Function Expression)` 는 정의되자마자 즉시 실행되는 함수이며, 함수의 정의 부분을 `()` 로 감싸주고, 정의한 함수에 대해서 호출하는 방식으로 사용한다.  

```js
(function(a, b) {
  return a + b;
})(10, 20);
```

## 함수 객체
자바스크립트에서 함수는 `Function` 객체이고, 기본적인 프로퍼티나 `this` 바인딩과 관련이 있는 `apply` `call` `bind` 등의 메소드를 가지고 있다.  

### arguments 프로퍼티  
`arguments` 객체는 함수에 전달된 인수에 해당하는 `Array` 형태의 객체이다.  
다만, ES6 부터는 [Rest Parameters](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/rest_parameters) 구문이 더 권장되는 방법이라고 한다.

#### arguments
```js
function func1(a, b, c) {
  console.log(arguments[0]); // 1
  console.log(arguments[1]); // 2
  console.log(arguments[2]); // 3
}

func1(1, 2, 3);
```

#### Rest Parameters
```js
function sum(...theArgs) {
  let total = 0;
  for (const arg of theArgs) {
    total += arg;
  }
  return total;
}

console.log(sum(1, 2, 3)); // 6
```

### length 프로퍼티  
함수가 기대하는 인자의 수를 나타낸다.  
```js
function func1() {}
function func2(a, b) {}

console.log(func1.length); // 0
console.log(func2.length); // 2
```

### name 프로퍼티  
함수의 이름을 반환한다.  
```js
function doSomething() {}
console.log(doSomething.name); // "doSomething"
```

## 참고 자료
모던 자바스크립트 Deep Dive 12장 함수, 18장 함수와 일급객체  
[Function (MDN)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function)  
[함수 선언 (MDN)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/function)  
[함수 표현식 (MDN)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/function)  
[화살표 함수 (MDN)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/Arrow_functions)  
[IIFE (MDN)](https://developer.mozilla.org/ko/docs/Glossary/IIFE)  
[일급 객체 (위키백과)](https://ko.wikipedia.org/wiki/%EC%9D%BC%EA%B8%89_%EA%B0%9D%EC%B2%B4)  
[arguments 객체 (MDN)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/arguments)  