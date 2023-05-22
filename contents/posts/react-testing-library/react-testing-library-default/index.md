---
title: "React Testing Library"
date: 2023-05-22
update: 2022-05-22
tags:
  - react
  - react-hook-form
series: "리액트 컴포넌트의 테스팅을 위한 React Testing Library"
---

## @testing-library
[@testing-library](https://www.npmjs.com/org/testing-library) 는 <b style="color: red">**사용자 중심의 관점에서 UI 컴포넌트를 테스트**</b>하는 것을 도와주는 라이브러리이다.  

우리가 UI 요소에 대한 테스트를 하려면 `DOM` 요소를 **생성**하고, 특정 요소에 대해서 **이벤트를 발생**시키고, 결과값이 어떻게 되는지를 **검사**해야 하는데 `@testing-library` 는 이런 부분들을 도와주는 라이브러리라고 할 수 있다.

`@testing-library` 패키지는 `@testing-library/dom`, `@testing-library/react`, `@testing-library/angular` 등의 다양한 UI 프레임워크에 대한 패밀리 패키지를 가지고 있다.

### 철학
`@testing-library` 는 사용자 관점에서 UI 컴포넌트를 테스트하기 때문에 테스트 코드를 실제 사용자가 애플리케이션과 상호작용하는 방식 그대로를 구현하는 방식으로 작성해야 한다.  

그렇기에 컴포넌트 내부의 상태나 메소드와 같은 <b style="color: red">**구현 세부 사항에 의존하여 테스트 코드를 작성하는 것은 지양**</b>해야 한다. 

> **구현 세부 사항이란?**  
사용자는 어떤 컴포넌트에 저장된 상태나 이름과 같은 정보는 관심이 없고 자신의 행동으로 변화하는 화면 자체에만 관심이 있을 뿐이다.  
구현 세부 사항은 **사용자가 관심 없는 부분**들을 의미하며 컴포넌트 내부의 상태, 컴포넌트의 메소드, 메소드의 생명주기 등이 있다.

> **구현 세부 사항에 의존한다면 생기는 문제점**  
나중에 해당 컴포넌트를 리팩토링한다고 해보자.  
그 컴포넌트가 수행하는 동작은 동일하지만 상태나 내부의 메소드같은 부분에 변경이 발생하게 되는데, 변경된 부분에 의존하는 테스트 코드가 존재한다면 기능에 이상이 없음에도 테스트 코드가 실패하는 경우가 발생한다.

> **Enzyme**  
`Enzyme` 는 `Airbnb` 에서 개발한 테스팅 라이브러리로 구현 세부 사항을 중점적으로 테스트하는 것에 특화되었다.  
`react-testing-library` 가 등장하기 전에는 많이 사용되었다고 한다.  

## React Testing Library
`React Testing Library` 는 `DOM Testing Library` 를 기반으로 하여 추가적으로 리액트 컴포넌트와 동작하는 몇몇의 API가 추가된 라이브러리이다.

`create-react-app` 으로 리액트 프로젝트를 세팅하면 자동적으로 설치되며 가상 DOM에 원하는 컴포넌트를 렌더링하고, 검사할 요소를 가져오고, 이벤트를 발생시키는 동작을 지원한다.  

`React Testing Library` 자체는 Test Runner가 아니기 때문에 테스트 코드를 찾고, 실행하고, 검사해주는 라이브러리가 추가적으로 필요한데 기본적으로 `Jest` 를 권장한다고 한다.

### 테스트 단계
`React Testing Library` 로 UI 컴포넌트를 테스트하는 과정은 다음과 같다:

1. `render()` 로 컴포넌트를 가상 DOM에 그린다.  
2. `get()` `query()` `find()` 와 같은 Query 를 이용해서 검사를 수행할 DOM 요소를 가져온다.  
3. `fireEvent()` `userEvent()` 와 같은 이벤트 발생 API를 호출해서 DOM 요소에 이벤트를 발생시킨다.  
4. `expect()` API 를 통해서 특정 DOM 요소에 대한 내용을 검사한다.  

## 예시 코드
내부적으로 `count` 상태를 가지고 있고 `+` 버튼과 `-` 버튼을 통해서 값을 1씩 증감하는 `Counter` 컴포넌트에 대한 테스트 코드의 예시이다.

### 컴포넌트
아래 소스코드를 보면 `div` 요소에 대해서 `role` 속성을 주고 있다.  
이는 웹 접근성을 위한 속성인데 여기서 입력한 속성은 테스트 코드에서 `ByRole` API로 요소를 가져올 때 활용할 수도 있다.  

`role` 에 들어가는 다양한 속성에 대한 정보는 [W3C](https://www.w3.org/TR/wai-aria/#role_definitions) 문서에서 확인할 수 있다.

```tsx{11}
import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  const decrement = () => setCount(prev => prev - 1);
  const increment = () => setCount(prev => prev + 1);

  return (
    <>
      <div role="banner">{count}</div>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </>
  );
};

export default Counter;
```

### 테스트 코드
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

describe('Counter test', () => {
  it('should render Counter', () => {
    render(<Counter />);

    const target = screen.getByRole('button', { name: '+' });
    userEvent.click(target); // + 버튼 클릭 이벤트 발생

    expect(screen.getByText('1')).toBeInTheDocument(); // 화면에 1 이라는 내용을 텍스트로 가진 요소가 있는지 검사
    expect(screen.getByRole('banner').textContent).toBe('1'); // role이 banner인 요소의 내용이 '1' 인지 검사
  });
});
```


## 참고 자료
[Introduction (공식 문서)](https://testing-library.com/docs/)  
[Guiding Principles (공식 문서)](https://testing-library.com/docs/guiding-principles)  
[Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details)  
[React Testing Library 사용법 (DaleSeo)](https://www.daleseo.com/react-testing-library/)  
[초심자를 위한 React Testing Library (Tecoble)](https://tecoble.techcourse.co.kr/post/2021-10-22-react-testing-library/)  