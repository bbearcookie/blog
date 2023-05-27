---
title: "함수"
date: 2023-03-06
update: 2023-03-06
tags:
  - JavaScript
  - Function
---

## 함수(Function)
함수는 <b style="color: red">일정한 동작을 수행하는 코드들의 집합</b>이다.  
자바스크립트에서의 함수는 `Function` 객체이다.

### 일급객체(First-Class Object)
자바스크립트에서의 함수는 일급객체이기 때문에 다음과 같은 특징을 가지고 있다.
- 함수는 변수에 담을 수 있다.
- 함수를 인자로 전달할 수 있다.
- 반환값으로 함수를 전달할 수 있다.

```js
// 함수는 변수에 담을 수 있다.
const func1 = function () {
  console.log("함수를 변수에 담을 수 있어요");
}

// 함수를 인자로 전달할 수 있다.
function func2(param) {
  param();
}

// 반환값으로 함수를 전달할 수 있다.
function func3() {
  return function () {
    console.log("반환값으로 함수를 전달할 수 있어요");
  }
}

func1();
func2(function() {
  console.log("함수를 인자로 전달할 수 있어요");
});
func3()();
```

```
함수를 변수에 담을 수 있어요
함수를 인자로 전달할 수 있어요
반환값으로 함수를 전달할 수 있어요
```

## 함수를 정의하는 방법
자바스크립트에서 함수를 정의하는 방법으로는 크게 <b>함수 선언</b>과 <b>함수 표현식</b>의 방법이 있다. 

### 함수 선언(Function Declaration)
함수를 정의하는 기본적인 방식이다.  
- 호이스팅이 발생하므로 함수의 내용이 정의되기 이전에도 호출할 수 있다.

```js
func(); // 함수 선언

function func() {
  console.log("함수 선언");
}
```

### 함수 표현식(Function Expression)
함수를 정의해서 변수에 대입하는 방법이다.  
- 호이스팅시 변수의 내용이 아직 없거나 `undefined`로 초기화 되어 있기 때문에  
함수의 내용이 완전히 정의되기 전인 일시적 사각지대에서는 호출이 불가능하다.

```js{}
func(); // ReferenceError: Cannot access 'func2' before initialization

const func = function () {
  console.log("함수 표현식");
}
```

- `function` 키워드를 사용하거나 화살표 함수를 사용하는 방법이 있다.

```js
const func1 = function () {
  console.log("function 키워드");
}

const func2 = () => {
  console.log("화살표 함수");
}

func1(); // function 키워드
func2(); // 화살표 함수
```

### Function 생성자
자바스크립트에서는 함수도 객체이기 때문에 `new` 연산자로 `Function` 객체를 생성하는 방법이다.  
다만 일부 자바스크립트 최적화를 적용할 수 없으며 권장하지 않는 방법이라고 한다.  
```js
const func = new Function("console.log('안녕하세요')");
func(); // 안녕하세요
```

## 익명 함수(Anonymous Function)
<b>함수 선언 방식</b>으로는 정의할 때에는 반드시 즉시 실행 함수(IIFE, Immediately-Invoked Function Expression) 여야 한다.  
<b>함수 표현식 방식</b>으로 정의할 때에는 변수의 이름을 지정해주므로 함수의 이름은 지정하지 않아도 상관없다.
```js
(function() {
  console.log("함수 선언");
})();


const func = function() {
  console.log("함수 표현식");
}

func();
```

## 참고
https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions
