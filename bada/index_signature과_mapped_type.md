## Index signature

객체가 `<key, value>` 형식이며 key와 value의 타입을 정확하게 명시해야하는 경우 사용한다.

```ts
type userType = {
	[key : string] : string
}

let user : userType = {
	'공격수':'손흥민'
	'수비수':'김민재'
}
```

```ts
// age는 number타입 인데 모든 속성은 string 타입이라 에러가 발생
interface StringType {
  age: number;
  [key: string]: string;
}

// 모든 속성에 union 타입을 사용하면 속성을 지정해줘서 사용할 수 있다.
interface StringType {
  age: number;
  [key: string]: string | number;
}
```

## Mapped type

맵드 타입(mapped type)이란 기존에 정의되어 있는 타입을 새로운 타입으로 변환해 주는 문법을 의미한다.

**예시**

```ts
interface Obj {
  prop1: string;
  prop2: string;
}

type ChangeType<T> = {
  [K in keyof T]: number;
};

type Result = ChangeType<Obj>;
/**
 * {
 *     prop1: number;
 *     prop2: number;
 * }
 */
```

자바스크립트에서 객체 속성의 value를 함수에서 `for in`으로 객체를 순회해 각 속성의 값들을 문자열에서 숫자로 바꿔주는 것과 비슷하다.

```ts
const Obj = {
  prop1: "홍길동",
  prop2: "홍길동",
};

function ChangeValue(T) {
  for (let K in T) {
    T[K] = 1000;
  }
  return T;
}

const Result = ChangeValue(Obj);
/*
{ 
   prop1: 1000, 
   prop2: 1000 
}
*/
```

맵드 타입은 제네릭과 결합하면 매우 강력해진다.

```ts
interface Person {
  name: string;
  age: number;
}

type ReadOnly<T> = {
  readonly [P in keyof T]: T[P];
};

type ParTial<T> = {
  [P in keyof T]?: T[P];
};

type PersonPartial = Partial<Person>;

type ReadonlyPerson = Readonly<Person>;
```

## Index signature vs Mapped type

과일 가격 정보를 갖고있는 `PRICE_MAP` 변수를 정의할 때, index signature와 mapped type으로 정의하면 아래와 같다.

```ts
// index signature
const PRICE_MAP: { [fruit: string]: number } = {
  apple: 1000,
  banana: 1500,
  orange: 2000,
};

// mapped type
const PRICE_MAP: { [fruit in Fruit]: number } = {
  apple: 1000,
  banana: 1500,
  orange: 2000,
};
```

추후에 `Fruit` 타입에 새로운 과일 `mango`가 추가됐을 때 index signature를 사용했다면 가격 정보를 추가하지 않는 실수를 할 수 있다.

하지만 mapped type을 사용했다면 컴파일 에러가 나므로 실수를 방지할 수 있다.

```ts
type Fruit = "apple" | "banana" | "orange" | "mango";

// OK
const PRICE_MAP: { [fruit: string]: number } = {
  apple: 1000,
  banana: 1500,
  orange: 2000,
};

// ERROR: Property 'mango' is missing in type '{ apple: number; banana: number; orange: number; }' but required in type '{ apple: number; banana: number; orange: number; mango: number; }'.
const PRICE_MAP: { [fruit in Fruit]: number } = {
  apple: 1000,
  banana: 1500,
  orange: 2000,
};
```

때문에 key에 특정 타입 별칭을 지정하고 싶을 땐 `mapped type`을 사용하길 추천한다.
