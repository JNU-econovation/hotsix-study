# 타입 커버리지를 추적하여 타입 안전성 유지하기

noImplicitAny와 암시적 any 대신 명시적 타입구문을 추가해도 any에 대해 안전할 수 없다. 그 이유는 아래 두가지 때문이다.

- 프로젝트에서 사용되는 명시적 any 타입
- 서드파티 타입 선언

그래서 프로젝트의 실질적인 any를 `type-coverage`를 통해 측정할 수 있다.

`npx type-coverage`로 얼마나 type을 커버하고 있는지 나온다. 현재 내가 하고 있는 프로젝트의 결과물이다.

```
10685 / 10909 97.94%
type-coverage success.
```

그럼 어느 부분에서 `any`가 있는지 파악하기 위해 `detail` 옵션을 줘보자.

`npx type-coverage --detail`

```
/Users/iyunseong/woowacourse/2023-stamp-crush/frontend/src/pages/Admin/CustomerList/style.tsx:54:84: colors
/Users/iyunseong/woowacourse/2023-stamp-crush/frontend/src/pages/Admin/CustomerList/style.tsx:54:91: main
/Users/iyunseong/woowacourse/2023-stamp-crush/frontend/src/pages/Admin/CustomerList/style.tsx:59:66: colors
/Users/iyunseong/woowacourse/2023-stamp-crush/frontend/src/pages/Admin/CustomerList/style.tsx:59:73: main

...
/Users/iyunseong/woowacourse/2023-stamp-crush/frontend/src/assets/index.ts:5:21: AdminKakaoLoginButton
/Users/iyunseong/woowacourse/2023-stamp-crush/frontend/src/assets/index.ts:5:10: default
/Users/iyunseong/woowacourse/2023-stamp-crush/frontend/src/assets/index.ts:6:21: CustomerKakaoLoginButton

...

/Users/iyunseong/woowacourse/2023-stamp-crush/frontend/src/mocks/handlers.ts:33:13: businessRegistrationNumber
/Users/iyunseong/woowacourse/2023-stamp-crush/frontend/src/mocks/handlers.ts:33:41: name
/Users/iyunseong/woowacourse/2023-stamp-crush/frontend/src/mocks/handlers.ts:33:47: roadAddress
/Users/iyunseong/woowacourse/2023-stamp-crush/frontend/src/mocks/handlers.ts:33:60: detailAddress
```

엄청나게 많이 나왔는데, 대충 보아하니 msw 핸들러, assets등의 선언과 가장 많았던 부분은 style 관련 코드였다.

```
msw등은 ts로 작성했지만 any를 자주사용하였고, style관련 코드는 어떻게 type-safe하게 쓸 수 있을까?
```
