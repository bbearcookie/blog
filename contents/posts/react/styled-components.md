---
title: "styled-components"
date: 2023-04-11
update: 2023-04-11
tags:
  - react
  - styled-components
---

리액트 라이브러리로 개발할 때 컴포넌트의 스타일링을 위해서는 크게 *CSS-in-CSS* 방식과 *CSS-in-JS* 방식이 있다.  
`styled-components`는 *CSS-in-JS* 방식으로 컴포넌트의 스타일을 위해서 따로 스타일 시트 파일을 작성하는 것이 아니라, 자바스크립트 파일 내에서 작성해주는 방식인데 리액트로 개발하면서 컴포넌트들의 동적인 `props`를 가지고 스타일을 자유 자재로 변경하고 싶은 경우에 쉽게 사용할 수 있어 유용하다고 생각한다.  

정확한 사용 방법을 몰라서 헤맸던 몇 가지 기능이 있었는데, 이를 이번에 정리해보고자 한다.

## 스타일 확장

스타일 컴포넌트가 아닌 일반 리액트 컴포넌트에 대해서도 스타일 확장이 가능하다.  
`PaddedButton`을 보면 일반 컴포넌트인 `Button`에 대해서 스타일을 확장 하고 있다.  
다만 중요한 점은 `PaddedButton` 을 사용할 때 `Button` 내부에 `className` 이 props로 전달되는데, 이걸 반드시 일반 컴포넌트가 반환하는 요소의 `className` 으로 전달해줘야 한다는 것이다.  
그렇지 않으면 스타일이 정상적으로 적용되지 않는다.

```tsx
import React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  children?: React.ReactNode;
}

function Button({ className, children }: Props) {
  return <button className={className}>{children}</button>;
}

export const PaddedButton = styled(Button)`
  padding: 1.5em;
`;

export const RedButton = styled(PaddedButton)`
  background-color: red;
`;

export const YellowButton = styled(PaddedButton)`
  background-color: yellow;
`;

```

## 컴포넌트 지정

CSS에서 선택자를 지정하는 것처럼, 스타일 컴포넌트를 대상으로 선택자를 지정하는 것처럼 사용할 수 있다.  
아래 코드를 보면 `StyledCard` 내부의 `PaddedButton` 컴포넌트를 대상으로 `background-color` 속성을 지정해주고 있다.  

그리고 믹스인과 같은 기능은 `border` 처럼 `css` 함수를 이용해서 정의하고, 이를 스타일 컴포넌트 내부에서 가져와 사용하는 방법으로 사용할 수 있다.

또한, 스타일 컴포넌트가 받는 `props`의 타입은 제네릭으로 지정해주면 된다.

```tsx
import React from 'react';
import styled, { css } from 'styled-components';
import { PaddedButton } from './Button';

interface Props {
  children?: React.ReactNode;
}

function Card({ children }: Props) {
  return (
    <StyledCard buttonColor="pink">
      {children}
      <PaddedButton>카드 내부의 버튼</PaddedButton>
    </StyledCard>
  );
}

export default Card;

const border = css`
  border: 1px solid red;
  border-radius: 5px;
`;

const StyledCard = styled.div<{ buttonColor: string }>`
  ${border}

  ${PaddedButton} {
    background-color: ${p => p.buttonColor};
  }
`;

```

## css prop

Styled-component 버전 4 부터는 css prop 기능을 이용할 수 있다.  
이 기능은 간단한 스타일 지정을 위해서 `styled` 함수를 호출하여 새로운 스타일 컴포넌트를 만드는 번거로운 과정을 거치지 않고도 스타일을 지정해줄 수 있는 기능이다.

`div`, `span` 같은 기본적인 태그 요소나 스타일 컴포넌트를 대상으로 `css` prop을 전달해줄 수 있다.

```tsx{10}
import { PaddedButton, RedButton, YellowButton } from './component/Button';
import Card from './component/Card';

function App() {
  return (
    <div className="App">
      <PaddedButton>버튼</PaddedButton>
      <RedButton>빨간 버튼</RedButton>
      <YellowButton>노란 버튼</YellowButton>
      <PaddedButton css={{ backgroundColor: 'green' }}>초록 버튼</PaddedButton>

      <Card css={{ backgroundColor: 'green' }}>내용...</Card>
    </div>
  );
}

export default App;
```

다만 이 기능을 사용하려면 몇 가지 설정을 해야한다.

### 바벨 설정
`babel-plugin-styled-components` 를 설치한다.

```sh
npm install --save-dev babel-plugin-styled-components
```

그리고 바벨에 아래처럼 설정해준다.

```json
{
  "plugins": ["babel-plugin-styled-components"]
}
```

만약 `craco`를 사용한다면 `craco.config.js` 에 다음과 같이 바벨 설정을 한다.

```js
module.exports = {
  babel: {
    plugins: ['babel-plugin-styled-components'],
  },
};
```

### 타입 import

타입스크립트를 사용하는 경우에는 `cssprop` 의 타입을 한 번 `import` 해줘야 한다.  
이는 프로젝트에서 한 번만 해주면 된다. 예를 들어 `index.tsx` 에 다음 구문을 작성한다.
```ts
import * as types from 'styled-components/cssprop';
```
