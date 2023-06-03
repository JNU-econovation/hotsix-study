# Type vs Interface

문득 개발을하면서 `type`을 써야할 지, `interface`를 써야할지 고민이 되는 부분이 있었다.

두 가지의 공통점은 무엇이고 차이점은 뭘까? 어떨 때 다르게 쓰는걸까?

## 공통점

대개 `type`과 `interface`는 비슷하게 사용 가능하다.

(1) ✅ 명명된 타입(named type)에 정의된 속성 이외 추가 속성을 할당한다면 오류가 발생한다.

(2) ✅ 인덱스 시그니처를 사용할 수 있다.

(3) ✅ 함수 타입으로 정의할 수 있다.

(4) ✅ 제네릭이 가능하다.

(5) ✅ class를 구현할 때 둘 다 사용 가능하다.

(6) ✅ 이외.. 일반적인 객체의 타입을 명명해주는 것들

### 예시

```typescript
// ---(1)
type T_Human = {
  age: number;
  name: string;
};

interface I_Human {
  age: number;
  name: string;
}

const yunseong: I_Human = {
  age: 25,
  name: 'lys',
  phone: 'iPhone 13', // error! : ts(2322)
};

const yunseong2: T_Human = {
  age: 25,
  name: 'lys',
  phone: 'iPhone 13', // error! : ts(2322)
};
// ---(2)
interface Inter {
  [key: string]: string;
}

type Ty = {
  [key: string]: string;
};
// ---(3)
type Tfunc = (x: number) => string;

interface Ifunc {
  (x: number): string;
}

const ifunc: Ifunc = (x) => `input: ${x}`;
const tfunc: Tfunc = (x) => `output: ${x}`;
// ---(4)
type Point<T> = {
  x: T;
  y: T;
};

interface IPoint<T> {
  x: T;
  y: T;
}
// ---(5)
class HumanT implements T_Human {
  age: number = 25;
  name: string = 'yunseong';
}

class HumanI implements I_Human {
  age: number = 25;
  name: string = 'yunseong';
}
```

## 차이점

차이점은 다음과 같다. 어떤 부분에서는 특히 `interface`가 유용할수도 있고, `type` 이 유용할 수 있다.

### (1) ⚠️ 인터페이스에는 유니온, 인터섹션 타입을 적용할 수 없다.

- 타입은 유니온 연산자, 인터섹션 타입을 활용해 확장할 수 있다.
- 인터페이스는 대신 `extends` 키워드 등을 이용해 확장한다.

다음의 예시는 타입을 확장하는 방식의 차이점을 보여준다. 새로운 각 타입에 `Follow` 를 확장한다고 하면..

```typescript
type Follow = {
  follow: number;
  following: number;
};

type T_Human = {
  age: number;
  name: string;
};

type ExtendT_Human = T_Human & Follow;

interface I_Human extends Follow {
  age: number;
  name: string;
}
```

### (2) ⚠️ 인터페이스는 튜플과 배열 타입을 표현하는 방식에 한계가 있다.

- 튜플 같은 고급 타입을 표현하는데에는 `type`이 필요하다.
- 정 `interface`로 표현할 수 있지만, 튜플에서 사용할 수 있는 배열 메서드등을 사용할 수 없는 한계가 있다. (a)

```typescript
type PointXY = [number, number];
type NameNums = [string, ...number[]];

const pt: PointXY = [0, 0];
const nn: NameNums = ['yunseong', 1, 2, 23];
// ---(a)
interface PointTuple {
  0: number;
  1: number;
  length: 2;
}

const t: PointTuple = [10, 20];

t.map((p) => p + 10); // error: ts(2339)
```

### (3) ⚠️ 인터페이스에는 보강(augment) 기능이 있다.

- type은 같은 이름으로 다시 선언이 불가능 하지만, interface는 가능하다. 이를 '선언적 보강' 이라고 한다.

선언적 보강이 강력한 사례는 날이 갈수록 새로운 기능이 나오는 JS 표준 라이브러리에서 유용하다. 타입스크립트에서는 자바스크립트의 타입을 선언해두는 선언파일이 있다.

예를 들어 es2015에 대한 인터페이스(타입)을 사용하고 싶다면 타입스크립트는 `lib.es2015.d.ts` 를 사용한다.

만약 2023년에 새로운 배열 메서드 `hello` 가 나왔으면, 기존의 선언 파일에 선언되어있는 속성과 병합해 Array는 기존의 기능과 2023년에 등록된 `hello`를 사용할 수 있다.

```typescript
...
interface Array<T> {
    hello: (e:T) => void;
}

const arr = [1,2,3];

arr.hello(1);

```

## 그럼 무엇을 사용해야 하는가?

- 향후 보강이 될 프로젝트라면 `interface`를 사용하는게 좋다.
  - 예시로 어떤 api에 대한 타입 선언을 작성해야 할 경우 `interface`가 좋다.
    - api가 변경될 때 사용자가 인터페이스를 통해 새로운 필드를 병합할 수 있어 유용하다. (배열 예시 처럼)
- 허나 프로젝트 내부적으로 사용되는 타입에 선언 병합이 발생하는 것은 잘못된 설계이다. 이럴 때는 `type`을 사용하자.

## 질문

- 여러분은 어떤 기준으로 type 과 interface를 사용하는지 궁금합니다.

# Reference

- 이펙티브 타입스크립트 아이템13: 타입과 인터페이스의 차이점 알기
- https://yceffort.kr/2021/03/typescript-interface-vs-type
- https://tecoble.techcourse.co.kr/post/2022-11-07-typeAlias-interface/
