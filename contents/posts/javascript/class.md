---
title: "클래스(Class)"
date: 2023-05-29
update: 2023-06-01
tags:
  - JavaScript
  - Class
---

클래스 문법은 `ES6` 부터 등장한 문법으로, 기존에 생성자 함수로 프로토타입 기반 객체를 생성하는 패턴을 사용했을 때보다 몇 가지의 엄격한 규칙이 존재하며 추가적인 기능을 제공한다.

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

## 정적 메소드 / 프로토타입 메소드
- **정적 메소드**: 클래스 내부에 `static` 키워드를 붙혀서 메소드를 정의하면, `Person` 객체의 메소드가 된다.  
- **프로토타입 메소드**: 클래스 내부에 기본적으로 메소드를 정의하면, `Person.prototype` 의 메소드가 된다.  

## extends
클래스를 정의할 때 `extends` 키워드로 부모 클래스를 상속할 수 있다.

## constructor
`constructor` 는 기본적으로 클래스를 `new` 연산자로 실행했을 때 인스턴스를 생성하고 초기화하기 위한 특수한 메소드이다.  

### 암묵적인 생성자
클래스 내부에 기본적으로 `constructor` 메소드를 정의하지 않으면 기본 형태의 생성자가 암묵적으로 정의되는데, 상위 클래스가 있는지 없는지에 따라서 조금 다른 형태가 된다.

#### 상위 클래스가 없는 경우
빈 생성자가 암묵적으로 정의된다.  

```js{2}
class Animal {
  constructor() {}
}
```

#### 상위 클래스가 있는 경우
상위 클래스의 생성자를 실행하는 형태가 암묵적으로 정의된다.

```js{2-4}
class Rabbit extends Animal {
  constructor(...args) {
    super(...args); // 상위 클래스의 생성자 실행
  }
}
```
### 인스턴스 생성 과정
클래스를 `new` 연산자로 실행하면 다음 과정을 통해서 인스턴스가 생성된다.  
다만, `extends` 키워드로 상속한 상위 클래스가 있는지 없는지의 여부에 따라서 실행 과정의 깊이 차이가 존재한다.  

#### 상위 클래스가 없는 경우
1. `new` 연산자로 클래스를 호출한다.
2. 빈 객체가 생성되고 `constructor` 내부의 `this` 에 바인딩한다.  
3. `constructor` 메소드가 실행되어, `this` 에 프로퍼티를 추가한다.  
4. 완성된 인스턴스가 바인딩된 `this` 를 반환한다.  

#### 상위 클래스가 있는 경우  
1. `new` 연산자로 클래스를 호출한다.  
2. 서브 클래스의 `constructor` 메소드가 실행되고,  
`super` 키워드로 상위 클래스의 `constructor` 를 호출한다.  
3. 빈 객체가 생성되고 상위 클래스의 `constructor` 내부의 `this` 에 바인딩한다.  
4. 수퍼 클래스의 `constructor` 메소드가 실행되어, `this` 에 프로퍼티를 추가한다.  
5. 수퍼 클래스의 `constructor` 메소드는 완성된 인스턴스가 바인딩된 `this` 를 반환한다.  
그리고 서브 클래스의 `cosntructor` 로 실행 흐름이 돌아와서 서브 클래스의 생성자가 마저 실행된다.  
6. 생성자의 모든 처리가 끝나면 완성된 인스턴스가 바인딩된 `this` 를 반환한다.   

> **주의사항**  
상위 클래스가 존재하는 하위 클래스의 생성자를 명시적으로 정의한 경우에는 반드시 하위 클래스의 생성자의 최상단에 `super` 키워드를 사용해서 <b style="color: red">**상위 클래스의 생성자가 호출될 수 있게**</b>끔 해야한다!!  
`this` 에 바인딩되는 객체를 만드는 과정이 <b style="color: blue">**상위 클래스의 생성자를 호출하는 과정에서 발생**</b>하기 때문에, 상위 클래스의 생성자가 호출되지 않으면 서브 클래스의 `this` 에 바인딩 되는 객체가 생성되지 않기 때문이다.

## super
`super` 키워드는 함수처럼 호출하거나 식별자처럼 참조할 수 있는 두 가지 방법으로 사용할 수 있는 키워드이다.  

- **super() 호출**: 상위 클래스의 생성자를 호출한다.  
- **super.상위메소드() 참조**: 상위 클래스의 메소드를 호출한다.  

## 참고 자료
모던 자바스크립트 Deep Dive 25장 클래스  
[클래스 (코어 자바스크립트)](https://ko.javascript.info/classes)  