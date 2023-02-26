---
title: 'React Router로 이전 페이지 URI 가져오기'
date: 2023-01-17 16:52:00
category: 'react'
draft: false
---

## 페이지 라우팅
리액트 기반의 웹 프로젝트에서 URI에 따라 다른 화면을 사용자에게 보여주기 위한 라이브러리는 `React Router`, `Next.js` 등이 있다. 
나는 `React Router` 기반으로 프로젝트를 하다가 이전 페이지로부터 어떤 파라미터를 전달받아야 할 경우가 생겼는데 이를 위해 알게된 점을 메모해보고자 한다.

## useLocation
useLocation 훅을 통해 현재 URI의 정보와, 이전 화면으로부터 넘어온 상태값 등을 알아낼 수 있다.
예를 들어 현재 URL이 `http://localhost.com/path/name?a=100&b=100` 이고,
이전 페이지로부터 `{ prev: /prev/page }` 라는 파라미터를 전달받았다고 하면
해당 location 객체로부터 구할 수 있는 정보는 아래와 같다.
> pathname: `/path/name`  
> query: `?a=100&b=100`  
> state: `{ prev: /prev/page }`

```tsx
import { useLocation } from 'react-router-dom';

function Component() {
  const location = useLocation();

  console.log(location.pathname);
  console.log(location.query);
  console.log(location.state);

  return <></>;
}
```

가 된다.

## useNavigate
useNavigation 훅을 통해 다른 URI로 이동할 수 있다.  
이때 state로 특정 파라미터를 전달해줄 수 있다.

```tsx
import { useNavigate } from 'react-router-dom';

function Component() {
  const navigate = useNavigate();

  const move = () => {
    navigate('/next/page/', {
      state: { prev: '/prev/page' }
     });
  }

  return (
    <button onClick={move}>이동</button>
  );
}
```

## Link
Link 컴포넌트를 통해 다른 URI로 이동할 수 있다.  
이때 state props로 특정 파라미터를 전달해줄 수 있다.

```tsx
import { Link } from 'react-router-dom';

function Component() {
  return (
    <Link
      to="/next/page"
      state={{ prev: '/prev/page' }}
    >
      이동
    </Link>
  );
}
```