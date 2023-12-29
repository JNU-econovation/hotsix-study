# 1주차 책 정리

## p58. enum vs const enum

이 부분은 이전에 올린 [enum 타입을 사용하지 않는게 좋은 이유](https://github.com/JNU-econovation/hotsix-study/pull/53) 에 잘 정리되어있어, 이 PR로 갈음한다.

## p64. 값 공간에서의 typeof와 타입 공간에서의 typeof

값 공간에서 typeof 와 타입공간에서의 typeof 는 다르게 사용된다.

예시를 통해 살펴보자.

```ts
class Developer {
  name: string;
  sleepingTime: number;
  constructor(name: string, sleepingTime: number) {
    this.name = name;
    this.sleepingTime = sleepingTime;
  }
}

const d = typeof Developer;
type T = typeof Developer;

console.log(d); // function
```

d의 값이 function으로 나오는 이유는 Class Developer는 생성자 함수로 취급하기 때문이다.

그래서 값으로써 타입을 체크할 때는 typeof 대신 instanceof를 쓰자. (꼭 값으로 체크하는 것이 instanceof만 있는 것은 아니다. 프로퍼티를 체크해 타입을 좁힐 수도 있다.)

```ts
// 위 예시와 이어서 ...
const dev = new Developer('yunseong', 8);
console.log(dev instanceof Developer); // true
```

타입으로써 체크하는 방법은 `is` keyword를 사용한 커스텀 타입가드를 만들어 해결할 수 있다.

```ts
function isDeveloper(params: any): params is Developer {
  return params.hasOwnProperty('name');
}

console.log(isDeveloper(dev));
```

## p69. number와 bigint는 상호작용이 불가능

- bigint에 number는 할당 가능한가?
  - 아니다. 서로 상호작용 되지 않는다.

```ts
const bigNumber1: bigint = BigInt(999999999999); // ES2020 전에만 유효
const num: number = 21;
const test = bigNumber1 - num; // 계산 불가. Error
```

## p70. symbol 자료형

먼저 심볼에 대해 간단히 알아보자. 심볼은 유일한 식별자를 만들 때 사용한다.

```js
const id = Symbol();
```

심볼을 만들 때에는 심볼 이름이라는 설명을 붙일 수 있다.

```js
const id = Symbol('id');
```

심볼은 그 자체로 고유한 값이라고 볼 수 있다. 따라서 고유한 프로퍼티를 만들 때 사용한다.

```ts
const id = Symbol('id');
const user: any = {};

user.id = 'this is literal';
user[id] = 'this is Symbol';

console.log(user.id); // this is literal
console.log(user[id]); // this is symbol
```

심볼은 사실 잘 안쓰인다고 해서 여기까지만 알아보자. (공식문서에도 별다른 설명이 없다.)
