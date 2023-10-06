---
title: "JSX는 어떻게 변환되는가"
date: 2023-10-06
update: 2022-10-06
tags:
  - react
---

우리는 React로 개발하면서 컴포넌트 내부에서 JSX 문법으로 특정 컴포넌트가 그려야 할 화면을 선언한다.

```tsx
export default function App() {
  return (
    <div>
      <h1>어서오세요!</h1>
      <p>리액트입니다</p>
    </div>
  )
}
```

이는 코드만 봤을 때 JS함수가 HTML같이 생긴 JSX를 반환하는 형태로 보이는데 이번에 JSX로 변환하는 과정을 탐구해보고자 한다.

## JSX Transform

함수가 어떻게 JSX를 반환할 수 있을까? 이는 **빌드 타임에 Babel이나 TypeScript같은 트랜스파일러가 JSX 구문을 일반 함수 호출의 형태로 변환**하기 때문이다.

예시로 Vite를 기반으로 빠르게 세팅한 환경에서 아주 간단한 컴포넌트를 만든 뒤 실제 빌드된 결과를 살펴보자면:

### 예시 코드

```tsx
import { useRef } from "react"

function Simple() {
  const ref = useRef(null)

  return (
    <div ref={ref} key="simple">
      하하 매우 심플하다
    </div>
  )
}
```

### 빌드 결과

```tsx
function Dd() {
  const e = el.useRef(null)
  return me.jsx("div", { ref: e, children: "하하 매우 심플하다" }, "simple")
}
```

JSX를 반환하는 형태로 작성된 코드는 실제로 `jsx` 라는 함수를 호출하는 형태로 변경된다는 것을 알 수 있다.

그렇다면 저 `jsx` 함수의 정체는 무엇일까? 알아보기 위해서 빌드된 파일을 조금 더 살펴보면...

```js
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var br = {}

br.jsx = qi
br.jsxs = qi

function qi(e, n, t) {
  var r,
    l = {},
    u = null,
    o = null
  t !== void 0 && (u = "" + t),
    n.key !== void 0 && (u = "" + n.key),
    n.ref !== void 0 && (o = n.ref)
  for (r in n) _c.call(n, r) && !Pc.hasOwnProperty(r) && (l[r] = n[r])
  if (e && e.defaultProps)
    for (r in ((n = e.defaultProps), n)) l[r] === void 0 && (l[r] = n[r])
  return { $$typeof: Ec, type: e, key: u, ref: o, props: l, _owner: xc.current }
}

Hi.exports = br

var me = Hi.exports,
  Ql = {},
  bi = { exports: {} },
  ge = {},
  es = { exports: {} },
  ns = {}
```

`me.jsx` 함수는 결국 `qi` 함수를 의미하고 있다는 것을 알 수 있다.

그런데 빌드된 파일만 가지고는 역시 파악하기가 쉽지 않기에, 주석에 적힌 `react-jsx-runtime` 내용을 참고하여 [React의 레포지토리](https://github.com/facebook/react/blob/main/packages/react/src/jsx/ReactJSXElement.js#L210)에서 JSX 함수의 정체를 확인할 수 있었다.

### JSX 함수

```js
/**
 * https://github.com/reactjs/rfcs/pull/107
 * @param {*} type
 * @param {object} props
 * @param {string} key
 */
export function jsx(type, config, maybeKey) {
  let propName

  // Reserved names are extracted
  const props = {}

  let key = null
  let ref = null

  // Currently, key can be spread in as a prop. This causes a potential
  // issue if key is also explicitly declared (ie. <div {...props} key="Hi" />
  // or <div key="Hi" {...props} /> ). We want to deprecate key spread,
  // but as an intermediary step, we will use jsxDEV for everything except
  // <div {...props} key="Hi" />, because we aren't currently able to tell if
  // key is explicitly declared to be undefined or not.
  if (maybeKey !== undefined) {
    key = "" + maybeKey
  }

  if (hasValidKey(config)) {
    key = "" + config.key
  }

  if (hasValidRef(config)) {
    ref = config.ref
  }

  // Remaining properties are added to a new props object
  for (propName in config) {
    if (
      hasOwnProperty.call(config, propName) &&
      !RESERVED_PROPS.hasOwnProperty(propName)
    ) {
      props[propName] = config[propName]
    }
  }

  // Resolve default props
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName]
      }
    }
  }

  return ReactElement(
    type,
    key,
    ref,
    undefined,
    undefined,
    ReactCurrentOwner.current,
    props
  )
}
```

개발 환경에서는 몇 가지의 조건부 로직이 더 있었지만 간단하게 프로덕션 환경을 기준으로 보자면 태그의 `type`, 컴포넌트의 각종 props를 담은 `config`, 그리고 key를 담은 `maybeKey` 인자를 받아서 `ReactElement` 함수를 호출하고 반환하는 코드였다.

### ReactElement 함수

마찬가지로 `jsx` 함수가 호출 및 반환하는 `ReactElement` 함수의 역할을 파악하기 위해서 [React의 레포지토리](https://github.com/facebook/react/blob/main/packages/react/src/jsx/ReactJSXElement.js#L148)를 살펴봤다.

```js
/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, instanceof check
 * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} props
 * @param {*} key
 * @param {string|object} ref
 * @param {*} owner
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @internal
 */
function ReactElement(type, key, ref, self, source, owner, props) {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type,
    key,
    ref,
    props,

    // Record the component responsible for creating this element.
    _owner: owner,
  }

  return element
}
```

개발 환경에서의 동작을 배제하자면 위 소스코드와 같은데, 그냥 간단하게 `type`, `key`, `ref`, `props` 프로퍼티를 갖는 객체를 반환하는 것 뿐이었다.

## React.createElement

리액트 공식문서에서 현재는 레거시 API로 분류된 [createElement](https://ko.react.dev/reference/react/createElement)가 있다.

지금까지는 어렴풋이 JSX 문법이 저 `createElement()` 함수를 호출하는 형태로 변환되는 것이 아닐까? 생각했었는데 실제로 빌드된 결과를 확인해보면 알 수 있었듯 정답이 아니었다.

**예전에는 createElement() 를 호출하는 구문**으로 변환되는 것이 맞았으나, React 17부터는 새로운 함수 `jsx()` 를 호출하는 구문으로 변환되는 것 이었다.

그럼 이렇게 바꿨을 때 어떤 장점이 있었길래 새로운 `jsx()` 를 호출하는 걸로 바꾼걸까? 이는
[Introducing the New JSX Transform](https://ko.legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) 내용을 확인하면 알 수 있었다.

장점은 크게 3가지인데:

- `import React from 'react'` 구문 없이도 JSX 문법 사용 가능.
- 설정에 따라서 번들 사이즈에 약간의 향상이 있음.
- React를 학습하는데 필요한 개념을 줄임.

예전에 리액트 컴포넌트를 작성한 파일에서 React를 사용하지 않아도 반드시 최상단에 import를 해야만 했던 이유가 의아했었는데, JSX 문법이 결국 `React.createElement()` 함수를 호출하는 구문으로 바뀌기에 개발자가 직접 호출하지는 않았어도 빌드 결과에서는 `React` 를 사용하는 형태로 변환되기 때문이었다.

현재 `jsx()` 함수를 사용하는 방식으로 변경된 이후에는 빌드 시점에 트랜스파일러가 주입해주기 때문에 더 이상 `import` 하지 않아도 되는 것이다.

## 빌드 해보기

코드를 몇 가지 다양한 방식으로 작성하고 빌드해봤다.

### 여러 개의 children

하위 컴포넌트 집합 `children` 이 단일 값이면 `jsx` 를 호출하지만, 여러 개가 있으면 `jsxs`가 호출된다.

또한 children이 배열 형태로 표현된다.

#### 실제 코드

```tsx
import { useRef } from "react"

function Simple() {
  const ref = useRef(null)

  return (
    <div ref={ref} key="simple">
      <p>심플</p>
      <p>하네요</p>
    </div>
  )
}
```

#### 빌드 결과

```js
function Dd() {
  const e = el.useRef(null)
  return ue.jsxs(
    "div",
    {
      ref: e,
      children: [
        ue.jsx("p", { children: "심플" }),
        ue.jsx("p", { children: "하네요" }),
      ],
    },
    "simple"
  )
}
```

#### jsxs

`jsxs()` 함수와 `jsx()` 함수의 차이점도 궁금해서 찾아봤는데, 마찬가지로 [React 레포지토리](https://github.com/facebook/react/blob/main/packages/react/src/jsx/ReactJSX.js)를 확인해서 알 수 있었다.

```js
import { REACT_FRAGMENT_TYPE } from "shared/ReactSymbols"
import {
  jsxWithValidationStatic,
  jsxWithValidationDynamic,
  jsxWithValidation,
} from "./ReactJSXElementValidator"
import { jsx as jsxProd } from "./ReactJSXElement"
const jsx: any = __DEV__ ? jsxWithValidationDynamic : jsxProd
// we may want to special case jsxs internally to take advantage of static children.
// for now we can ship identical prod functions
const jsxs: any = __DEV__ ? jsxWithValidationStatic : jsxProd
const jsxDEV: any = __DEV__ ? jsxWithValidation : undefined

export { REACT_FRAGMENT_TYPE as Fragment, jsx, jsxs, jsxDEV }
```

개발 환경에서의 validation 동작에 약간의 차이를 주는 것이고, 프로덕션 환경에서는 `jsx()` 와 `jsxs()` 는 동일한 함수를 호출한다.

### 리스트 렌더링

리스트를 렌더링하는 경우 `map()` 함수 내부의 콜백은 `jsx()` 함수를 호출 및 반환하는 형태로 변환된다.

`key` 값은 세 번째 인자로 넘어가고 있다는 점도 확인할 수 있다.

#### 실제 코드

```tsx
const list = [
  { id: 1, name: "a" },
  { id: 2, name: "b" },
  { id: 3, name: "c" },
]

function SimpleList() {
  return (
    <ul>
      <li>아주 간단한 리스트</li>
      {list.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}
```

#### 빌드 결과

```tsx
const jd = [
  { id: 1, name: "a" },
  { id: 2, name: "b" },
  { id: 3, name: "c" },
]

function Id() {
  return Y.jsxs("ul", {
    children: [
      Y.jsx("li", { children: "아주 간단한 리스트" }),
      jd.map(e => Y.jsx("li", { children: e.name }, e.id)),
    ],
  })
}
```

### 조건부 렌더링

#### 실제 코드

```tsx
function SimpleConditional() {
  const [show, setShow] = useState(false)

  const handleToggle = () => setShow(!show)

  return (
    <div onClick={handleToggle}>
      {show && <p>참일 때 보여주세요</p>}
      {!show && <p>거짓일 때 보여주세요</p>}
    </div>
  )
}
```

#### 빌드 결과

```js
function Fd() {
  const [e, n] = Xt.useState(!1)
  const t = () => n(!e)

  return $.jsxs("div", {
    onClick: t,
    children: [
      e && $.jsx("p", { children: "참일 때 보여주세요" }),
      !e && $.jsx("p", { children: "거짓일 때 보여주세요" }),
    ],
  })
}
```

## JSX.Element

이 부분은 약간 동떨어진 이야기일 수도 있는데, 작성한 김에 함께 올려보고자 한다.

간단한 함수 컴포넌트를 만들고 vscode로 해당 함수에 마우스를 올려보면, `JSX.Element` 를 반환한다는 사실을 알 수 있다.

```tsx
function Simple(): JSX.Element
```

이 타입의 세부 내용은 `jsx-runtime.d.ts` 에서 알 수 있는데:

```ts
namespace JSX {
  interface Element extends React.ReactElement<any, any> {}
}

declare namespace React {
  interface ReactElement<
    P = any,
    T extends string | JSXElementConstructor<any> =
      | string
      | JSXElementConstructor<any>
  > {
    type: T
    props: P
    key: string | null
  }
}
```

간단하게 생각하자면 `type`, `props`, `key` 라는 프로퍼티를 갖는 인터페이스로 볼 수 있다.

## 참고 자료

[Introducing the New JSX Transform](https://ko.legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)  
[그 많던 import React from ‘react’는 어디로 갔을까](https://so-so.dev/react/import-react-from-react/)
