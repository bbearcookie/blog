---
title: "클로저"
date: 2023-03-01
update: 2023-03-01
tags:
  - JavaScript
  - Closure
---

## 클로저(Closure)란?
<b style="color:red">함수와, 함수가 선언된 어휘적 환경(Lexical Environment)</b>의 조합이다.  
자바스크립트의 스코프는 함수를 호출할 때 결정되는 것이 아니라  
함수를 어디서 선언하였느냐에 따라서 결정되는 랙시컬 스코프(Lexical Scope)인데  
만약 내부의 어떤 함수를 반환하는 함수가 있을 때 외부 함수의 호출이 종료되면 외부 함수의 스코프에 할당된 변수도 메모리에서 제거가 된다.  
그러나 실제로 코드를 작성해보면 내부 함수에서 외부 함수의 변수에 여전히 접근이 가능하다는 것을 알 수 있는데  
이는 클로저는 그 함수가 선언된 어휘적 환경을 가지고 있기 때문이다.

## 예시
```js
function makeAdder(x) {
  var y = 1;
  return function(z) {
    y = 100;
    return x + y + z;
  };
}

var add5 = makeAdder(5);
var add10 = makeAdder(10);
//클로저에 x와 y의 환경이 저장됨

console.log(add5(2));  // 107 (x:5 + y:100 + z:2)
console.log(add10(2)); // 112 (x:10 + y:100 + z:2)
//함수 실행 시 클로저에 저장된 x, y값에 접근하여 값을 계산
```
위 코드에서 `add5` 와 `add10` 에는 각각의 클로저가 들어가는데  
하나는 `x=5` 이고 하나는 `x=10` 인 클로저이다.  
그 클로저에 `y=2` 를 인자로 해서 호출하면  
각각 내부 함수에서 외부 함수의 값이 다르다는 사실을 알 수 있는데  
이는 `add5` 와 `add10` 에 함수의 내용만이 담기는 게 아니라  
그 함수가 선언된 어휘적 환경이 함께 담겨있기 때문이다. 

## 참고
https://developer.mozilla.org/ko/docs/Web/JavaScript/Closures
