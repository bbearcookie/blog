---
title: "Express.js 라우터 기능 개선"
date: 2023-03-24
update: 2023-04-25
tags:
  - development
  - express
series: "Express 서버 프로젝트 리팩토링"
---

## 프로젝트 구조
```
src
├── config
│   ├── express.ts
│   ├── router.ts
├── router
│   ├── photo.ts
│   ├── voucher.ts
│   ├── ...
├── controller
│   ├── photo
│   │   ├── getPhotoDetail.ts
│   │   ├── ...
│   ├── voucher
│   │   ├── getVoucherDetail.ts
│   │   ├── ...
├── app.js
```

### 라우터와 컨트롤러의 분리
요청의 URI에 따라 실행할 미들웨어를 매칭해주는 부분을 `@router` 가 담당하게 하고, 실제 미들웨어의 로직은 `@controller` 에 작성해서 이후에 프로그램에 존재하는 API가 무엇이 있는지 확인해야 하거나, 수정해야 할 때 용이하도록 `@router` 디렉토리를 확인하여 복잡한 로직 없이 경로에 대한 매칭 정보만 확인할 수 있게 했다.

### 문제점
로직을 매칭하는 부분과 실제 로직 코드를 분리한 것은 좋았으나, `@router` 디렉토리의 파일에서 <b style="color: red">**특정 컨트롤러의 실행 순서까지 작성해야 한다는 점**</b>이 문제였다. 이 때문에 코드가 길어질 수록 아래의 문제점이 발생했다.
> 1. 각 컨트롤러 파일에 존재하는 `uploader`, `validator`, `controller` 등의 요소를 일일이 `import` 해야 하는데 **번거롭다.**
> 2. 이후에 수정하면서 컨트롤러 파일에 존재하는 미들웨어의 실행 순서가 변화해야 한다면 이를 라우터 파일에서 설정해야 하다 보니 **실수가 발생할 가능성**이 있다.

#### 문제 예시
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

### 해결 방법
컨트롤러의 실행 순서는 각 컨트롤러에서 배열 형태로 작성하도록 하고, 라우터에서는 그 배열만 가져와서 사용하도록 변경했다.

#### 해결 예시
##### @router/photo.ts
```ts
import express from 'express';
import getPhotos from '@controller/photo/getPhotos';
import getPhotoDetail from '@controller/photo/getPhotoDetail';
import postPhotos from '@controller/photo/postPhotos';
import putPhoto from '@controller/photo/putPhoto';
import deletePhoto from '@controller/photo/deletePhoto';

const router = express.Router();

router.route('/')
  .get(getPhotos)
  .post(postPhotos);

router.route('/:photocardId')
  .get(getPhotoDetail)
  .put(putPhoto)
  .delete(deletePhoto);

export default router;
```

##### @controller/postPhotos.ts
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

<!-- ## 컨트롤러 모듈
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
> 2. `validator`, `controller` 등을 직접 export 하지 않는 대신에 모듈의 실행 순서를 배열 형태로 담아서 export 함. -->