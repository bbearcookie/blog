---
title: "클로저"
date: 2023-05-17
update: 2023-06-03
tags:
  - JavaScript
  - Closure
---

## [[Environment]]
자바스크립트 엔진이 어떤 함수 코드를 평가하면 함수 객체가 생성되게 된다.  
함수 객체의 내부 슬롯에는 `[[Environment]]` 가 존재하는데, 여기에는 함수 객체를 생성한 **당시에 실행중이었던 실행 컨텍스트의 렉시컬 환경**이 저장된다.  

즉, 어떤 함수 코드가 평가되는 시기에 실행중이던 실행 컨텍스트의 렉시컬 환경은 결국 함수의 입장에서는 자신을 감싸는 상위 스코프가 되기 때문에 **상위 스코프의 내용**의 참조가 `[[Environment]]` 내부 슬롯에 저장된다는 것이다.  

이런 특징은 클로저를 이해하는데 도움이 된다.

## 클로저(Closure)란?
MDN 문서에 따르면 `클로저` 는 **함수와, 함수가 선언된 렉시컬 환경의 조합**이다.  

문자를 그대로 읽으면 난해하게 들리는데 조금 더 풀어서 이야기하면 **함수의 내부에 중첩되어 정의된 함수가 있고, 중첩 함수가 외부 함수의 렉시컬 환경에 존재하는 자원에 접근하면서, 외부 함수보다 오래동안 살아남는 그런 함수**다.

## 예시 코드
```js
function makeFunc() {
  let name = "Mozilla";

  function displayName() {
    alert(name);
  }

  return displayName;
}

let myFunc = makeFunc();
myFunc();
```

위 코드에서 `displayName()` 함수는 함수 내부에 선언된 중첩 함수이면서 외부 함수의 변수인 `name` 에 접근하고 있다. 그러므로 클로저이다.

### 의문점
분명히 `makeFunc()` 함수는 한번 호출된 이후에 내부 함수인 `displayName()` 을 반환하고 생명 주기를 다하여 실행 컨텍스트가 소멸된다.  
그런데 내부 함수인 `displayName()` 는 어떻게 이미 소멸한 실행 컨텍스트의 렉시컬 환경에 대해서 접근할 수 있는 것일까?

### 해답
이는 누군가가 참조하고 있는 렉시컬 환경같은 **메모리 공간을 가비지 콜렉터가 함부로 제거하지 않기 때문**이다.  
`makeFunc()` 실행 컨텍스트의 렉시컬 환경은 `displayName()` 이 참조하고 있기 때문에 `makeFunc()` 의 생명 주기가 다 해서 실행 컨텍스트가 제거된다고 해도 누군가에 의해서 참조되고 있는 렉시컬 환경은 아직 제거되지 않는다.

## 클로저의 활용 사례
### 은닉화  
클로저를 이용하여 내부 변수나 함수를 숨길 수 있다.  
아래 예시 코드를 살펴보면, `_count` 변수는 직접 접근하지 못하도록 은닉되어 있다.  

```js
function Counter() {
  let _count = 0;

  function getCount() { return _count; }
  function increase() { _count++; }
  function decrease() { _count--; }

  return { getCount, increase, decrease };
}

let counter = Counter();

counter.increase();
counter.increase();
counter.increase();
console.log(counter.getCount()); // 3
console.log(counter._count); // undefined
```

## 의도치 않은 동작
사실 클로저를 이해하는 것이 중요한 이유가 클로저를 직접적으로 활용하려는 것 보다 의도치 않은 동작을 이해하고 버그를 잘 잡기 위해서이다.   

예를 들어서 다음과 같은 문제의 코드를 보자:

```js
function func() {
  let i = 0;
  for (i = 0; i < 5; i++) {
    setTimeout(function () {
      console.log(i);
    }, 100);
  }
}
func();
```

```
5
5
5
5
5
```

위 코드가 `0, 1, 2, 3, 4` 를 출력할 것이라고 생각했다면 의도치 않은 동작을 하게 된 셈이다.  

`setTimeout()` 의 콜백 함수는 외부 변수 `i` 를 참조하는 클로저이다.  
그런데 콜백 함수가 동작하는 시점에는 이미 반복문이 종료되어 있고, `i` 의 값이 5가 되어 있는 상태이기 때문에 모두 5를 출력하게 되는 것이다.  

이런 현상을 해결하기 위해서는 루프마다 클로저를 만들어서 콜백 함수에서의 참조하는 `i` 의 값을 다르게 해야 하는데, 크게 두 가지 방법이 있다.

### 즉시 실행 함수
즉시 실행 함수의 인자로 `i` 의 값을 전달하는 방법이다.  
이 경우 `setTimeout()` 의 콜백 함수는 즉시 실행 함수의 인자로 보낸 값을 참조하기 때문에 의도한 동작을 하게 된다.  

```js
function func() {
  let i = 0;

  for (i = 0; i < 5; i++) {
    (function(number) {
      setTimeout(function () {
        console.log(number);
      }, 100);
    })(i);
  }
}
func();
```

```
0
1
2
3
4
```

### let 키워드
반복문 블록 내부에 변수를 `let` 키워드로 선언해서, 루프마다 새로운 `i` 를 선언하는 방법이다.

```js
function func() {
  for (let i = 0; i < 5; i++) {
    setTimeout(function () {
      console.log(i);
    }, 100);
  }
}
```


## 참고 자료
모던 JavaScript Deep Dive 23장 실행 컨텍스트, 24장 클로저  
[MDN 클로저](https://developer.mozilla.org/ko/docs/Web/JavaScript/Closures)  
