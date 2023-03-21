---
title: "this"
date: 2023-03-06
update: 2023-03-06
tags:
  - JavaScript
---

자바스크립트에서의 모든 함수는 <b style="color: red">this</b>라는 객체를 가지고 있다.  
이 <b style="color: red">this 객체</b>는 함수가 호출되어서 <i><b>'함수 실행 컨텍스트가 생성되는 시점'</b></i>에 특정한 객체를 가리키도록 <b>바인딩</b>되는데 함수가 어떻게 호출되었는지에 따라서 바인딩 될 객체가 동적으로 결정된다.  

## 기본 바인딩
함수를 단독 실행하는 경우이다.  
이 때 `this`는 브라우저 환경이라면 `Window`를 가리키고 Node.js 환경이라면 `global` 객체를 가리킨다.  
```js
function showThis() {
  console.log(this); // 브라우저에서는 Window 객체가 되고 Node.js에서는 global 객체가 된다.
}

showThis();
```

다만 엄격모드에서는 전역객체는 제외되기 때문에 `undefined`가 된다.

```js
function showThis() {
  'use strict'; // 엄격모드
  console.log(this); // undefined
}

showThis();
```

## 암시적 바인딩
함수가 객체의 메소드로서 실행되는 경우이다.  
이 때 `this`는 <b style="color: red;">해당 함수를 호출한 객체</b>를 가리키게 된다.  
아래 코드의 <b>8번째 줄</b>에서의 showName 함수를 호출한 객체는
`{ name: "철수", showName: function }` 이므로 철수의 이름을 보여주는 것을 확인할 수 있다.  
그러나 <b>11번째 줄</b>에서의 showName 함수는 전역 객체가 호출했으므로 `this`는 전역 객체이다.
```js{8, 11}
const human = {
  name: "철수",
  showName: function () {
    console.log(`제 이름은 ${this.name} 입니다.`);
  }
}

human.showName(); // 제 이름은 철수 입니다.

const show = human.showName;
show(); // 제 이름은 undefined 입니다.
```

암시적 바인딩은 함수가 호출될 당시의 상황에 따라서 `this` 객체가 달라지기 때문에 유의해야 한다.  
아래 코드에서 <b>showName 함수</b>를 `doCallback`의 인자로 전달하고 그 안에서 실행하고 있는데 실행될 당시의 `callback` 함수는 전역 객체가 호출했기 때문에 `this`는 전역 객체이다.

```js{9}
const human = {
  name: "철수",
  showName: function () {
    console.log(`제 이름은 ${this.name} 입니다.`);
  }
}

function doCallback(callback) {
  callback(); // 제 이름은 undefined 입니다.
}

doCallback(human.showName);
```

## 명시적 바인딩
함수 내부의 `this`가 어떤 객체를 가리킬 것인지에 대해서 코드 작성자가 명시적으로 바인딩 하는 경우이다.  
`Function` 객체의 built-in 함수로 존재하는 `call`, `apply`, `bind` 메소드를 사용하면 명시적으로 정할 수 있다.

### call 
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

### apply
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

### bind
함수 내부에서 `this` 가 가리킬 객체를 바인딩하여 만든 새로운 함수를 반환한다.  
다만 한번 바인딩된 함수을 가지고 다시 바인딩할 수는 없다.  

```js{5-7}
function showYourName(age, height) {
  console.log(`제 이름은 ${this.name} 입니다. 나이는 ${age}세에 키는 ${height}cm입니다.`);
}

const man = { name: "철수" };
const woman = { name: "영희" };

let manFunc = showYourName.bind(man);
let womanFunc = showYourName.bind(woman);

manFunc(23, 180);
womanFunc(22, 165);

// 이미 바인딩 된 함수를 가지고 또 바인딩한 함수를 만들지는 못한다.
manFunc = manFunc.bind({ name: "짱구" }); 
womanFunc = womanFunc.bind({ name: "유리" });

manFunc(23, 180);
womanFunc(22, 165);
```

```js
제 이름은 철수 입니다. 나이는 23세에 키는 180cm입니다.
제 이름은 영희 입니다. 나이는 22세에 키는 165cm입니다.
제 이름은 철수 입니다. 나이는 23세에 키는 180cm입니다.
제 이름은 영희 입니다. 나이는 22세에 키는 165cm입니다.
```

## new 바인딩
자바스크립트의 `new` 키워드로 함수를 호출하면 새로운 객체가 생성되어 반환되는데  
함수 내부에서의 `this`는 새로운 객체를 가리키게 된다.  

```js
function Human(age, weight) {
  this.age = age;
  this.weight = weight;
  this.showAge = function () {
    console.log(this.age);
  }
}

const man = new Human(15, 50); // 나이가 15세인 객체 생성
const woman = new Human(20, 48); // 나이가 20세인 객체 생성

man.showAge(); // 15
woman.showAge(); // 20
```

## 바인딩 우선순위
1. new 바인딩
2. 명시적 바인딩
3. 암시적 바인딩
4. 기본 바인딩

## 화살표 함수
ES6부터 등장한 화살표 함수를 사용하면 자신의 `this`를 바인딩 하지 않는 대신에 화살표 함수를 둘러싸는 렉시컬 범위의 `this`가 사용되게 할 수 있다.

```js
const human = {
  name: '철수',
  showName: function () {
    setTimeout(() => {
      // 여기에서 this는 상위 렉시컬 범위에서의 this인 human이 된다.
      console.log(`제 이름은 ${this.name}입니다`); // 제 이름은 철수입니다
    }, 1000);
  }
}

human.showName();
```

만약 setTimeout의 인자로 들어가는 함수를 일반 함수로 정의했다면  
`this`는 호출 상황에 따라서 바인딩 되는 객체가 달라진다.

```js
const human = {
  name: '철수',
  showName: function () {
    setTimeout(function() {
      // 여기에서 this는 setTimeout API에 의해서 만들어진 새로운 객체가 된다.
      console.log(`제 이름은 ${this.name}입니다`); // 제 이름은 undefined입니다
    }, 1000);
  }
}

human.showName();
```


## 참고
https://www.youtube.com/watch?v=7RiMu2DQrb4