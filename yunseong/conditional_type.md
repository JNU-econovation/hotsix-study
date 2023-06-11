# 조건부 타입

조건부 타입은 선행 조건에 따라서 다른 타입을 가지게 된다.

공식문서의 예시를 봐보자.

```ts
interface Animal {
  live(): void;
}
interface Dog extends Animal {
  woof(): void;
}
 
type Example1 = Dog extends Animal ? number : string; // number로 추론
        
type Example2 = RegExp extends Animal ? number : string; // string으로 추론
```
하지만 이 예시로는 왜 필요한지 명확하게 알지 못할 것이다. 개념을 설명하는 예시로는 제격이지만, 실용적이지는 않기 때문이다.

하지만 제네릭 타입과 함께라면 꽤나 유용하게 쓰일 수 있다.

예를 들어 id(number) 가 들어오면 IdLabel, name(string)이 들어오면 NameLabel을 반환하는 함수를 생각해보자. 어떻게 짤 수 있을까?

```ts
interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}
 
function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
  throw "unimplemented";
}
```

하지만 함수 오버로드는 타입스크립트에서 그렇게 권장되는 패턴이 아니다.

또한 각각의 케이스별로 확실한 타입을 가지거나 일반적인 케이스 (`string | number`) 를 가져야 한다.

이는 `createLabel`의 새로운 타입을 다루기 위해선 오버로드의 수는 기하급수적으로 증가한다.

그럼 조건부 타입을 어떻게 활용할 수 있을까?
1. param이 number면 IdLabel 반환
2. param이 string이면 NameLabel 반환

여기서 param의 타입이 T라면, 다음과 같이 작성할 수 있다.

```ts
interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}

type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel;

function createLabel<T extends number | string>(param:T):NameOrId {
    // ..logic
}
```

이러면 들어오는 제네릭에 따라 자동으로 return 타입이 추론되어 편리하다.

