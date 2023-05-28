---
title: "클래스(Class)"
date: 2023-05-29
update: 2023-05-29
tags:
  - JavaScript
  - Class
---

클래스 문법은 `ES6` 부터 등장한 문법으로, 기존에 생성자 함수로 프로토타입 기반 객체를 생성하는 패턴을 사용했을 때보다 몇 가지의 엄격한 규칙이 추가되며 추가적인 기능을 제공한다.

## 클래스의 특징
1. 클래스는 반드시 `new` 연산자로 호출해야 한다.  
2. 상속을 지원하는 `exnteds` 와 `super` 키워드를 지원한다.  
3. `let` 과 `const` 로 변수를 선언했을 때와 같은 호이스팅이 발생한다.  
4. 클래스는 함수로 평가된다. 또한 생성자 함수를 `extends` 로 상속하는 것도 가능하다.  
5. 클래스 내의 모든 코드에는 암묵적으로 `strict mode` 가 적용된다.  
6. 클래스 내에 포함된 모든 메소드는 `[[Enumerable]]` 속성의 값이 `false` 이므로, 열거되지 않는다.  

## 예시 코드
```js
class Person {
  constructor(name) {
    this.name = name;
  }

  showName() { // 프로토타입 메소드
    console.log(`제 이름은 ${this.name} 이에요.`);
  }

  static sayHello() { // 정적 메소드
    console.log("안녕하세요 저는 사람이에요.");
  }
}

class Developer extends Person {
  constructor(name) {
    super(name);
    this.job = '개발자';
  }

  showJob() {
    console.log(`제 직업은 ${this.job} 이에요.`);
  }
}

const human1 = new Developer('김철수');

Person.sayHello(); // 안녕하세요 저는 사람이에요.
human1.showName(); // 제 이름은 김철수 이에요.
human1.showJob(); // 제 직업은 개발자 이에요.
```

### 정적 메소드 / 프로토타입 메소드
- **정적 메소드**: 클래스 내부에 `static` 키워드를 붙혀서 메소드를 정의하면, `Person` 객체의 메소드가 된다.  
- **프로토타입 메소드**: 클래스 내부에 기본적으로 메소드를 정의하면, `Person.prototype` 의 메소드가 된다.  

### constructor  
클래스 내부에 기본적으로 `constructor` 메소드를 정의하지 않으면  다음과 같은 형태로 생성자가 암묵적으로 정의된다:  
```js
class Rabbit extends Animal {
  // 자체 생성자가 없는 클래스를 상속받으면 자동으로 만들어짐
  constructor(...args) {
    super(...args);
  }
}
```


모던 자바스크립트 Deep Dive 25장 클래스  
[클래스 (코어 자바스크립트)](https://ko.javascript.info/classes)  