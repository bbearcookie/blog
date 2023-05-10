---
title: "스코프(Scope)"
date: 2023-05-09
update: 2023-05-09
tags:
  - JavaScript
  - Scope
---

## 정의
`스코프(Scope)` 는 **변수나 함수와 같은 자원에 부여된 이름 바인딩이 유효한 범위**이다. 즉, 자원에 접근 가능한 범위를 나타낸다. 프로그래밍에서 스코프라는 개념을 통해 다음과 같은 이점을 누릴 수 있다:
- 다른 스코프 내에서 같은 식별자 이름을 사용해도 `이름 충돌(name collision)` 이 발생하지 않는다.
- 자원에 대한 접근 범위를 제한할 수 있다.

## 범위
- **전역 스코프(Global Scope)**  
어느 위치에서든 접근 가능한 영역이다.  
실행 컨텍스트마다 하나만 존재한다.  
기본적인 built-in 함수들이 들어있다.  
- **지역 스코프(Local Scope)**  
함수나 블럭 내부의 영역이다.  
자기 자신이나 하위의 스코프에서만 접근 가능하다.  
`var` 키워드로 변수를 선언하면 같은 함수 내에서 접근 가능하다.
`let` 이나 `const` 키워드로 변수나 상수를 선언하면 같은 블럭 내에서 접근 가능하다.

## 기준
스코프를 어떤 기준으로 나눌거냐에 따라서 두 가지의 기준이 있다.

- **블록 레벨 스코프(Block-Level Scope)**  
블록 `{}` 을 기준으로 스코프를 나눈다.  
자바스크립트에서는 `let` 이나 `const` 키워드로 선언된 변수나 상수가 블록 레벨 스코프에 들어간다.
- **함수 레벨 스코프(Function-Level Scope)**  
함수를 기준으로 스코프를 나눈다.  
자바스크립트에서는 `var` 로 선언된 변수가 함수 레벨 스코프에 들어간다.

## 결정 방식
스코프를 언제 결정하느냐에 따라서 두 가지의 방식이 있다.

- **동적 스코프(Dynamic Scope)**  
함수가 호출되는 시점에 동적으로 스코프가 결정되는 방식이다.
- **렉시컬 스코프(Lexical scoping)**  
함수가 정의된 위치에 따라서 정적으로 스코프가 결정되는 방식이다.  
`정적 스코프(Static Scope)` 라고도 하며 자바스크립트를 비롯한 대부분의 프로그래밍 언어가 채택하는 방식이다.

## 스코프 체인
모든 스코프는 자신의 상위 스코프로 연결되어 있는데 이를 `스코프 체인(Scope Chain)` 이라고 한다.  
자바스크립트 엔진은 특정 식별자를 찾을 때 현재 스코프에서 먼저 찾고 없다면 상위 스코프로 올라가서 다시 찾는 과정을 반복한다.

### 예시
```js{12}
// Global Execution Context
var v0 = "v0"; // Global Scope
let l0 = "l0"; // Local Scope

// f1 Execution Context
function f1() {
  var v1 = "v1"; // f1 Local Scope
  let l1 = "l1"; // f1 Local Scope
  {
    var v2 = "v2"; // f1 Local Scope
    let l2 = "l2"; // Block Local Scope
    console.log(v0);
  }
}

f1();
```

위 코드에서 11번째 줄을 실행하면서 `v0` 을 찾는 과정은 다음과 같다:  

1. `Block Scope` 에 `v0` 이 존재하지 않는다. 따라서 상위 스코프를 찾는다.
2. `f1 Local Scope` 에 `v0` 이 존재하지 않는다. 따라서 상위 스코프를 찾는다.
3. 전역 스코프에 `v0` 이 존재하므로 값을 가져온다.

## 참고 자료
모던 자바스크립트 Deep Dive 13강 Scope  
[Scope (computer science)](https://en.wikipedia.org/wiki/Scope_(computer_science))  