# Enum 타입을 사용하지 않는게 좋은 이유

먼저 이 글은, Enum이 어떻게 타입스크립트에서 컴파일 되는지를 알아본다. 이런 특성을 알아보고, 어느 상황에서 Enum을 사용하지 않는게 좋은지 살펴보자.

왜 Enum 타입을 사용하지 않는게 좋은 걸까? 바로 번들러의 Tree shaking 때문이다.

Tree shaking이란, 번들 과정 중 사용하지 않은 코드는 삭제하는 기능이다. 번들러는 이를 통해 번들 크기를 줄일 수 있다.

enum에 대해서도 간단히 소개하자면, enum은 열겨형 변수이다. 임의의 숫자나 문자열을 할당할 수 있고, 공통으로 관리해야 되는 값을 한번에 관리할 수 있어 에러를 줄일 수 있다.

상수를 객체로 할 때와 비슷하게 사용한다.

```ts
enum GRADE {
  FIRST = 1,
  SECOND,
  THIRD,
  FOURTH,
}

const yunseong: GRADE = GRADE.THIRD;
```

특징은 타입스크립트 코드를 자바스크립트의 값 영역에서 사용할 수 있게된다.

이제 왜 사용하면 안되는지 살펴보겠다. 바로 enum이 컴파일되는 방식 때문이다.

enum은 다음과 같이 컴파일된다. 위의 예시를 컴파일 해보자

```js
'use strict';
var GRADE;
(function (GRADE) {
  GRADE[(GRADE['FIRST'] = 1)] = 'FIRST';
  GRADE[(GRADE['SECOND'] = 2)] = 'SECOND';
  GRADE[(GRADE['THIRD'] = 3)] = 'THIRD';
  GRADE[(GRADE['FOURTH'] = 4)] = 'FOURTH';
})(GRADE || (GRADE = {}));
const yunseong = GRADE.THIRD;
```

아마 모듈이라면, export 로 표현될 것이다.

```js
export var GRADE;
```

코드에서 보듯이 enum은 IIFE로 생성이 되어버린다. 그러므로 번들러는 IIFE를 사용하지 않는 코드라고 판단할 수 없어, Tree-shaking을 진행하지 않는다.

따라서 import를 하고 사용하지 않더라도, 번들에 내용이 포함되게 된다.

enum의 방안을 몇 가지 알아보자.

# Union Type 사용

바로 Union Type을 사용하는 것이다.

```ts
export const GRADE = {
  FIRST: 1,
  SECOND: 2,
  THIRD: 3,
  FOURTH: 4,
} as const;

type GRADE = (typeof GRADE)[keyof typeof GRADE];
```

컴파일 결과는 다음과 같다.

```Js
export const GRADE = {
    FIRST: 1,
    SECOND: 2,
    THIRD: 3,
    FOURTH: 4
};
```

Tree Shaking 문제를 피할수는 있지만, 초기 설정 코드가 조금 복잡하다. 단점이라면 enum의 자동 나열 기능을 이용한다고 한다면 불편을 느낄수도 있다고 생각한다.

장점은, JS에서도 별다른 차이없이 사용할 수 있다.

# const enum

const enum과 enum의 차이점은 컴파일될 때, 값이 인라인으로 들어간다는 특징이 있다. 이전의 예시로 비교해본다면,

```ts
const enum GRADE {
  FIRST = 1,
  SECOND,
  THIRD,
  FOURTH,
}

const yunseong: GRADE = GRADE.THIRD;
```

이전의 이 코드는, const enum을 사용한다면 다음과 같이 컴파일된다.

```ts
const yunseong = 3; /* GRADE.THIRD */
```

하지만 꼭 const enum이 정답은 아니다. const enum은 순회가 불가능하다는 점이 있다. 컴파일 시점에 필요한 값만 뽑아내므로, 객체를 따로 생성하지 않기 때문이다.

또한 바벨이 트랜스파일링 하지 못하고, 문자열 값은 유니코드로 생성하여 긴 문자열 같은 경우 빌드 파일의 크기가 커진다.

# 결론

상수화를 하기 위해 const enum, enum, Union Types을 사용할 때는 여러가지 장단점을 따져가며 사용하자.
