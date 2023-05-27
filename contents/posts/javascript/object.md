---
title: "객체(Object)"
date: 2023-05-27
update: 2023-05-27
tags:
  - JavaScript
  - Object
---

자바스크립트 언어의 타입은 **원시 값**과 **객체**로 나뉜다.  
**원시 값이 아닌 타입**은 모두 `Object` 타입을 프로토타입 체인의 최상단에 놓기 때문에 `Array` 나 `Function` 같은 타입도 모두 객체에 해당된다.  

자바스크립트에서는 `Object` 타입을 통해 복잡한 엔티티를 표현하고, 프로토타입이라는 개념을 통해서 객체지향 패러다임을 구현한다.

> **원시 값**  
`boolean` `null` `undefined` `number` `bigint` `string` `symbol` 등이 있다.

## 객체 형태
자바스크립트에서 객체는 `key-value` 형태로 여러 프로퍼티나 메소드를 표현한다.  
따라서 객체를 가장 기본적인 형태인 객체 리터럴로 표현하자면 아래와 같이 생겼다:  

```js
let kim = {
  name: '김철수',
  age: 20,
  showAge: function() { // 함수 프로퍼티
    console.log(`저는 ${this.age}세 입니다.`);
  },
  showName() { // 메소드
    console.log(`제 이름은 ${this.name}입니다.`);
  }
}

console.log(kim.name); // 김철수
kim.showAge(); // 저는 20세 입니다.
kim.showName(); // 제 이름은 김철수입니다.
```

위 `kim` 객체가 가지고 있는 프로퍼티는 `name`, `age`, `showAge()`  이고  
가지고 있는 메소드는 `showName()` 이다.  

여기서 주의할 점은 `showAge()` 는 ES6에 등장한 메소드 정의 구문을 이용하지 않았기 때문에 메소드가 아니라 단순히 **함수를 값으로 가진 프로퍼티**라는 점이다.  

### 표기법
객체 내부의 프로퍼티는 점 표기법이나 괄호 표기법으로 가져올 수 있다.  
```js
kim.name // 점 표기법
kim["name"] // 괄호 표기법
```

### delete
객체 내부의 프로퍼티는 `delete` 연산자로 제거할 수 있다.
```js
delete kim.name;
```

### in
객체 내부에 프로퍼티가 존재하는지의 여부는 `in` 연산자로 확인할 수 있다.
```js
console.log("name" in kim);
```

## 프로퍼티 속성
객체 내부의 각각의 프로퍼티에는 프로퍼티의 값, 값의 갱신 가능 여부, 열거 가능 여부, 재정의 가능 여부 등의 다양한 속성 정보가 들어있다.  

### 데이터 프로퍼티
- **value**: 프로퍼티 키를 통해 프로퍼티 값에 접근하면 반환되는 값  
- **writable**: 프로퍼티 값의 변경 가능 여부  
- **enumerable**: 프로퍼티의 열거 가능 여부  
- **configurable**: 프로퍼티의 재정의 가능 여부  

데이터 프로퍼티에 대해서는 `Object.getOwnPropertyDescriptor()` 함수를 통해서 조회할 수 있다.  
```js
let person = {
  name: 'Lee',
  age: 20
};

console.log(Object.getOwnPropertyDescriptor(person, 'name'));
console.log(Object.getOwnPropertyDescriptor(person, 'age'));

// { value: 'Lee', writable: true, enumerable: true, configurable: true }
// { value: 20, writable: true, enumerable: true, configurable: true }
```

### 접근자 프로퍼티
- **get**: 접근자 프로퍼티를 통해 데이터 프로퍼티의 값을 읽을 때 호출되는 함수  
- **set**: 접근자 프로퍼티를 통해 데이터 프로퍼티의 값을 저장할 때 호출되는 함수  
- **enumerable**: 프로퍼티의 열거 가능 여부  
- **configurable**: 프로퍼티의 재정의 가능 여부  

접근자 프로퍼티는 `get` 이나 `set` 키워드를 붙혀서 객체의 내부에 프로퍼티를 정의하여 사용한다.

```js
let person = {
  firstName: 'Shin',
  lastName: 'Jjang-go',

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },

  set fullName(name) {
    [this.firstName, this.lastName] = name.split(' ');
  },
};

console.log(person.fullName); // Shin Jjang-go
person.fullName = '신 짱구';
console.log(person.fullName); // 신 짱구
```

## 프로퍼티 정의
`Object.defineProperty()` 함수를 사용하면 객체에 새로운 프로퍼티를 추가하거나 기존의 프로퍼티의 속성을 수정할 수 있다.  

```js
let person = {
  name: 'Lee',
  age: 20
};

Object.defineProperty(person, 'name', { value: 'Kim', enumerable: false });
Object.defineProperty(person, 'job', { value: 'developer', writable: true });

console.log(Object.getOwnPropertyDescriptor(person, 'name'));
console.log(Object.getOwnPropertyDescriptor(person, 'age'));
console.log(Object.getOwnPropertyDescriptor(person, 'job'));

// { value: 'Kim', writable: true, enumerable: false, configurable: true }
// { value: 20, writable: true, enumerable: true, configurable: true }
// { value: 'developer', writable: true, enumerable: false, configurable: false }
```

## 객체 생성
자바스크립트에서 객체를 생성하기 위해서는 객체 리터럴 방식, `Object` 빌트인 함수, 생성자 함수나 클래스를 `new` 연산자로 실행하는 방법이 있다.

### 객체 리터럴
중괄호 `{}` 를 사용해 그 안에 객체의 프로퍼티를 넣어주는 방식이다.  

```js
let kim = { 
  name: "김철수",
  showName() {
    console.log(`제 이름은 ${this.name}입니다.`);
  }
};
```

### Object.create()
`Object.create(proto, propertiesObject)` 함수를 이용해서 객체를 생성하는 방법이다.

> **proto**: 생성될 객체 내부의 `__proto__` 가 가리키게 할 객체를 전달한다.  
> **propertiesObject**: 생성될 객체 내부의 프로퍼티와 속성을 입력한다. (선택사항)

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const kim = Object.create(Person.prototype, {
  name: { writable: true, configurable: true, value: '김철수' },
  age: { writable: true, configurable: true, value: 20 },
});

console.log(kim.name); // 김철수
console.log(kim.age); // 20
```

### new 연산자
`new` 연산자로 생성자 함수를 실행하는 방법이다.

#### 생성자 함수
자바스크립트에서는 함수를 `new` 연산자로 실행할 경우 그 함수를 생성자 함수라고 하여 내부적으로 `this` 객체를 생성하고 반환하는 작업을 암묵적으로 수행한다.  

만약 생성자 함수에서 반환하는 값이 있다면 그 값을 `this` 에 바인딩해서 사용한다.

```js
function Person(name, age) {
  // this = {}; // 암시적으로 this 객체가 생성됨.

  this.name = name;
  this.age = age;
  this.showName = function() {
    console.log(`제 이름은 ${this.name} 입니다.`);
  };

  // return this; // 암시적으로 this 객체가 반환됨.
}

let kim = new Person("김철수", 20);
let lee = new Person("이미리", 25);

kim.showName(); // 제 이름은 김철수 입니다.
lee.showName(); // 제 이름은 이미리 입니다.
```

#### Object 생성자
직접 정의한 생성자 함수가 아니라 기본적으로 존재하는 `Object` 객체를 생성하는 방법도 있다.

```js
let kim = new Object();

kim.name = "김철수";
kim.showName: function() { console.log(`제 이름은 ${this.name} 입니다.`); };
```

## 참고 자료
모던 자바스크립트 Deep Dive 16장 프로퍼티 어트리뷰트  
[JavaScript 객체 기본](https://developer.mozilla.org/ko/docs/Learn/JavaScript/Objects/Basics)  
[JavaScript의 타입과 자료구조 (MDN)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures)  
[Object.create() (MDN)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/create)  
[Object.defineProperty() (MDN)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)  
[객체 (코어 자바스크립트)](https://ko.javascript.info/object)  
[프로퍼티 getter와 setter (코어 자바스크립트)](https://ko.javascript.info/property-accessors)  