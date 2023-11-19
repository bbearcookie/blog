---
title: "프로그래머스 데브코스 10월 회고"
date: 2023-11-07
update: 2023-11-07
tags:
  - devcourse
series: "데브코스 월간 회고"
---

이제 최종 프로젝트 기간으로 거의 한 달 정도 남았는데, 데브코스 기간도 마무리가 되어간다는 것을 체감하고 있는 요즘이다.

## 1. 모아밤 프로젝트

낮과 밤마다 루틴을 지키고 나만의 새를 커스터마이징하며 키운다는 소재로 프로젝트를 하고 있다.  
기존에 디렉토리 구조나 `Tanstack-Query` 의 쿼리 키를 잘 정리하는 부분이나 컴포넌트의 적절한 추상화에 대한 고민들을 많이 해보면서 실제로 도입해보는 좋은 기회가 되고 있다고 생각한다.

처음 사용해 본 기술로는 `framer-motion` 이나 `Swiper` 같은 것들도 있었는데(이전 프로젝트에 도입하긴 했었지만 내가 구현한 기능에서는 중점적으로 다루지 않았었기에..) UI나 인터랙션을 구현하는 데 굉장히 유용한 라이브러리라고 느꼈다.

물론 라이브러리를 사용하지 않고 실제로 직접 구현해보는 것도 좋은 경험이 되겠지만, 기존에 잘 나와 있는 라이브러리를 빠르게 도입해서 기능을 신속하게 구현할 줄 아는 능력을 쌓는 것도 중요하겠다는 것을 BE 팀원분들과 협업하면서 느끼게 되기도 했다.

## 2. 머쓱레터 배포 파이프라인

머쓱레터 당시에 제공되었던 API 서버는 결국 수료 후 3개월 뒤에는 닫히기에, 계속 사용할 수 있는 서비스로 만들어 놓고 싶기도 하고 발전해나가고 싶다는 생각이 있어서 간단한 API 서버도 구현할 생각이었다.  
이 프로젝트를 할 때에는 배포에 대한 부분을 잘 몰랐었기에 빠르게 이용할 수 있는 `Cloudtype` 이라는 서비스를 이용했었는데, 결국 내가 원하는만큼 유지하기 위해서는 `AWS` 같이 자유도가 높은 클라우드 서비스를 이용해야겠다는 생각이 들었다.

그래서 최종 프로젝트를 하면서 동시에 배포를 알아보며 삽질을 많이 했었는데, 그 과정에서 새롭게 알아가는 부분이 많아서 재미있게 느끼기도 했고 과정을 몇 개의 글로 남겨보려고 했다.  
현재에는 아직 React 앱을 `S3` + `CloudFront` 에 배포한 부분만 기록했지만, 조만간 Express 서버를 배포하는 부분에 대해서도 기록해보고자 한다.

특히 Github Actions를 통한 CI는 너무 흥미로웠다.

## 3. Next.js 공식문서 스터디

본격적인 프로젝트 시작 기간 전에는 팀원분들과 함께 Next.js 스터디를 했었다.

모아밤 프로젝트에까지 도입하지는 못했지만, 그래도 최근 프론트엔드의 동향이 어떻게 흘러가는지를 알 수 있는 좋은 기회가 되었다.