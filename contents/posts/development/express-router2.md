---
title: "Express 서버 라우팅과 컨트롤러 코드 개선"
date: 2023-03-24
update: 2023-03-24
tags:
  - development
  - express
series: "Express 서버로 작성한 프로젝트 코드 구조 리팩토링"
---

사이드 프로젝트의 서버 사이드에서 `Express` 프레임워크를 사용하면서 나는 `express` 객체에 대한 `cookie-parser`, `body-parser` 그리고 `CORS` 정책에 관련한 설정 등을 하나의 파일인 `@config/express.ts`에서 하고, 서버에 오는 요청에 따라 적절한 미들웨어를 동작하게 이어주는 설정은 `@config/router.ts` 에서 하게끔 만들어 놓은 상태였다.  

`@config/router.ts` 파일에서는 포토카드나 소유권 등 특정 리소스에 대해서 동작하는 라우터 모듈을 `router.use()`로 개략적으로만 설정을 해두고, 실제로 API에 실행되는 미들웨어는 `@router/photo`, `@router/voucher` 등의 세부 파일에서 미들웨어를 연결하게끔 했는데 기존의 구현 방식에서 몇 가지 마음에 들지 않는 부분을 발견했다.

## 라우터 모듈
나는 API 경로를 한 눈에 파악하기 쉽게끔 연관된 리소스에 대해서는 하나의 라우터 모듈에서 경로를 지정하고, 실제로 실행되는 로직은 따로 빼놓는 것을 선호한다.  
그렇다 보니 처음에는 아래와 같이 라우터 파일을 작성하였다.

```ts
import express from 'express';
import * as getPhotos from '@controller/photo/getPhotos';
import * as getPhotoDetail from '@controller/photo/getPhotoDetail';
import * as postPhotos from '@controller/photo/postPhotos';
import * as putPhoto from '@controller/photo/putPhoto';
import * as deletePhoto from '@controller/photo/deletePhoto';

const router = express.Router();

router.route('/')
  .get(getPhotos.validator, getPhotos.controller)
  .post(
    postPhotos.uploader.array,
    postPhotos.uploader.errorHandler,
    postPhotos.validator,
    postPhotos.controller);

router.route('/:photocardId')
  .get(getPhotoDetail.validator, getPhotoDetail.controller)
  .put(
    putPhoto.uploader.single,
    putPhoto.uploader.errorHandler,
    putPhoto.validator,
    putPhoto.controller)
  .delete(deletePhoto.validator, deletePhoto.controller);

export default router;
```

이는 `@router/photo`의 예시인데 신경쓰이는 부분은 다음과 같았다.
> 1. 각 컨트롤러 로직마다 파일이 존재하는데, 특정 컨트롤러의 미들웨어 순서를 해당 컨트롤러 파일에서 지정하지 않고 라우터 모듈에서 하고 있다.  
만약 컨트롤러 파일을 수정하다가 미들웨어의 의도한 실행 순서에 변화가 생겼는데 이를 라우터 파일에서 설정해야 하다 보니 실수가 발생할 가능성이 있다.
> 2. 각 컨트롤러 파일에서 `export`하는 `uploader`, `validator`, `controller` 등의 모듈을 일일히 라우터 모듈에서 `import` 해야 하는데 번거롭다.

이를 수정하기 위해서 각각의 API에 대해서 실행해야 하는 미들웨어 순서는 실제 로직이 존재하는 컨트롤러 파일에서 지정하도록 하였다.
먼저 수정된 라우팅 파일은 다음과 같다.

```ts
import express from 'express';
import getGroups from '@controller/group/getGroups';
import postGroup from '@controller/group/postGroup';
import putGroup from '@controller/group/putGroup';
import getGroupDetail from '@controller/group/getGroupDetail';
import deleteGroup from '@controller/group/deleteGroup';
import postMember from '@controller/group/member/postMember';

const router = express.Router();

router.route('/')
  .get(getGroups)
  .post(postGroup);

router.route('/:groupId')
  .get(getGroupDetail)
  .put(putGroup)
  .delete(deleteGroup);
  
router.post('/:groupId/member', postMember);

export default router;
```

## 컨트롤러 모듈
```ts
export const uploader = imageUploader('image[]', PHOTO_IMAGE_DIR);

export const validator = [
  isAdmin,
  body('groupId')
    .isNumeric().withMessage("그룹 ID는 숫자여야 해요.").bail()
    .custom((value: number, { req }) => value != 0).withMessage("그룹을 선택해주세요.").bail(),
  body('memberId')
    .isNumeric().withMessage("멤버 ID는 숫자여야 해요.").bail()
    .custom((value: number, { req }) => value != 0).withMessage("멤버를 선택해주세요.").bail(),
  body('name').isArray({ min: 1 }).withMessage('포토카드를 등록해주세요.'),
  body('name.*').trim()
    .notEmpty().withMessage('포토카드 이름이 비어있어요.').bail()
    .isString().withMessage('포토카드 이름은 문자열이어야 해요.').bail()
    .isLength({ min: 1, max: 100 }).withMessage('포토카드 이름은 최대 100글자까지 입력할 수 있어요.').bail(),
  validate
]

export const controller = async (req: Request, res: Response, next: NextFunction) => {
  const groupId = Number(req.body.groupId);
  const memberId = Number(req.body.memberId);
  const name = req.body.name as unknown as string[];
  const files = req.files as Express.Multer.File[];

  // 포토카드 추가 관련 로직 ..
  return res.status(200).json({ message: '새로운 포토카드를 등록했어요.' });
  next();
}
```

이는 포토카드 추가에 관련된 기능을 하는 `@controller/postPhotos`의 예시이다.  
살펴보면 우선 `uploader`를 통해서 파일 업로드에 관한 처리를 해야 하고  그 다음에는 `validator`를 통해서 사용자로부터 넘어온 입력 데이터의 유효성을 검사해야한다.  
그 다음으로는 실제로 데이터베이스를 핸들링하는 서비스 로직을 호출하는 등의 기능을 `controller`를 통해서 진행하게 되는데 이러한 처리 과정에는 순서가 명확하게 존재한다. 그런데 각 컨트롤러에 대한 모듈을 개발하다가 실행 순서를 라우터 파일에서 수정해야 하다보니 실수가 발생할 가능성이 높았다.  

또한 `params`, `query`, `body` 등의 데이터는 `controller` 에서 데이터를 `sanitizing` 하거나 타입을 강제지정 하는 것 보다는, 유효성 검사를 진행하는 `validator` 에서 함께 진행하고 타입은 파일의 상단에 적어놓는 것이 코드 작성에 실수를 줄이겠다는 생각을 하게 되었다.  

그래서 수정된 코드는 다음과 같은 구조를 가지게 되었다.

```ts
interface Body {
  groupId: number;
  memberId: number;
  names: string[];
}

const validator = [
  isAdmin,
  body('groupId')
    .customSanitizer(v => Number(v))
    .isNumeric().withMessage("그룹 ID는 숫자여야 해요.").bail()
    .custom(v => v > 0).withMessage("그룹을 선택해주세요.").bail(),
  body('memberId')
    .customSanitizer(v => Number(v))
    .isNumeric().withMessage("멤버 ID는 숫자여야 해요.").bail()
    .custom(v => v > 0).withMessage("멤버를 선택해주세요.").bail(),
  body('names')
    .isArray({ min: 1 }).withMessage('포토카드를 등록해주세요.'),
  body('names.*')
    .trim()
    .notEmpty().withMessage('포토카드 이름이 비어있어요.').bail()
    .isString().withMessage('포토카드 이름은 문자열이어야 해요.').bail()
    .isLength({ min: 1, max: 100 }).withMessage('포토카드 이름은 최대 100글자까지 입력할 수 있어요.').bail(),
  validate
]

const controller = async (req: Request, res: Response, next: NextFunction) => {
  const { groupId, memberId, names } = req.body as Body;
  const files = req.files as Express.Multer.File[];

  // 포토카드 추가 관련 로직 ..
  return res.status(200).json({ message: '새로운 포토카드를 등록했어요.' });
  next();
}

const uploader = imageUploader('images[]', PHOTO_IMAGE_DIR);

const postPhotos = [
  uploader.array,
  uploader.errorHandler,
  ...validator,
  controller
];

export default postPhotos;
```

위 코드를 살펴보면 변화된 점은 다음과 같다.
> 1. 입력 파라미터의 타입을 상단에 작성.
> 2. `validator` 에서 입력 파라미터의 유효성 검사 및 `Sanitizing`도 함께 진행.  
> 2. `validator`, `controller` 등을 직접 export 하지 않는 대신에 모듈의 실행 순서를 배열 형태로 담아서 export 함.