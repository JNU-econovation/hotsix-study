# 📌 Function Overloading

타입스크립트에서 동일한 이름에, **매개 변수만 다른** 여러 버전의 함수를 만드는 것

파라미터의 형태가 다양한 여러 케이스에 대응하는 같은 이름을 가진 함수를 만드는 것

arrow function으로는 오버로딩 불가능

## Using overloading

### Ex) before

```tsx
function padding(a: number, b?: number, c?: number, d?: any) {
    if (b === undefined && c === undefined && d === undefined) {
        b = c = d = a;
    }
    else if (c === undefined && d === undefined) {
        c = a;
        d = b;
    }
    return {
        top: a,
        right: b,
        bottom: c,
        left: d
    };
}

**선언부의 매개변수 수와 함수의 인자값의 수가 일치해야한다.**
```

파라미터만 달라지고 비슷한 로직이 반복되는 경우에 사용한다.

### after

```tsx
//선언부
function padding(all: number);
function padding(topAndBottom: number, leftAndRight: number);
function padding(top: number, right: number, bottom: number, left: number);
//구현부
function padding(a: number, b?: number, c?: number, d?: number) {
  if (b === undefined && c === undefined && d === undefined) {
    b = c = d = a;
  } else if (c === undefined && d === undefined) {
    c = a;
    d = b;
  }
  return {
    top: a,
    right: b,
    bottom: c,
    left: d,
  };
}
```

### 제네릭과의 차이점

![Alt img](img/generic?overloading.png)

- 함수 파라미터에 들어갈 타입을 알고 있고, 파라미터 타입만 달라지고 함수의 로직이 반복된다면 함수 오버로딩 사용
- 어떤 타입이 올지 모르겠고, 타입을 다양한 용도에서 사용하고 싶다면 제네릭 사용

## 📌 Overloading in useRef

리액트에서 상태 변경에 따른 dom을 제어할 때 **1. dom에 접근하기 위해서 2. 리렌더링을 막아 변수를 저장할 때** useRef를 사용한다.

index.d.ts를 봐보면 useRef에 타입이 있다는 것을 알 수 있는데 어떻게 정의되어 있는지 살펴보자.

```tsx
//오버로드 시그니쳐
function useRef<T>(initialValue: T): MutableRefObject<T>; // (1)
function useRef<T>(initialValue: T | null): RefObject<T>; // (2)
function useRef<T = undefined>(): MutableRefObject<T | undefined>; // (3)
```

1. 초기값이 <T>타입을 가지고 있을 때

2. 초기값이 null타입을 허용할 경우

3. 초기값의 타입이 없을 때

### MutableRefObject

말 그대로 변할 수 있는 Ref객체

```tsx
interface MutableRefObject<T> {
  current: T;
}

const numberRef = useRef<number>(0);
const timerRef = useRef<NodeJS.Timeout>();
```

useRef에 DOM이 아닌 일반 변수값을 지정하고 싶을 때에는 초기값을 명확히 넣어주거나, undefined으로 할당하면 된다.

### RefObject

불변 Ref객체 : readonly type

```tsx
interface RefObject<T> {
  readonly current: T | null;
}

const inputRef = useRef<HTMLInputElement>(null);
```

useRef에 DOM이 아닌 일반 변수값을 지정하고 싶을 때에는 초기값을 명확히 넣어주거나, undefined으로 할당하면 된다.

아직 useRef로인한 오류를 경험해본 적은 없지만, 오버로딩의 이해를 통해 Ref오류에 대처할 수 있지 않을까?

tsx를 써본적이 없으니 아주 간단한 예시만 들어보자.

### ex)

```tsx
import React, { useRef } from "react";

const App = () => {
  const localVarRef = useRef<number>(0);

  const handleButtonClick = () => {
		if (localVarRef.current) {
	    localVarRef.current += 1;
	    console.log(localVarRef.current);
		}
  };
```

이런 카운터 기능을 만들었을 때, useRef에 제네릭에 동일한 타입을 줬으므로 ref는 mutable이 되며 변수에 접근과 수정이 가능하게 된다.

```tsx
const localVarRef = useRef<number>(null);

const handleButtonClick = () => {
  localVarRef.current += 1;
  console.log(localVarRef.current);
};
```

하지만 이런식으로 제네릭과 동일한 타입을 주지 않고 null로 초기화했다면 RefObject를 반환하고 프로퍼티를 수정할 수가 없게된다.

```tsx
const inputRef = useRef<HTMLInputElement>(null);
```

dom을 직접 조작해야 하는 Ref에만 null을 초기값으로 넣어주면 된다~
