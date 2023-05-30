---
title: "모킹 예시 - 회원가입 기능"
date: 2023-05-21
update: 2022-05-21
tags:
  - jest
series: "테스팅을 위한 Jest"
---

## 시나리오
서비스에서 회원가입 기능이 존재하는데, 회원가입에 성공하면 사용자에게 이메일과 문자를 보내서 알려주는 기능이 있다고 가정해보자.  

이메일과 문자를 보내는 요청은 수행할 때마다 `5원`, `10원` 씩 발생한다고 가정하면, 회원가입 기능을 테스트할 때마다 비용이 발생하게 되므로 해당 기능을 모킹해서 처리해야 한다.  

이번에는 `Jest` 를 이용해서 모킹하는 여러 방법을 직접 사용해보고 특징을 이해해보고자 한다.  

### messageService.ts
다음은 이메일과 문자를 보내는 함수가 담긴 `messageService.ts` 파일의 내용이다: 

```ts
export function sendEmail(email: string) {
  console.log(`${email} 에 메일 전송 API 호출. 비용이 10원 소모되었습니다.`);
}

export function sendPhone(phone: string) {
  console.log(`${phone} 에 문자 전송 API 호출. 비용이 5원 소모되었습니다.`);
}
```

### userService.ts
다음은 회원가입 로직을 수행하는 함수가 담긴 `userService.ts` 파일의 내용이다:  
```ts
import { sendEmail, sendPhone } from './messageService';

export interface IUser {
  username: string;
  email: string;
  phone: string;
}

export function register(user: IUser) {
  console.log(`${user.username} 님 가입을 환영합니다!`);
  sendEmail(user.email);
  sendPhone(user.phone);

  return user;
}
```

## 1. 모킹하지 않는 경우
API 요청에 대한 모킹을 하지 않고 테스트를 수행할 때마다 비용이 계속 발생하는 방법이다.

### 소스 코드
```ts
import { register, IUser } from '../userService';

describe('회원 가입 기능 테스트', () => {
  test('admin 회원 가입 테스트', () => {
    const user: IUser = {
      username: 'admin',
      email: 'admin@example.com',
      phone: '010-1111-2222',
    };

    expect(register(user)).toEqual(user);
  });
});
```

### 실행 결과
```shell
admin 님 가입을 환영합니다!
admin@example.com 에 메일 전송 API 호출. 비용이 10원 소모되었습니다.
010-1111-2222 에 문자 전송 API 호출. 비용이 5원 소모되었습니다.
```

## 2. jest.fn() 사용
모킹이 필요한 부분들에 대해서 가짜 함수를 모두 정의해주는 방법이다.  
함수를 일일히 정의해야 하기 때문에 번거로운 부분이 존재한다.

### 소스 코드
```ts
import { IUser } from '../userService';

describe('비용이 발생하는 요청을 모킹하고 회원 가입', () => {
  const sendEmail = jest.fn<unknown, [string]>((email: string) => {
    console.log(`${email} 에 메일을 보내는 가짜 API 를 실행했습니다. 비용이 들지 않습니다.`);
  });
  
  const sendPhone = jest.fn<unknown, [string]>((phone: string) => {
    console.log(`${phone} 에 문자를 보내는 가짜 API 를 실행했습니다. 비용이 들지 않습니다.`);
  });

  const register = jest.fn((user: IUser) => {
    console.log(
      `${user.username} 님 가입을 환영합니다! 현재 모킹된 함수를 이용하고 있으므로 실제 요청은 발생하지 않습니다.`
    );
    sendEmail(user.email);
    sendPhone(user.phone);

    return user;
  });

  test('admin 회원 가입 테스트', () => {
    const user: IUser = {
      username: 'admin',
      email: 'admin@example.com',
      phone: '010-1111-2222',
    };

    register(user);

    expect(sendEmail).toBeCalledTimes(1);
    expect(sendEmail).toBeCalledWith(user.email);

    expect(sendPhone).toBeCalledTimes(1);
    expect(sendPhone).toBeCalledWith(user.phone);
  });
});
```

### 실행 결과
```shell
admin 님 가입을 환영합니다! 현재 모킹된 함수를 이용하고 있으므로 실제 요청은 발생하지 않습니다.
admin@example.com 에 메일을 보내는 가짜 API 를 실행했습니다. 비용이 들지 않습니다.
010-1111-2222 에 문자를 보내는 가짜 API 를 실행했습니다. 비용이 들지 않습니다.
```

## 3. jest.mock() 사용
모듈 전체를 한꺼번에 모킹하는 방법이다.  
`register` 함수 내부에서 `sendEmail`, `sendPhone` 함수를 호출하고 있지만, 전부 모킹된 함수로 대체되어 동작하고 있기에 콘솔에 출력되는 메시지가 없는 것을 확인할 수 있다.

### 소스 코드
```ts
import { register, IUser } from '../userService';
import { sendEmail, sendPhone } from '../messageService';
jest.mock('../messageService');

describe('비용이 발생하는 요청을 모킹하고 회원 가입', () => {
  test('admin 회원 가입 테스트', () => {
    const user: IUser = {
      username: 'admin',
      email: 'admin@example.com',
      phone: '010-1111-2222',
    };

    register(user);

    expect(sendEmail).toBeCalledTimes(1);
    expect(sendEmail).toBeCalledWith(user.email);

    expect(sendPhone).toBeCalledTimes(1);
    expect(sendPhone).toBeCalledWith(user.phone);
  });
});
```

### 실행 결과
```shell
admin 님 가입을 환영합니다!
```