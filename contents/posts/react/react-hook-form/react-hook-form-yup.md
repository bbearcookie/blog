---
title: "Yup 라이브러리 연동"
date: 2023-05-18 04:00
update: 2022-05-18
tags:
  - react
  - react-hook-form
series: "폼 데이터 관리를 위한 React Hook Form"
---

`react-hook-form` 에 내장되어 있는 유효성 검사 옵션들을 이용할 수도 있지만, `yup` 과 같이 유효성 검사를 위해 다양한 기능을 제공하는 라이브러리를 사용할 수도 있다.  

`yup` 을 사용했을 때의 장점은 `yup` 만의 다양한 기능을 이용할 수 있다는 점도 있지만, 유효성 검사 부분을 따로 하나의 `schema` 로 뺄 수 있으므로 `JSX` 코드 부분이 간결해 진다는 점이다.

## 연동 방법
### 1. 패키지 설치
```sh
npm i yup @hookform/resolvers
```
`yup` 라이브러리를 연동하기 위해서는 우선 `yup` 라이브러리와, 연동에 필요한 `yup resolver` 를 설치한다.

### 2. 패키지 가져오기
```ts
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
```

### 3. yupResolver 등록
```ts
interface IForm {
  username: string;
  email: string;
  channel: string;
}

const schema = yup.object({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Email format is not valid').required('Email is required'),
  channel: yup.string().required('Channel is required'),
});

function Yup() {
  const { register } = useForm<IForm>({
    defaultValues: {
      username: '',
      email: '',
      channel: '',
    },
    resolver: yupResolver(schema),
  });

  return <></>;
}
```

유효성 검사를 위한 스키마를 정의하고, `yupResolver` 에 스키마를 담아서 `useForm()` 의 props 로 전달해주면 된다.

## 예시 코드
```tsx
import { DevTool } from '@hookform/devtools';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface IForm {
  username: string;
  email: string;
  channel: string;
}

const schema = yup.object({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Email format is not valid').required('Email is required'),
  channel: yup.string().required('Channel is required'),
});

function Yup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<IForm>({
    defaultValues: {
      username: '',
      email: '',
      channel: '',
    },
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<IForm> = data => console.log(data);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" {...register('username')} />
          {errors.username && <span>{errors.username.message}</span>}
        </div>
        <div>
          <label htmlFor="email">email</label>
          <input type="email" id="email" {...register('email')} />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <div>
          <label htmlFor="channel">channel</label>
          <input type="text" id="channel" {...register('channel')} />
          {errors.channel && <span>{errors.channel.message}</span>}
        </div>

        <button>submit</button>
      </form>

      <DevTool control={control} />
    </div>
  );
}

export default Yup;
```