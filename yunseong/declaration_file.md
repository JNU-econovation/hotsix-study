# 선언 파일

## 선언파일이란?

- 확장자를 `.d.ts` 로 나타낼 수 있다.
- 런타임 코드를 포함할 수 없다.
- 사용가능한 런타임 값, 인터페이스, 모듈, 일반적인 타입의 설명만 포함한다.

### 런타임 값 선언

- `declare`키워드를 사용해 런타임에 마치 값이 있듯이 알릴수 있다.
- `declare`로 변수를 선언하면 초깃값이 허용되지 않는다는 점을 제외하고 일반적인 변수 선언과 동일한 구문을 사용한다.

아래처럼 declare키워드로 선언된 변수에 값을 할당하려하면 에러가 난다.

```ts
declare let d: string = 'sdf'; // Error! Initializers are not allowed in ambient contexts.(1039)
```

**앰비언트 컨텍스트란?**

- 타입만 선언할 수 있는 코드 영역. 런타임 코드가 올 수 없다.

### 전역 변수

import 또는 export 문이 없는 타입스크립트 파일은 모듈이 아닌 스크립트로 취급되므로 여기서 선언된 타입을 포함한 구문은 전역으로 사용된다.

### 전역 인터페이스 병합

타입 선언 또한 전역변수처럼 전역으로 존재한다. 인터페이스는 선언 병합되기 때문에 d.ts 선언파일같은 전역 스크립트 컨텍스트는 해당 인터페이스가 전역으로 확장된다.

혹은 경우에 따라 전역으로 타입선언을 사용하기 위해 모듈 파일에도 `declare global` 스페이스를 이용해 전역으로 확장가능하다.

```ts
declare global {
  // ... write in global declare
}
```

## 라이브러리 선언

라이브러리도 전역으로 존재한다. Array, Map, Set등을 별다른 import 없이 사용할 수 있는게 그 이유다.

위와 같은 JS 런타임에 존재하는 모든 전역 객체는 `lib.[target].d.ts` 이름으로 선언된다.(여기서 target은 tsconfig에서 설정할 수 있는 값이다.)

이런 lib 파일들은 `node_modules/typescript/lib ..` 와 같은 경로에서 찾을 수 있다.

## DOM 선언

브라우저 환경에서 사용할 수 있는 DOM을 위한 타입도 존재한다. DOM 타입은 `lib.dom.d.ts`에 저장되어있고, 다른 lib.\*.d.ts 파일에도 저장된다.

종종 사용되는 localStorage 와 sessionStorage에 사용되는 인터페이스를 살펴보면..

```ts
// lib.dom.d.ts
/** This Web Storage API interface provides access to a particular domain's session or local storage. It allows, for example, the addition, modification, or deletion of stored data items. */
interface Storage {
  /** Returns the number of key/value pairs. */
  readonly length: number;
  /**
   * Removes all key/value pairs, if there are any.
   *
   * Dispatches a storage event on Window objects holding an equivalent Storage object.
   */
  clear(): void;
  /** Returns the current value associated with the given key, or null if the given key does not exist. */
  getItem(key: string): string | null;
  /** Returns the name of the nth key, or null if n is greater than or equal to the number of key/value pairs. */
  key(index: number): string | null;
  /**
   * Removes the key/value pair with the given key, if a key/value pair with the given key exists.
   *
   * Dispatches a storage event on Window objects holding an equivalent Storage object.
   */
  removeItem(key: string): void;
  /**
   * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
   *
   * Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set. (Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.)
   *
   * Dispatches a storage event on Window objects holding an equivalent Storage object.
   */
  setItem(key: string, value: string): void;
  [name: string]: any;
}
``;
```

## 패키지 타입 의존성

타입스크립트는 대부분 의존성 내부에서 번들로 제공되는 .d.ts를 감지하고 활용할 수 있다.

예시로 내가 배포한 bottom-sheet 라이브러리가 있다.

이는 타입스크립트로 작성되어도 실제 코드가 돌아가는 부분은 자바스크립트로 작성되어있다.

따라서 이 패키지를 타입스크립트로 쓰는 사람은 내 패키지에 대한 타입이 필요하다.

타입스크립트는 그래서 자바스크립트로 변환할 때 d.ts를 자동으로 만들어준다.

아래 코드가 있으면,

```ts
import React, { PropsWithChildren } from 'react';

import './index.css';
import { createPortal } from 'react-dom';

type BottomSheetProps = {
  isOpen: boolean;
  onToggleOpen: () => void;
};

const BottomSheet = ({
  children,
  isOpen,
  onToggleOpen,
}: PropsWithChildren<BottomSheetProps>) => {
  return (
    <>
      {isOpen &&
        createPortal(
          <div className='bottom-sheet'>
            <div className='back-drop' onClick={onToggleOpen}></div>
            <div className='bottom-sheet-body'>{children}</div>
          </div>,
          document.body
        )}
    </>
  );
};

export default BottomSheet;
```

아래와 같이 d.ts를 생성한다.

```ts
import { PropsWithChildren } from 'react';
import './index.css';
type BottomSheetProps = {
  isOpen: boolean;
  onToggleOpen: () => void;
};
declare const BottomSheet: ({
  children,
  isOpen,
  onToggleOpen,
}: PropsWithChildren<BottomSheetProps>) => JSX.Element;
export default BottomSheet;
```

이 d.ts를 패키지 사용자에게 제공하려면 명확하게 package.json에 명시함으로 제공할 수 있다.

```json
// package.json
  ...
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "module": "dist/index.js",
  ...
```

## DefinitelyTyped

하지만 모든 JS 이용자가 type을 사용하는 건 아니다. 마치 1년전의 나처럼..

여전히 일반 자바스크립트로 작성되는 프로젝트가 있다.

타입스크립트 팀과 커뮤니티는 커뮤니티에서 작성된 패키지 정의를 수용하기 위해 DefinitelyTyped 이라는 저장소를 만들었다.

DT 패키지는 타입을 제공하는 패키지와 동일한 이름으로 npm에 `@types/패키지명` 으로 제공한다.
