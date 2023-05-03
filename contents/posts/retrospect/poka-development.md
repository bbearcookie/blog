---
title: "poka 개발 회고"
date: 2023-05-03
update: 2023-05-03
tags:
  - retrospect
series: "아이돌 포토카드 교환 플랫폼 poka"
---

## 사이드 프로젝트를 시작한 계기
대학교에서 2~3번 정도의 프로젝트를 했었지만 나를 포함해서 팀원의 개발 경험이나 설계 경험이 적었다보니 어떻게든 기한 내에 완성하기 위해서 막바지에는 시연에 문제가 없을 정도로만 기능 구현에 급급해서 개발했던 경우가 많았다.

그렇다보니 내부는 스파게티 코드처럼 되어서 정리가 되지 않았는데 이러한 결과물을 포트폴리오에 프로젝트 경험으로 활용하기는 어렵겠다는 생각을 했고, 잘 정리된 프로젝트를 완성할 필요성을 느꼈다.

졸업 작품으로 했었던 프로젝트가 아이디어는 좋았다고 생각하기 때문에 그 소재를 가지고 아쉬웠던 부분은 개선하고, 새로운 라이브러리를 적용하고, 코드를 작성할 때 어떤 방식으로 작성하면 좋은지 충분히 고민하고 정리하면서 혼자서 프론트엔드부터 백엔드까지 결과물을 새로 만들어 보기로 했다.

## 이전 프로젝트에서 아쉬웠던 부분
### <span style="color: red">하나의 미들웨어에 모든 로직이 들어있음</span>
일반적으로 백엔드 프로그램에서는 클라이언트의 요청에 포함된 파라미터의 **유효성 검사**를 하고 DB에서 적절한 데이터를 **조회하거나 수정**하여 응답을 보내준다. 

이전 프로젝트에서는 요청의 파라미터를 파싱하고, 유효성 검사를 하고, 데이터베이스 커넥션을 받아서 조회하는 기능을 특정 미들웨어에서 한번에 작성했었는데, 이 때문에 코드의 복잡성이 올라간다고 느꼈었다.  

그래서 이번에는 유효성 검사 부분은 간결하게 작성해보고자 `express-validator` 라이브러리를 활용하고, `/service` 라는 디렉토리를 만들어서 DB에 관한 작업을 하는 코드를 분할하기로 했다.

### <span style="color: red">컴포넌트를 import 할 때 상대경로 지정</span>
특정 페이지에서 다른 컴포넌트를 사용할 때 경로가 굉장히 깊다면 `../../../../component` 처럼 경로가 너무 길어지는 부분이 있었다.

이번에 `TypeScript` 를 적용해 볼 생각이었는데 마침 `tsconfig.json` 의 컴파일 옵션에 `paths` 속성으로 절대 경로를 지정할 수 있다는 점을 알게 되었고, 이를 적용하기로 했다.

### <span style="color: red">커밋 메시지</span>
커밋 메시지를 작성할 때 어떤 내용의 작업을 했는지만 작성했었는데 커밋 메시지의 제목에는 **작업의 형태**를 나타내는 `Type` 과 무슨 작업인지에 대한 **내용**인 `Subject` 으로 구분해서 작성하는 컨벤션이 있다는 걸 알게 되었다.

그래서 이번에는 `Feat`, `Refactor`, `Fix`, `Chore` 등의 타입으로 구분해서 커밋을 작성하기로 했다.

### <span style="color: red">비동기 요청의 상태 정보와 응답 결과를 관리하기 번거로움</span>
클라이언트에서 서버로 비동기 요청을 할 때 고려해야 할 부분은 `Success`, `Error`, `Loading` 등의 **상태**와, 응답 결과 **데이터**인데 이를 다루는 코드를 요청이 발생할 때마다 작성하면 일종의 `보일러 플레이트(Boilerplate)` 가 되기 때문에 요청을 다루는 `custom hook`을 만들어서 사용하고 있었다.

그러나 이런 방식에서 몇 가지의 고민이 있었다.

- 간단한 요청을 할 때에도 `custom hook`을 일일히 선언하고, `api` 도 `import` 하는게 번거롭다.
- 서버로부터 받은 데이터를 부모와 자손 컴포넌트에서 함께 사용해야 하는 경우 아래와 같은 선택지가 있는데, 모두 각각의 단점이 존재한다.
  1. **부모 컴포넌트가 서버 데이터를 받고, 자손에게 props drilling**  
  요청은 부모 컴포넌트에서 한 번만 발생하기에 효율적이지만 컴포넌트가 깊어질수록 데이터를 일일히 내려주는 것이 번거롭다.
  - **서버 데이터를 redux와 같은 외부 스토어에 저장**  
  요청은 부모 컴포넌트에서 하고, 상태와 데이터는 외부 스토어에 저장하는 방법인데, 해당 데이터가 전역적인 관리가 필요한 데이터가 아니라 특정 영역에서만 사용되는 데이터임에도 외부 스토어에 저장하는게 좋은 방법인지 의문이 들었다.
  - **데이터를 사용하는 부모 컴포넌트와 자손 컴포넌트에서 일일히 새로 요청**  
  네트워크 요청 자체가 여러 번 발생하기 때문에 비효율적이다.

이런 고민 중에 서버 상태를 다루는 `React-Query` 를 알게 되었고, 서버 상태를 쉽게 다룰 뿐 아니라 적절한 캐싱까지 해준다는 점에서 유용할 것 같아 이번에 적용해보기로 했다.

## 프로젝트 목표
- 프론트엔드부터 백엔드까지 직접 구현하고 배포해보면서 포트폴리오로 활용할 수 있는 결과물 만들기
- `React` 로 컴포넌트를 어떻게 분리할지, 스타일은 어떻게 줄지, 상태는 어떻게 관리할지를 다양한 방법을 사용해보면서 `React` 에 익숙해지기
- `TypeScript` 익숙해지기
- `React-Query` 익숙해지기

## 개발중 시행 착오
### 컴포넌트 작성 방식
`TypeScript` 를 처음 사용해 보는 것 이었는데 함수 컴포넌트의 `Props`의 타입과 기본 값을 어떻게 작성할 것인지가 많이 고민되었다.

#### 초기
```tsx
interface ErrorCardProps {
  error: AxiosError<ErrorType, any> | null
  children?: React.ReactNode;
}

const ErrorCardDefaultProps = {};

function ErrorCard({ error, children }: ErrorCardProps & typeof ErrorCardDefaultProps) {
  return (
    <Card>
      <CardHeader>
        <h1>Error</h1>
      </CardHeader>
      <CardBody>
        {error && <p>{getErrorMessage(error)}</p>}
        {!error && <p>오류 발생</p>}
      </CardBody>
    </Card>
  );
}

ErrorCard.defaultProps = ErrorCardDefaultProps;

export default ErrorCard;
```
처음에는 `컴포넌트Props` 와 `컴포넌트DefaultProps` 로 Props의 타입과 기본 값 정보를 작성하는 `snippet`을 만들어서 사용했다. 우선 변수의 이름이 너무 길기도 하고 `Props` 와 `DefaultProps` 의 타입을 유니온 해서 사용하는 것 보다는 매개변수의 값을 직접 넣어주는게 더 좋아보여서 나중에는 작성 방법을 바꿨다.

#### 현재
```tsx
import { Card, CardHeader, CardBody } from '@component/card/basic/_styles';
import TitleLabel from '@component/label/TitleLabel';
import { AxiosError } from 'axios';
import { ResponseError } from '@type/response';
import { getErrorMessage } from '@util/request';

interface Props {
  error: AxiosError<ResponseError, any> | string;
}

function ErrorCard({ error, ...rest }: Props) {
  return (
    <Card {...rest}>
      <CardHeader>
        <TitleLabel title="Error" />
      </CardHeader>
      <CardBody>{typeof error === 'string' ? error : getErrorMessage(error)}</CardBody>
    </Card>
  );
}

export default ErrorCard;
```

### Props의 기본 값 설정
객체 형태의 `Props` 받는데 그 객체의 일부 프로퍼티만 전달할 수도 있고, 전달받지 않은 프로퍼티에 대해서는 기본 값을 지정해주려고 한다면 어떻게 해야 할 지를 몰랐었다. 그래서 어쩔 수 없이 객체 형태가 아니라 단일 값 형태로 여러 `Props` 를 받아서 사용하는 방식으로 구현했었다.

#### 초기
```tsx
interface Props extends ModalProps {
  titleName?: string;
  confirmText?: string;
  confirmButtonTheme?: ButtonTheme;
  handleConfirm?: () => void;
  cancelText?: string;
  cancelButtonTheme?: ButtonTheme;
  cardStyles?: CardStyles;
  modalStyles?: ModalStyles;
  children?: React.ReactNode;
}

const DefaultProps = {
  titleName: '',
  confirmButtonTheme: 'danger' as ButtonTheme,
  cancelButtonTheme: 'gray' as ButtonTheme,
  confirmText: '확인',
  cancelText: '취소',
};

function ConfirmModal({
  hook, location,
  titleName = DefaultProps.titleName,
  confirmText = DefaultProps.confirmText,
  confirmButtonTheme = DefaultProps.confirmButtonTheme,
  handleConfirm,
  cancelText = DefaultProps.cancelText,
  cancelButtonTheme = DefaultProps.cancelButtonTheme,
  cardStyles, modalStyles, children 
}: Props) {
  return (
    <Modal
      hook={hook}
      location={location}
      styles={modalStyles}
    >
      <Card styles={cardStyles}>
        <CardHeader styles={{ padding: "1.25em" }}>
          <ModalHeader titleName={titleName} handleClose={hook.close} />
        </CardHeader>
        <CardBody styles={{ padding: "1.25em" }}>
          {children}
        </CardBody>
        <CardFooter styles={{ padding: "0 1.25em 1.25em 1.25em"}}>
          {hook.errorMessage && <ErrorLabel>{hook.errorMessage}</ErrorLabel>}
          <ButtonSection>
            <Button
              onClick={handleConfirm}
              styles={{
                theme: confirmButtonTheme,
                padding: "0.7em"
              }}
              >{confirmText}</Button>
            <Button
              onClick={hook.close}
              styles={{
                theme: cancelButtonTheme,
                padding: "0.7em"
              }}
            >{cancelText}</Button>
          </ButtonSection>
        </CardFooter>
      </Card>
    </Modal>
  );
}

export default ConfirmModal;
```
처음에는 위 코드처럼 확인에 관한 속성인 `confirm` 과 취소에 관한 속성인 `cancel` 에 포함된 내부 프로퍼티 타입이 동일함에도 일일히 하나의 Prop으로 전달받는 방식으로 구현했다.

#### 현재
```tsx
interface ButtonOptions {
  text?: string;
  buttonTheme?: ButtonTheme;
  onClick?: () => void;
}

interface Props extends ModalProps {
  title?: string;
  confirm?: ButtonOptions;
  cancel?: ButtonOptions;
}

function ConfirmModal({ hook, title, confirm, cancel, children, ...rest }: Props) {
  confirm = {
    text: '확인',
    buttonTheme: 'primary',
    onClick: () => {},
    ...confirm,
  };

  cancel = {
    text: '취소',
    buttonTheme: 'gray',
    onClick: hook.close,
    ...cancel,
  };

  return (
    <Modal hook={hook}>
      <Card {...rest}>
        <ModalHeader title={title} handleClose={hook.close} />
        <CardBody>{children}</CardBody>
        <CardFooter
          css={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          {hook.errorMessage && <InputMessage css={{ margin: '0 0 0.5em 0' }}>{hook.errorMessage}</InputMessage>}
          <ButtonSection>
            <Button buttonTheme={confirm.buttonTheme} onClick={confirm.onClick}>
              {confirm.text}
            </Button>
            <Button buttonTheme={cancel.buttonTheme} onClick={cancel.onClick}>
              {cancel.text}
            </Button>
          </ButtonSection>
        </CardFooter>
      </Card>
    </Modal>
  );
}
```
나중에 `confirm` 과 `cancel` 객체에 들어간 기본 값을 지정하고, `spread` 연산자로 `Props` 로 전달된 값 덮어 씌워서 재할당 하는 방식으로 변경했다.

### 컴포넌트 스타일링
처음에는 컴포넌트의 스타일링에 `Scss` 를 사용했었다. 그런데 컴포넌트의 `Props` 나 `State` 에 따라서 유동적으로 스타일을 변경해야 하는 일이 있었는데 이런 경우에는 `styled-components` 의 `props` 기능이 유용하다는걸 알게 되었다.

또한 공통 컴포넌트를 `Scss` 로 스타일을 입혔을 경우, 어떤 페이지에서 해당 컴포넌트의 이름과 동일한 클래스 이름을 사용하는 경우에는 스타일 값이 변경되는 경우도 있었다. 찾아보니 `BEM 네이밍` 이라는 방법론으로 해결할 수 있는 듯 했지만, 클래스 이름이 전체적으로 길어지는 느낌이어서 내키지는 않는 방법이었다. 그래서 자주 사용되는 공통 컴포넌트는 `styled-components` 로 스타일링을 하기 시작했다.

그래서 나중에는 몇몇 컴포넌트는 `styled-components` 을 사용하고, 몇몇 컴포넌트는 `Scss` 를 사용하는 결과가 되었는데, 혼재되어 있는 상황이 복잡하다고 느껴져서 나중에는 아예 스타일링에는 `styled-components` 를 사용하기로 결정했다.

### React-Query 사용 방식
#### 초기
```tsx
function VoucherDetailPage() {
  const { voucherId } = Number(useParams().voucherId);

  const { status, data: voucher, error } =
  useQuery<typeof voucherAPI.getVoucherDetail.resType, AxiosError<ErrorType>>
  (queryKey.voucherKeys.detail(voucherId), () => voucherAPI.getVoucherDetail.axios(voucherId));
  
  return (
    ...
  );
}
```
처음에는 `useQuery` 의 제네릭에 **응답 결과의 타입**과, **오류 결과의 타입**을 직접 넣어서 사용하다보니 API 요청을 할 때마다 번거로운 과정이 추가되는 느낌이었다. 그래서 각 요청에 대해서 `useQuery` 훅을 반환하는 커스텀 훅을 만들어서 사용하게 되었다.

#### 현재
```ts
/// @api/query/voucher/useVoucherQuery.ts
export interface ResType extends VoucherItem {
  message: string;
}

export default function useVoucherQuery(
  voucherId: number,
  options?: UseQueryOptions<ResType, AxiosError<ResponseError>>
): UseQueryResult<ResType, AxiosError<ResponseError>> {
  return useQuery({
    queryKey: queryKey.voucherKeys.detail(voucherId),
    queryFn: () => fetchVoucherDetail(voucherId),
    enabled: voucherId !== 0,
    ...options
  });
}
```

```tsx
import useVoucherQuery from '@api/query/voucher/useVoucherQuery';

function Index() {
  const voucherId = Number(useParams().voucherId);
  const { status, data: voucher } = useVoucherQuery(voucherId);
  
  return (
    ...
  );
}
```
API 요청을 수행하는 코드가 훨씬 간결해졌다.

## 아쉬웠던 점
코드를 어떻게 작성해야 깔끔하고 사용하기 좋은지를 여러번 고민했지만 혼자 진행하는 프로젝트이다보니 좋은 방법을 찾는게 쉽지 않았다.

코드를 작성할 당시에는 최선의 방법이라고 생각했었지만 규모가 커지면서 좋은 방법이 아니었다고 깨닫게 되는 경우도 있었고, 이후에 더 좋은 방법을 알게 되었을 때 기존에 누적된 코드를 수정하는 과정에도 시간이 많이 들었다.

그렇다보니 프로젝트의 기능을 구현하기보다는 기존에 작성했던 코드를 수정하는데 더 시간을 할애하게 되었고, 자연스럽게 프로젝트가 완성되기까지 오래 걸리다보니 흥미가 점점 떨어지게 되었다.

이번에 새롭게 사용했던 기술이 `TypeScript`, `React-Query`, `Express-Validator` 였는데 공식 문서를 정독하고 관련 가이드를 확실하게 숙지한 이후에 개발을 시작하기 보다는, 개발을 먼저 시작하면서 마주하는 문제를 해결하는 방식으로 프로젝트를 진행했었기 때문에 시행 착오를 많이 겪었다.

## 얻은 점
그래도 프론트엔드에서 백엔드까지 스스로 구현하고 배포까지 해본 프로젝트를 얻게 되었다. 이를 바탕으로 포트폴리오에 활용하거나 사이드 프로젝트를 함께 할 인원을 찾을 때에도 내 학습 수준을 객관적으로 보여줄 수 있다.

그리고 새로운 기술을 적용할 때엔 항상 공식 문서나 관련 자료를 정독하고 기본기를 탄탄하게 숙지한 이후에 활용하는게 효율적이라는 교훈도 몸소 얻었다.

## 앞으로 해볼 것
### 팀 프로젝트
학부 당시에 과제로 팀 프로젝트가 몇 번 있기는 했지만 사실 정말로 제대로 된 팀 프로젝트는 경험해 보지 못했다.

전공생이라고 해도 모두가 개발자 진로를 생각하지는 않기 때문에 프로젝트에 대한 열정이나 역량도 제각각 다르기 마련이고, 역할을 분담했다고 하더라도 마감 기한 내에 어떻게든 제출하기 위해서는 구현하지 못한 부분을 자연스럽게 다른 팀원이 대신 구현하게 되는 경우가 많았었다.

그렇다보니 일정은 촉박하게 느껴지고, 프로젝트를 통해서 무언가를 배운다기보다는 같은 코드를 여기저기에 중복해서 작성한다던가 해서 어떻게든 결과물만 만들어 내는 것에 초점이 맞춰지게 됐었다.

그래서 프론트엔드, 백엔드, 기획, 디자인 등 자신의 관심 분야가 있는 팀원과 함께 협업하고 결과물을 만드는 경험을 해보고 싶다.

### 기본기 쌓기
기술에 대한 공식 문서를 정독하기 전에 프로젝트를 만들면서 공부했기 때문에 정확하게 알지 못하고 구현하는 경우가 있었다. 그래서 부족했던 부분을 공부할 필요성을 느끼는데, `JavaScript` 에 대해서 잘 몰랐던 부분을 확실하게 알 수 있도록 `MDN` 문서와 `Javascript Deep Dive` 책을 완독해야겠다. 그리고 `TypeScript` 핸드북을 정독해야겠다. 또한 `React-Query` 나 `styled-components` 의 공식 문서도 정독하면서 몰랐던 부분을 정리해야겠다.

### 테스트 코드
기존에 작성한 코드를 리팩토링 할 때마다 실수로 인해서 버그가 발생하지는 않았는지 일일히 기능을 테스트해보는 과정이 복잡했고 시간도 많이 소모됐었다. 이번 프로젝트를 하면서 알게된게 `Jest` 인데, `Jest` 프레임워크로 테스트 코드를 작성하면 리팩토링 하는 과정이 훨씬 수월해보였다. 그래서 `Jest` 를 학습하고 다음 프로젝트에는 적용해봐야겠다.

### 디자인 패턴
코드의 규모가 커질수록 어떻게 **기존의 코드를 중복해서 작성하지 않고 효율적으로 관리하면서도 하나의 컴포넌트가 단일한 책임을 갖도록** 구현할 수 있는지가 많이 고민되었는데 찾아보니 `Headless Component`, `HoC` 등의 여러  패턴들이 있다는걸 알게 되었다.  

`React` 에서 유용하게 사용할 수 있는 디자인 패턴을 공부하고, 다음 프로젝트에는 활용할 수 있도록 해야겠다.