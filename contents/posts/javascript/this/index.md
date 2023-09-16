---
title: "this"
date: 2023-06-25
update: 2023-06-25
tags:
  - JavaScript
  - this
---

## this가 무엇인가?
`this` 는 **자신이 속한 객체**를 가리키거나, **자신이 생성하려는 인스턴스**를 가리키는 자기 참조 변수이다.  

`this` 가 왜 필요한지 알아보자면, 객체지향 프로그래밍에서의 객체는 객체의 정보나 상태를 나타내는 <b style="color: blue">**프로퍼티**</b>와 동작을 나타내는 <b style="color: blue">**메소드**</b>로 구성된다. 자바스크립트는 프로토타입 기반의 객체지향 프로그래밍을 지원하므로 메모리 효율성을 위해서 각 객체의 내부에 메소드를 새롭게 할당하는 것이 아니라 <b style="color: red">**여러 객체가 공유하는 프로토타입에 메소드를 보관하여 사용**</b>한다.  

그런데 메소드를 호출한 객체가 정확하게 누구인지를 메소드 내부에서 파악할 수 있어야 자기 자신에 대한 프로퍼티를 사용할 수 있는데, 그렇기 때문에 일종의 **자신에 대한 참조 변수**가 필요하다. 바로 이런 역할을 `this` 가 해주는 것이다.  

## 실행 컨텍스트에서의 this
[실행 컨텍스트 포스트](/execution-context) 에서 작성했듯이 자바스크립트 코드가 실행되기 전에는 먼저 코드를 평가하는 단계가 수행되고, 이 과정에서 실행 컨텍스트가 생성된다.  

실행 컨텍스트에는 렉시컬 환경의 정보나 `this` 에 바인딩되는 값 등 다양한 정보가 존재하는데 전역 실행 컨텍스트든, 함수 실행 컨텍스트든 상관없이 <b style="color: red">**코드 평가 과정에서 `this` 에 바인딩 될 값을 컨텍스트 내부의 슬롯에 보관**</b>하게 된다.

## this가 가리키는 값
함수를 호출하면 먼저 코드 평과 과정을 통해서 함수 실행 컨텍스트가 생성되는데, **함수를 호출한 방식**에 따라서 `this` 에 바인딩되는 값이 결정된다.

### 1. 일반 함수 호출(기본 바인딩)
함수를 단독 실행하는 경우로, `this` 는 전역 객체를 가리키게 된다.  
따라서 브라우저 환경에서는 `Window` 를, Node.js 환경에서는 `global` 을 가리킨다.  

이는 사실 `showThis()` 함수는 `window.showThis()` 로 암묵적으로 전역 객체의 메소드로써 호출되었기 때문에 발생하는 현상이다.

```js
function showThis() {
  console.log(this); // 브라우저에서는 Window 객체가 되고 Node.js에서는 global 객체가 된다.
}

showThis(); // window.showThis()
window.showThis();
```

다만 엄격모드에서의 전역 객체는 제외되기 때문에 `undefined` 가 된다.

```js
function showThis() {
  'use strict'; // 엄격모드
  console.log(this); // undefined
}

showThis();
```

### 2. 메소드 호출(암시적 바인딩)
함수가 객체의 메소드로써 실행되는 경우로, `this` 는 **해당 함수를 호출한 객체**를 가리키게 된다. 즉, <b style="color: red">**". 연산자" 앞에 작성한 객체**</b>를 가리킨다.  

```js{10}
var name = '전역';

const human = {
  name: '철수',
  showName: function () {
    console.log(`제 이름은 ${this.name} 입니다.`);
  },
};

human.showName(); // 제 이름은 철수 입니다.
```

#### 유의해야 할 점 1
메소드를 새로운 식별자에 할당하거나, 다른 함수의 인자로 전달해서 사용할 경우에도 마찬가지로 **". 연산자" 앞에 작성한 객체**를 가리킨다.

예를 들어서 아래 코드의 *11번째 줄* 과 *15번째 줄* 의 코드는 전역 객체의 메소드로써 실행되었기 때문에 <b style="color: red">**`this` 에 바인딩 되는 값은 전역 객체**</b>이다: 

```js{11, 15}
var name = '전역';

const human = {
  name: '철수',
  showName: function () {
    console.log(`제 이름은 ${this.name} 입니다.`);
  },
};

function doCallback(callback) {
  callback();
}

const show = human.showName;
show(); // 제 이름은 전역 입니다.
doCallback(human.showName); // 제 이름은 전역 입니다.
```

#### 유의해야 할 점 2
객체의 깊이가 깊은 경우에 헷갈릴 수 있는데, 실행하려는 함수를 메소드로 가진 객체인 **". 연산자" 바로 앞에 작성한 객체를 가리킨다**.  

즉, 아래 코드에서 실행된 `show()` 함수 내부의 `this` 에 바인딩되는 값은 <b style="color: red">**baz 객체**</b>이다.

```js{6-11, 15}
const foo = {
  value: 10,
  name: 'foo',
  bar: {
    value: 20,
    baz: {
      value: 30,
      show: function () {
        console.log(`이름: ${this.name}, 값: ${this.value}`);
      },
    },
  },
};

foo.bar.baz.show(); // 이름: undefined, 값: 30
```


### 3. 명시적 바인딩
함수 내부의 `this`가 어떤 객체를 가리킬 것인지에 대해서 **코드 작성자가 명시적으로 바인딩**하는 경우이다.  

`Function` 객체의 프로토타입에 built-in 함수로 존재하는 `call`, `apply`, `bind` 메소드를 사용하면 명시적으로 정할 수 있다.

#### call 
함수 내부에서 `this` 가 가리킬 객체를 지정하여 함수를 호출한다.  
<b>첫번째 인자</b>로는 지정할 `this` 객체를 보내고  
<b>두번째 인자</b>부터는 함수의 매개변수로 보낼 값을 담는다.  

```js
function showYourName(age, height) {
  console.log(`제 이름은 ${this.name} 입니다. 나이는 ${age}세에 키는 ${height}cm입니다.`);
}

const man = { name: "철수" };
const woman = { name: "영희" };

showYourName.call(man, 23, 180); // 제 이름은 철수 입니다. 나이는 23세에 키는 180cm입니다.
showYourName.call(woman, 22, 165); // 제 이름은 영희 입니다. 나이는 22세에 키는 165cm입니다.
```

#### apply
함수 내부에서 `this` 가 가리킬 객체를 지정하여 함수를 호출한다.  
<b>첫번째 인자</b>로는 지정할 `this` 객체를 보내고  
<b>두번째 인자</b>로 함수의 매개변수로 보낼 값을 배열 형태로 담는다.  

```js
function showYourName(age, height) {
  console.log(`제 이름은 ${this.name} 입니다. 나이는 ${age}세에 키는 ${height}cm입니다.`);
}

const man = { name: "철수" };
const woman = { name: "영희" };

showYourName.apply(man, [23, 180]); // 제 이름은 철수 입니다. 나이는 23세에 키는 180cm입니다.
showYourName.apply(woman, [22, 165]); // 제 이름은 영희 입니다. 나이는 22세에 키는 165cm입니다.
```

#### bind
함수 내부에서 `this` 가 가리킬 객체를 바인딩하여 만든 새로운 함수를 반환한다.  
다만 <b style="color: red">**한번 바인딩된 함수을 가지고 다시 바인딩할 수**</b>는 없다.  

```js{10-11, 20-21}
function showYourName(age, height) {
  console.log(`제 이름은 ${this.name} 입니다. 나이는 ${age}세에 키는 ${height}cm입니다.`);
}

// ==================================================================
// 철수와 영희의 정보를 가지고 있는 객체를 this에 바인딩 한 함수를 만든다.
// ==================================================================
const man = { name: '철수' };
const woman = { name: '영희' };
let manFunc = showYourName.bind(man);
let womanFunc = showYourName.bind(woman);
manFunc(23, 180); // 제 이름은 철수 입니다. 나이는 23세에 키는 180cm입니다.
womanFunc(22, 165); // 제 이름은 영희 입니다. 나이는 22세에 키는 165cm입니다.

// ==================================================================
// 이미 바인딩 된 함수를 가지고 또 바인딩한 함수를 만들지는 못한다.
// ==================================================================
manFunc = manFunc.bind({ name: '짱구' });
womanFunc = womanFunc.bind({ name: '유리' });
manFunc(23, 180); // 제 이름은 철수 입니다. 나이는 23세에 키는 180cm입니다.
womanFunc(22, 165); // 제 이름은 영희 입니다. 나이는 22세에 키는 165cm입니다.
```

### 4. new 바인딩
생성자 함수를 `new` 연산자로 호출하면 함수 내부의 `this` 는 새롭게 생성하려는 객체를 나타낸다.

```js
function Human(age, weight) {
  // this = {};
  this.age = age;
  this.weight = weight;
  this.showAge = function () {
    console.log(this.age);
  };
  // return this;
}

const man = new Human(15, 50); // 나이가 15세인 객체 생성
const woman = new Human(20, 48); // 나이가 20세인 객체 생성

man.showAge(); // 15
woman.showAge(); // 20
```

이는 클래스 문법의 생성자에도 동일하게 적용된다:
```js
class Human {
  constructor(age, weight) {
    // this = {};
    this.age = age;
    this.weight = weight;
    // return this;
  }

  showAge() {
    console.log(this.age);
  }
}

const man = new Human(15, 50); // 나이가 15세인 객체 생성
const woman = new Human(20, 48); // 나이가 20세인 객체 생성

man.showAge(); // 15
woman.showAge(); // 20
```

> **바인딩 우선순위**  
`this` 에 바인딩을 여러 방식으로 겹쳐서 진행할 경우에는  
다음과 같은 우선순위에 따라서 `this` 의 값이 결정된다.    
> > new 바인딩 > 명시적 바인딩 > 암시적 바인딩 > 기본 바인딩

## 비동기 작업
타이머나 이벤트 핸들러같은 비동기 작업에 전달하는 콜백 함수도 자신만의 `this` 바인딩을 가질 수 있기 때문에 의도치 않은 동작을 하는 주범이 될 수 있다.  

이런 경우에는 `bind()` 나 화살표 함수를 사용하는 방법으로 해결할 수 있다.

### setTimeout
`setTimeout` 함수에 들어간 콜백 함수는 WebAPI 에 의해서 암묵적으로 일반 함수로 호출된다. 따라서 `this` 는 <b style="color: red">**Window 객체**</b>가 된다.

```js
const human = {
  name: '철수',
  showName: function () {
    setTimeout(function () {
      console.log(`제 이름은 ${this.name}입니다`); // 제 이름은 undefined입니다
      console.log(this); // Window
    }, 1000);
  },
};

human.showName();
```

#### 해결 방법 1
**화살표 함수**를 사용한다면, 해당 콜백 함수는 자체적인 `this` 바인딩 값을 갖지 않기 때문에 상위 스코프의 `this` 값을 사용한다.

```js
const human = {
  name: '철수',
  showName: function () {
    setTimeout(() => {
      console.log(`제 이름은 ${this.name}입니다`); // 제 이름은 철수입니다
      console.log(this); // { name: '철수', showName: [Function: showName] }
    }, 1000);
  },
};

human.showName();
```

#### 해결 방법 2
**bind()**를 사용하여 `this` 에 바인딩 될 값을 직접 정해줄 수도 있다.

```js
const human = {
  name: '철수',
  showName: function () {
    setTimeout(function () {
      console.log(`제 이름은 ${this.name}입니다`); // 제 이름은 철수입니다
      console.log(this); // { name: '철수', showName: [Function: showName] }
    }.bind(this), 1000);
  },
};

human.showName();
```

### DOM 이벤트 핸들러
DOM 이벤트를 등록하는 방법은 3가지가 있는데, 각 방법에 따라서 `this` 에 바인딩되는 값이 달라질 수 있다.

#### 1. 어트리뷰트 방식
HTML 요소의 어트리뷰트 중 이벤트와 관련이 있는 속성을 지정하는 방식이다.  

`handleClick()` 함수는 이벤트 핸들러에 의해서 암묵적으로 일반 함수로 호출되어 `this` 는 <b style="color: red">**Window 객체**</b>가 된다.

```html
<!DOCTYPE html>
<html>
  <body>
    <button id="attribute" type="button" onclick="handleClick()">Attribute</button>
    <script>
      function handleClick() {
        console.log(this); // Window
      }
    </script>
  </body>
</html>
```

단, 이벤트 핸들러를 호출할 때 인수로 전달한 `this` 는 해당 <b style="color: red">**이벤트를 바인딩한 DOM 요소**</b>이다.  

```html
<!DOCTYPE html>
<html>
  <body>
    <button type="button" onclick="handleClick(this)">Attribute</button>
    <script>
      function handleClick(button) {
        console.log(button); // <button type="button" onclick="handleClick(this)">Attribute</button>
        console.log(this); // Window
      }
    </script>
  </body>
</html>
```

#### 2. 프로퍼티 방식
DOM 노드 객체는 이벤트에 대응하는 이벤트 핸들러 프로퍼티를 가지고 있는데, 그 프로퍼티에 이벤트 핸들러 함수를 바인딩하는 방식이다.  
`this` 는 <b style="color: red">**이벤트를 바인딩한 DOM 요소**</b>이다. 

단, 화살표 함수를 사용하면 상위 스코프의 this인 `Window` 를 가리킨다.

```html
<!DOCTYPE html>
<html>
  <body>
    <button type="button">Property</button>
    <script>
      const $button = document.querySelector('button');
      $button.onclick = function (e) {
        console.log(this); // <button type="button">Property</button>
      };
      $button.onclick = (e) => {
        console.log(this); // Window
      };
    </script>
  </body>
</html>
```

#### 3. addEventListener 메소드 방식
`EventTarget` 객체의 프로토타입에 존재하는 `addEventListener` 메소드를 사용하여 이벤트 핸들러 함수를 바인딩하는 방식이다.  
`this` 는 <b style="color: red">**이벤트를 바인딩한 DOM 요소**</b>이다.  

단, 화살표 함수를 사용하면 상위 스코프의 this인 `Window` 를 가리킨다.  

````html
<!DOCTYPE html>
<html>
  <body>
    <button type="button">addEventListener</button>
    <script>
      const $button = document.querySelector('button');
      $button.addEventListener('click', function (e) {
        console.log(this); // <button type="button">addEventListener</button>
      });
      $button.addEventListener('click', (e) => {
        console.log(this); // Window
      });
    </script>
  </body>
</html>
````

## 참고 자료
모던 자바스크립트 Deep Dive 22장 this, 40장 이벤트   
[this (MDN)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/this)  
[setTimeout (MDN)](https://developer.mozilla.org/ko/docs/Web/API/setTimeout)  
[[10분 테코톡] 🥦 브콜의 This](https://www.youtube.com/watch?v=7RiMu2DQrb4)  