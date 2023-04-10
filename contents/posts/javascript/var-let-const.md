---
title: "var, let, const"
date: 2023-03-03
update: 2023-03-03
tags:
  - JavaScript
  - Hoisting
---

## 변수의 선언, 초기화, 할당
변수(variable)란 <b>데이터를 저장하기 위해 프로그램에 의해 이름을 할당받은 메모리 공간</b>을 의미하는데 메모리 공간을 확보하고 값을 저장하는 데에는 몇 가지의 용어와 과정이 있다.

### 선언
메모리 공간을 특정한 이름을 가진 변수로 정의하는 것을 의미한다.
```js
var name; // 선언
```

### 초기화
변수의 초기의 값을 지정해 주는 것을 의미한다.
```js
var name = "cookie"; // 초기화
```

### 할당
이미 선언되어 있는 변수에 대입 연산자(=)를 사용하여 값을 지정해 주는 것을 의미한다.
```js
var name; // 선언
name = "cookie"; // 할당
```

## 자바스크립트의 변수
자바스크립트의 변수는 기본적으로 `var` 키워드로 선언할 수 있는데 몇 가지의 불편한 사항이 있었기에 ES6부터는 `let`과 `const` 키워드가 도입되었다. 이 키워드간에는 여러 차이점이 있는데 몇 가지의 관점에서 다른 점을 서술해보겠다.

## 중복 선언
`var`는 중복 선언이 가능하지만, `let`은 중복 선언이 불가능하다.
```js
var hello = "hello";
var hello = "rehello"; // (O)

let bye = "bye";
let bye = "rehello"; // (X) Cannot redeclare block-scoped variable 'bye'.
```

## 스코프
`var`는 함수 외부에서는 전역 범위로, 함수 내부에서는 함수 레벨 스코프로 동작한다.  
`let`은 블럭 레벨 스코프로 동작한다.  
그렇기 때문에 변수에 접근할 수 있는 범위가 다르다.
```js{9-12}
var v = "global"; // global scope

function func() {
  var v = "v"; // func scope
  let l = "l"; // func scope
  console.log(v); // v
  console.log(l); // l
  
  {
    var v = "vv"; // func scope
    let l = "ll"; // block scope
  }
  
  console.log(v); // vv
  console.log(l); // l
}

func();
console.log(v); // global
```
예를 들어 위 소스코드의 함수 내부의 블럭에서  
`"vv"` 값은 main scope 범위의 `v` 에 들어가게 된다.  
반면에 `"ll"` 값은 block scope 범위의 `l` 에만 들어가고  
main scope 범위의 `l` 에는 아무런 영향을 주지 않는 것을 알 수 있다.

```js{4}
var arr = [];

function makeFunction() {
  for (var i = 0; i < 5; i++) {
    arr[i] = function() {
      console.log(`${i}번째 요소입니다.`);
    }
  }

  console.log(i); // 5
}

makeFunction();
arr[0](); // 5번째 요소입니다.
arr[1](); // 5번째 요소입니다.
arr[2](); // 5번째 요소입니다.
arr[3](); // 5번째 요소입니다.
arr[4](); // 5번째 요소입니다.
```
이런 특징 때문에 `for` 문의 변수로 `var` 키워드를 사용하면 의도치 않는 문제가 발생하기도 한다.  
만약 자신이 몇 번째로 생성된 요소인지를 출력하는 함수를 반복문을 사용하여 만든다고 할 때   
`i` 는 `makeFunction` 함수의 스코프 범위에 존재하기 때문에 `for`루프마다 같은 참조 `i`를 갖게 되고  
결국 `arr[i]` 함수에서 `i`는 같은 참조를 사용하기 때문에 결과적으로 `for`문이 종료될 때의 `i` 값인 5가 출력되는 것을 알 수 있다.  

```js{4}
var arr = [];

function makeFunction() {
  for (let i = 0; i < 5; i++) {
    arr[i] = function() {
      console.log(`${i}번째 요소입니다.`);
    }
  }

  console.log(i); // 5
}

makeFunction();
arr[0](); // 0번째 요소입니다.
arr[1](); // 1번째 요소입니다.
arr[2](); // 2번째 요소입니다.
arr[3](); // 3번째 요소입니다.
arr[4](); // 4번째 요소입니다.
```
만약 `let` 을 사용한다면 for 루프마다 새로운 변수 `i` 가 선언되기 때문에 의도하던 기능을 구현할 수 있다.

## 호이스팅
`var`와 `let`은 호이스팅이 발생할 떄에도 차이가 있다.  
호이스팅이란 <b>함수나 변수의 선언 부분을 맨 위로 끌어올려 메모리 공간을 미리 할당하는 것</b>을 말하는데  
`var`로 선언한 변수의 경우에는 호이스팅 시 `undefined` 로 값을 초기화하지만  
`let`과 `const`로 선언한 변수의 경우에는 호이스팅 시 초기화하지 않는다.  

```js{2}
console.log(v); // undefined
console.log(l); // ReferenceError: Cannot access 'l' before initialization
func(); // 안녕하세요

var v = "hello";
let l = "bye"; 

function func() {
  console.log("안녕하세요");
}
```

### 일시적 사각지대(Temporal Dead Zone)
위 코드의 `2번째`을 보면 아직 초기화 되지 않은 값이라 접근할 수 없다는 에러를 확인할 수 있다.  
이처럼 `let`과 `const`로 선언한 변수의 경우에는 호이스팅이 되면서 변수는 선언이 되었지만 아직 초기화는 되지 않았기 때문에  
변수의 값에 접근할 수 없는 구간이 발생하게 되는데 이걸 일시적 사각지대라고 한다.  
위 소스코드에서는 `1번째` 줄부터 `5번째` 줄까지 변수 `l`에 대한 TDZ가 된다.

## let과 const
`const`는 한번 초기화 한 값을 더이상 재할당할 수 없다는 점을 제외하고는 `let`과 기능이 일치한다.

## 정리
||var|let|const|
|---|---|---|---|
|전역 스코프|O|X|X|
|함수 스코프|O|O|O|
|블럭 스코프|X|O|O|
|재할당|O|O|X|
|중복 선언|O|X|X|
|호이스팅시 초기화|O|X|X|

## 참고
https://developer.mozilla.org/ko/docs/Glossary/Hoisting
