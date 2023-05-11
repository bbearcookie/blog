---
title: "TypeScript 유틸리티 타입"
date: 2023-04-24
update: 2023-04-24
tags:
  - development
  - TypeScript
  - Utility-Types
---

## 유틸리티 타입

`TypeScript`는 *'일반적인 타입의 변환을 수월하게'* 하기 위해 **유틸리티 타입**을 제공한다.  
이번에 핸드북을 읽으면서 유용하다고 생각되는 몇 가지를 정리해 보고자 한다.

### Partial&lt;T&gt;
`T` 타입의 프로퍼티를 선택적으로 만들어서, `T` 타입의 하위 타입 집합을 생성한다.  
이 유틸리티 타입은 어떤 객체 타입의 일부 프로퍼티만 전달받은 뒤에 기본 값을 설정해 주고 싶은 경우에도 유용하게 사용 가능하다.

#### 예제
```ts
interface Modal {
  title: string;
  content: string;
  color: string;
}

function ModalComponent(modal: Partial<Modal>) {
  const defaultModal: Modal = {
    title: '기본 타이틀',
    content: '기본 내용',
    color: 'white'
  };

  modal = {...defaultModal, ...modal};
}

const updateModal: Partial<Modal> = {
  title: '수정 모달',
  color: 'skyblue'
}

const removeModal: Partial<Modal> = {
  title: '삭제 모달',
  color: 'red'
}

ModalComponent(updateModal);
ModalComponent(removeModal);
```

##### updateModal 객체의 값
```json
{
  "title": "수정 모달",
  "content": "기본 내용",
  "color": "skyblue"
} 
```

##### removeModal 객체의 값
```json
{
  "title": "삭제 모달",
  "content": "기본 내용",
  "color": "red"
}
```

### Required&lt;T&gt;
`T` 타입의 모든 프로퍼티를 필수로 설정한 타입을 생성한다. `Partial` 유틸리티 타입과 반대로 동작한다.

#### 예제
```ts{7}
interface Props {
  a?: number;
  b?: string;
}
 
const obj: Props = { a: 5 };
const obj2: Required<Props> = { a: 5 }; // Property 'b' is missing in type '{ a: number; }' but required in type 'Required<Props>'.
```

### Record&lt;K, T&gt;
`K` 를 키로 갖고, `T` 를 값으로 갖는 객체의 타입을 생성한다.
```ts
interface PageInfo {
  title: string;
}
 
type Page = "home" | "about" | "contact";
 
const nav: Record<Page, PageInfo> = {
  about: { title: "about" },
  contact: { title: "contact" },
  home: { title: "home" },
};
```

만약 위 코드에서 `home` 프로퍼티를 삭제한다면 다음과 같은 에러 메시지가 발생한다.
```
Property 'home' is missing in type '{ about: { title: string; }; contact: { title: string; }; }' but required in type 'Record<Page, PageInfo>'
```

### Pick&lt;T, K&gt;
`T` 타입에서 특정 프로퍼티 `K` 의 집합을 가진 타입을 생성한다.
```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}
 
type TodoPreview = Pick<Todo, "title" | "completed">;
 
const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};
```

### Omit&lt;T, K&gt;
`T` 타입에서 특정 프로퍼티 `K` 의 집합을 제외한 프로퍼티를 가진 타입을 생성한다.  
`Pick<T, K>`와 반대로 동작한다.
```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}
 
type TodoPreview = Omit<Todo, "description">;
 
const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};
 
todo;
```

## 참고 자료
https://typescript-kr.github.io/pages/utility-types.html  
https://www.typescriptlang.org/ko/docs/handbook/utility-types.html  
