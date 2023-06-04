---
title: "Event"
date: 2023-05-23 01:00
update: 2022-05-23
tags:
  - react
  - react-testing-library
series: "리액트 컴포넌트의 테스팅을 위한 React Testing Library"
---

`DOM Testing Library` 가 가상 DOM에 그린 요소에 대해서 특정한 이벤트를 동작시키기 위해서는 `fireEvent` 나 `userEvent` API 를 사용할 수 있다.  

- **fireEvent**: 컴퓨터의 관점에서 실제로 DOM 이벤트를 발생시킨다.  
- **userEvent**: 사용자의 상호작용을 그대로 시뮬레이션해서 이벤트를 발생시킨다.  
예를 들어 어떤 `disabled` 되어 있는 버튼에 대해서 `click` 이벤트를 발생시킨다고 할 때 사용자는 그 버튼을 클릭할 수 없으므로 해당 이벤트를 발생하지 않는다.  

[공식 문서](https://testing-library.com/docs/user-event/intro/) 에서는 보통 `userEvent` 를 사용하되, 아직 구현 되지 않은 이벤트에 대한 테스팅을 진행해야 하는 경우에만 `fireEvent` 를 사용하는 것을 권장한다고 한다.

> `user-event` 는 14 버전에서 큰 변화를 겪었다고 한다.  
그렇기에 13.5 버전과 14 버전에서의 사용법은 차이가 있을 수 있다.

## userEvent
### 초기화
`user-event` 의 14 버전을 기준으로 설명하자면, `user-event` 를 사용하기 위해서는 먼저 컴포넌트를 `render()` 하기 전에 `userEvent.setup()` 메소드를 호출해줘야 한다.

```ts
// inlining
test('trigger some awesome feature when clicking the button', async () => {
  const user = userEvent.setup()
  render(<MyComponent />)

  await user.click(screen.getByRole('button', {name: /click me!/i}))

  // ...assertions...
})
```

### 이벤트 발생
이벤트를 실제로 발생하기 위해서는 초기화 한 `userEvent` 객체의 이벤트 발생 메소드를 실행하면 된다.  

중요한 점은 `userEvent` 객체의 이벤트 발생 메소드는 14 버전부터 전부 `Promise` 객체를 반환하기 때문에 `await` 키워드를 통해서 <b style="color: red">**이벤트를 발생시키는 비동기 작업이 완료될 때까지 기다린 후**</b>에 검증 과정을 수행해야 한다는 것이다.
```ts
await user.click(screen.getByRole('button', {name: /click me!/i}))
```

### 예시 코드
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

describe('Counter test', () => {
  it('should render Counter', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const target = screen.getByRole('button', { name: '+' });
    await user.click(target); // + 버튼 클릭 이벤트 발생

    expect(screen.getByText('1')).toBeInTheDocument(); // 화면에 1 이라는 내용을 텍스트로 가진 요소가 있는지 검사
    expect(screen.getByRole('banner').textContent).toBe('1'); // role이 banner인 요소의 내용이 '1' 인지 검사
  });
});
```

### act() 관련 오류가 발생할 경우
2023년 5월 23일 기준으로 최신 `create-react-app` 으로 프로젝트 세팅 후에 `userEvent` 로 이벤트를 발생하면 다음과 같은 에러가 발생하는 경우가 있다.  

```sh
Warning: An update to App inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act
```

에러 메시지를 살펴보면, 이벤트를 발생시키는 부분을 `act()` 로 감싸주라는 것인데  
이는 CRA에 의해 설치된 `@testing-library/dom v9.0.0` 과 `@testing-library/react v14.0.0` 이 `@testing-library/dom` 버전과 충돌을 일으켜서 발생하는 문제이다.  

해결 방법은 패키지 버전을 다음과 같이 맞춰서 설치해주는 것이다:
```sh
npm install @testing-library/react@14 @testing-library/user-event@14 @testing-library/dom@9
```

## 참고 자료
[Jest 및 테스팅 라이브러리로 React 테스트하기](https://www.udemy.com/course/jest-testing-library)  
[User Interactions Introduction](https://testing-library.com/docs/user-event/intro/)  
[Firing Events](https://testing-library.com/docs/dom-testing-library/api-events)  