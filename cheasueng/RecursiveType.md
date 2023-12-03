# 재귀

알고리즘을 많이 풀어보면 재귀를 많이 사용하기도 한다. 다이나믹으로 풀어낼 수 있기 때문이다.  
현실세계에서도 문제를 해결하기 위해 재귀를 많이 사용하기도 한다. 예를 들면 econo recruit에서 보면 질문에 따라서 타입을 다르게 생성하는 경우이다.

이 글에서는 JSON을 나누어 보는 것으로 보겠다.

## 재귀 타입

재귀 타입은 타입을 무한정으로 확대하고 싶을 때 사용한다. 예를 들면 다음과 같이 중첩된 상태로 정의하면 멋있는 코드가 생성된다.

```ts
type ValueOrArray<T> = T | ArrayOfValueOrArray<T>;
interface ArrayOfValueOrArray<T> extends Array<ValueOrArray<T>> {}
```

이렇게하면 서로 돌아가면서 느슨하게 타입을 만들어 재귀 타입을 지정할 수 있다. 사실 이것보다 더 쉽게 아래와 같이 만들 수 있다.

```ts
type ValueOrArray<T> = T | Array<ValueOrArray<T>>;
```

타임 별칭을 사용할 때 배열타입으로 인자를 정하면 컴파일러가 인자 티입을 늦게 평가하기 때문에 가능하다.

제이튼 타입도 이런식으로 표현이 가능하다.

```ts
type Json =
  | string
  | number
  | boolean
  | null
  | undefined
  | Json[]
  | { [key: string]: Json };
```

즉 타입도 늦게 평가를 하면 재귀 타입을 통해서 간편하고 쉽게 평가할 수 있다는 것이다.
