---
title: "실행 컨텍스트(Execution Context)"
date: 2023-05-10
update: 2023-05-10
tags:
  - JavaScript
  - Execution-Context
---

## 정의
실행 컨텍스트는 `JavaScript(ECMAScript)` 로 구현한 **코드의 런타임 평가를 추적하는데 사용**되는 사양 장치이다.

`JavaScript` 에서 실행 컨텍스트라는 개념을 통해 다음과 같은 기능을 수행할 수 있다:
- 코드의 **실행 순서**를 결정한다.
- 변수나 함수 등의 **식별자를 등록하고 관리**한다.
- **렉시컬 환경**의 정보를 기억하고 상위 스코프와 하위 스코프와의 연결 관계를 나타내어 **스코프 체이닝**이 가능하게 한다.
- `this` 에 **바인딩** 되는 값을 관리한다.

## 내용
실행 컨텍스트에는 여러 정보가 들어있다.

### 환경 레코드
실행 컨텍스트에는 코드 중첩 구조를 기반으로 **식별자를 특정 변수나 함수에 연결하기 위해**서 환경 레코드 정보가 들어있다.

- **선언적 환경 레코드(Declarative Environment Records)**  
*스코프의 범위* 를 나타내는 레코드이다.  
`variable`, `constant`, `let`, `class`, `module`, `import`, `function declarations` 등의 선언으로 만들어진 식별자가 무엇이 있고 값은 어떻게 되는지의 내용이 들어있다.
- **전역 환경 레코드(Global Environment Record)**  
`built-in` 함수와 변수, 전역 객체의 속성, 최상단에서의 정의 등의 내용이 들어 있는 레코드이다.
논리적으로 하나의 레코드이지만, 내부적으로 `Object Environment Record` 와 `Declarative Environment Records` 가 합성된 형태이다.

> 전역 환경 레코드 내부의 `[[GlobalThisValue]]` 슬롯에 `this` 가 바인딩된다.
- **함수 환경 레코드(Function Environment Record)**  
함수 내의 최상단 스코프에 들어 있는 식별자 정보를 나타내는 레코드이다.

> 함수 환경 레코드 내부의 `[[ThisValue]]` 슬롯에 `this` 가 바인딩된다.

### 외부 렉시컬 환경에 대한 참조 
`외부 렉시컬 환경에 대한 참조(Outer Lexical Environment Reference)` 는 해당 실행 컨텍스트를 생성한 소스코드를 포함하는 **상위 코드의 렉시컬 환경**을 가리킨다. 즉, 상위 스코프를 가리킨다.  

예를 들어서 아래와 같은 소스코드에서 `func` 함수의 실행 컨텍스트의 외부 렉시컬 환경에 대한 참조는 자신을 생성하게 한 전역 실행 컨텍스트가 된다.

```js
function func() {
  let n1 = 10;
}

func();
```

## 평가와 실행
자바스크립트 코드는 `평가(evaluation)` 와 `실행(execution)` 단계를 거쳐서 실행된다.

- **평가(evaluation)**  
**실행 컨텍스트가 생성되는 과정**이다. 자바스크립트 엔진은 평가 과정에서 변수나 함수 등의 선언문을 먼저 실행하여, 실행 컨텍스트가 관리하는 렉시컬 환경의 환경 레코드에 변수나 함수의 식별자 정보를 등록한다.  
- **실행(execution)**  
평가 과정에서 생성된 실행 컨텍스트의 내용을 토대로 자바스크립트 엔진이 소스코드를 **런타임 환경에서 실행**하는 과정이다.

## 생성
실행 컨텍스트가 생성되는 경우는 다음과 같다.  

- **전역 코드**: 전역 코드가 평가되면 전역 실행 컨텍스트가 생성된다.  
- **함수 코드**: 함수 코드가 평가되면 함수 실행 컨텍스트가 생성된다.  
- **eval 코드**: 엄격 모드에서 `eval` 코드가 평가되면 `eval` 실행 컨텍스트가 생성된다.  
- **모듈 코드**: 모듈 코드가 평가되면 모듈 실행 컨텍스트가 생성된다.

## 실행 컨텍스트 스택
![Execution Context Stack](./execution-context-stack.png)

프로그램이 실행되거나 함수가 호출되어서 새로운 컨텍스트가 생성되면 스택에 `push` 하고 이후에 함수나 프로그램이 종료되면 필요 없어진 실행 컨텍스트를 스택에서 `pop` 한다.

따라서 현재 실행중인 코드의 실행 컨텍스트를 알기 위해서는 스택의 최상단에 존재하는 컨텍스트를 확인하면 된다.  

## 참고 자료
모던 JavaScript Deep Dive 23장 실행 컨텍스트  
[ECMAScript Specification](https://tc39.es/ecma262)  
[Environment Record](https://velog.io/@shroad1802/environment-record)  
[Understanding the Execution Context in JavaScript](https://coralogix.com/blog/understanding-the-execution-context-in-javascript/)  
