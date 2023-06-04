---
title: "유효성 검사"
date: 2023-05-18 01:00
update: 2022-05-18
tags:
  - react
  - react-hook-form
series: "폼 데이터 관리를 위한 React Hook Form"
---

## 유효성 검사 작성 방법
`input` 과 `select` 같은 폼 요소에 대해서 데이터의 유효성을 검사하는 방법은 `register()` 메소드의 두 번째 매개변수인 `options` 에 검사 조건을 입력해주는 것이다.

`required`, `maxLength`, `minLength` 등 기본적으로 존재하는 옵션을 사용할 수도 있고, 자신이 직접 새로운 조건을 입력해야 하는 경우에는 `validate` 옵션을 사용할 수 있다.

### 1. 기본 옵션
```js
{
  value: 값,
  message: string
}
```
기본적으로 존재하는 옵션에 대해서는 위와 같은 형태로 조건을 작성한다.  
`value` 에는 해당 옵션에 대한 값을 입력하고, `message` 에는 유효성 검사가 실패했을 때 `errors` 객체에 들어갈 오류 메시지를 입력한다.

예를 들어 반드시 입력되어야 하고, 영문자만 입력할 수 있는 `input` 에 대해서는 다음과 같이 작성한다:
```tsx
<input
  id="username"
  {...register('username', {
    required: { value: true, message: 'username을 입력해주세요.' },
    pattern: { value: /^[A-Za-z]+$/i, message: '영문자만 입력해주세요.' },
  })}
/>
```

오류 메시지를 입력해 줄 필요가 없는 경우에는 다음과 같이 `value` 만 간결하게 줄 수도 있다:
```tsx
<input
  id="username"
  {...register('username', {
    required: true,
    pattern: /^[A-Za-z]+$/i,
  })}
/>
```

### 2. 커스텀 옵션
조건 검사의 내용을 더 세부적으로 작성할 필요가 있는 경우에는 `validate` 를 사용한다.  

이메일의 데이터가 `admin@example.com` 가 아닌 경우에만 데이터가 유효하도록 할 경우에는 다음과 같이 작성한다:
```tsx
validate: value => value !== 'admin@example.com'
```

유효성 검사에 실패했을 때 `errors` 객체에 들어갈 오류 메시지는 `||` 연산자를 통해서 입력할 수 있다:
```tsx
validate: value => value !== 'admin@example.com' || 'Enter a different email address'
```

검사해야 할 조건이 여러 가지인 경우에는 `key` 와 `value` 형태로 작성할 수도 있다:
```tsx
validate: {
  notAdmin: value => value !== 'admin@example.com' || 'Enter a different email address',
  notBlackListed: value => !value.endsWith('baddomain.com') || 'This domain is not supported',
  emailAvailable: async value => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users?email=${value}`);
    const data = await response.json();
    return data.length === 0 || 'Email already exists';
  },
}
```

## 오류 객체 확인 방법
폼에서 유효성 검사에 실패한 필드와 오류 메시지에 대해서는 `useForm()` 이 반환하는 `formState` 내부의 `errors` 객체를 확인하면 된다.

## 참고 자료
[React Hook Form 공식 문서](https://react-hook-form.com/)  
[Codevolution - React Hook Form Tutorials](https://www.youtube.com/watch?v=KejZXxFCe2k&list=PLC3y8-rFHvwjmgBr1327BA5bVXoQH-w5s)  