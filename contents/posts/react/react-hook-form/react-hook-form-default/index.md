---
title: "React Hook Form"
date: 2023-05-18
update: 2022-05-18
tags:
  - react
  - react-hook-form
series: "폼 데이터 관리를 위한 React Hook Form"
---

## react-hook-form
`react-hook-form` 은 `React` 에서의 폼 데이터 관리를 쉽게 도와주는 라이브러리이다.

`React` 에서 폼 데이터를 **상태**에 저장하고, 잘못된 형식이 들어오지 않도록 **유효성**을 검사하고, 유효성 검사 결과에 따른 적절한 **오류 메시지**를 보여주도록 관리하는데에는 많은 코드 작성이 들어가고, `input` 요소의 값의 변화를 `React` 가 제어하는 **제어 컴포넌트**의 형태로 작성하면 `onChange` 이벤트가 작동할 때마다 컴포넌트도 함께 재렌더링이 되기 때문에 성능상에도 좋지 않은 영향을 줄 수 있다.

`react-hook-form` 라이브러리는 기본적으로 <b style="color: red">**비제어 컴포넌트**</b>의 방식으로 동작하기 때문에 렌더링과 격리된 상태로 **폼 데이터를 쉽고 효율적으로 다룰 수 있다**는 장점이 있다.

## useForm
`useForm()` 은 폼 데이터를 다루기 위해서 선언하는 훅이다.

### 파라미터
`useForm()` 에는 다음과 같은 매개변수를 줄 수 있다.

#### mode
유효성 검사를 언제 수행할 것인지를 설정하는 옵션이다. 기본 값은 `onSubmit` 이다.
- `onSubmit`: submit 이벤트가 발생할 때
- `onBlur`: blur 이벤트가 발생할 때
- `onChange`: change 이벤트가 발생할 때  
<b style="color: red">**주의**</b>: 성능에 좋지 않은 거대한 영향을 줄 수 있는 옵션이다.  
- `onTouched`: 첫 번째로 blur 이벤트가 발생할 때, 그 후 모든 change 이벤트마다 발생  
- `all`: 위 옵션 전체를 사용

#### defaultValues
폼에 기본적으로 존재할 데이터를 설정하는 옵션이다.  
서버로부터 데이터를 가져오는 등의 비동기 요청도 가능하다.

```js
// set default value sync
useForm({
  defaultValues: {
    firstName: '',
    lastName: ''
  }
})

// set default value async
useForm({
  defaultValues: async () => fetch('/api-endpoint');
})
```

### 반환 값  
`useForm()` 이 반환하는 `UseFormReturn` 객체에는 다음과 같은 내용이 존재한다.

#### register
`input` 이나 `select` 요소를 `react-hook-form` 이 관리할 수 있도록 등록하고, 유효성 검사 규칙을 지정하는 메소드이다.  

이 메소드는 `name`, `ref`, `onChange`, `onBlur` 를 반환하는데, 반환된 값들은 `react-hook-form` 이 관리할 수 있도록 `input` 요소에 `props` 로 전달해주면 된다.

#### watch
폼 데이터의 **현재 값**을 가져올 수 있는 메소드이다.  
기본적으로 비제어 컴포넌트로 데이터를 다루는 `react-hook-form` 에서 제어 컴포넌트처럼 `input` 값의 변화를 **실시간으로 감지할 필요**가 있을 때 유용하게 사용된다.  

#### handleSubmit
```js
handleSubmit(SubmitHandler, SubmitErrorHandler)
```
`form` 태그의 `onSubmit` 속성에 입력되는 핸들러를 반환하는 함수.  
**첫 번째 매개변수**로 유효성 검사에 성공했을 때의 콜백을 받고  
**두 번째 매개변수**로 유효성 검사에 실패했을 때의 콜백을 받는다.  

#### formState
`form` 과 각각의 `input` 에 대한 전체적인 상태 정보가 들어있는 객체이며 내부에는 다음과 같은 속성들이 존재한다: 

- `errors`: 유효성 검사 결과
- `isDirty`: 폼 데이터가 초기 값과 다른 상태인지의 여부  
- `dirtyFields`: 데이터가 초기 값과 다른 필드의 목록  
- `touchedFields`: 사용자가 한 번이라도 상호작용 한 필드의 목록  
- `isLoading`: `defaultValues` 를 설정할 때 비동기 방식으로 한 경우, 초기 값이 아직 입력받는 도중인지의 여부를 나타낸다.  
- `isValid`: 폼 데이터에 대한 유효성 검사가 모두 통과했는지의 여부
- `isSubmitting`: `submit` 이벤트가 작동하고 있는지의 여부

#### control
`useWatch`, `useFormState` 같은 훅이 어떤 `form` 에 대해서 데이터를 가져올 것인지를 가리키기 위해 `control` 객체를 매개변수로 받는데, 그런 훅에 인자로 보내줄 수 있는 객체이다.  

#### setValue
```js
setValue(name: string, value: unknown, config?: Object) => void
```
폼 데이터를 직접 설정하는 함수.  

#### getValues
```js
getValues(payload?: string | string[]) => Object
```

폼 데이터의 **값**을 가져오는 함수.  
`watch()` 와의 차이점은 값의 변화가 발생해도 리렌더링을 발생하지 않는다는 점이다.  

> 더 자세한 파라미터와 반환 값에 대해서는 [useForm API](https://react-hook-form.com/api/useform/) 에서 확인할 수 있다.

## 필드 이름
`register()`, `setValue()` 등의 메소드에 어떤 `input` 에 대한 처리를 할 것인지 필드 이름을 인자로 전달하게 되어 있는데 **단일 값**, **중첩 객체**, **배열** 모두 지정해줄 수 있다.

```ts
interface IForm {
  single: string;
  strings: string[];
  object: {
    foo: {
      bar: string;
    };
  };
  objects: {
    content: string;
  }[];
}
```

```js
register("single");
register("strings.0");
register("strings.1");
register("object.foo.bar");
register("objects.0.content");
register("objects.1.content");
```

## 예시 코드
```tsx
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';

interface IForm {
  username: string;
  password: string;
}

function Example() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IForm>();

  const onSubmit: SubmitHandler<IForm> = data => console.log(data);
  const onError: SubmitErrorHandler<IForm> = err => console.log(err);

  const { username, password } = watch();

  return (
    <div>
      <div>{username} {password}</div>
      <hr />
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div>
          <label htmlFor="username">username</label>
          <input
            id="username"
            {...register('username', {
              required: { value: true, message: 'username을 입력해주세요.' },
              pattern: { value: /^[A-Za-z]+$/i, message: '영문자만 입력해주세요.' },
            })}
          />
          {errors.username && <span>{errors.username.message}</span>}
        </div>

        <div>
          <label htmlFor="password">password</label>
          <input id="password" {...register('password', { required: true })} />
          {errors.password && <span>비밀번호를 입력해주세요</span>}
        </div>

        <input type="submit" />
      </form>
    </div>
  );
}

export default Example;
```


## 참고 자료
[React Hook Form 공식 문서](https://react-hook-form.com/)  
[Codevolution - React Hook Form Tutorials](https://www.youtube.com/watch?v=KejZXxFCe2k&list=PLC3y8-rFHvwjmgBr1327BA5bVXoQH-w5s)  