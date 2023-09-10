# 타입 단언보다는 타입 선언

## 타입 단언
컴파일러가 가진 정보를 무시하고 프로그래머가 원하는 임의의 타입을 값에 할당할 때 필요한 것이 **타입 단언**(type assertion)이다.

### 타입 단언 문법

`value as Type` 문법을 사용해 `value`를 `Type` 타입으로 단언할 수 있다.

- `value`에 대한 `Type`을 프로그래머가 확신할 수 있을 때 타입 단언을 이용

## 타입 선언
어떤 변수 또는 값의 타입을 표기하기 위해 **Type Annotation**(타입 표기)을 사용한다.

### 타입 표기 문법
식별자 또는 값 뒤에 콜론(`:`)을 붙여 `value : type`의 형태로 표기한다.

## 타입 단언과 타입 선언의 차이점

- 타입 선언을 이용하면 할당되는 값이 선언된 타입을 만족하는지 검사한다.

- 타입 단언은 강제로 타입을 지정하는 것이기 때문에 타입체커는 할당되는 값이 타입을 만족하지 않더라도 오류를 무시한다

- 안전성 있는 타입 체크를 위해선 **타입 단언보다 타입 선언**을 사용해야 한다.

- 하지만, 타입을 확신할 수 있는 경우에는 타입 단언을 이용해도 된다.

```ts
interface Person {
    name: string;
}

// 타입 선언
const lim: Person = {}; // error
// 타입 단언
const jung = {} as Person; // OK!
```
타입 선언 방식에서는 필요한 프로퍼티가 없으면 에러가 난다.
하지만 타입 단언 방식에서는 에러가 나지 않는다.

타입 단언을 쓰면 타입 체커의 오류를 무시하지만 완전히 무시하는 건 아니다!
```ts
const ko = { name : 100 } as Person;
```
Person의 name의 타입과는 다른 타입이 할당되었다고 에러를 낸다.


## 타입 단언과 제너릭

개발자가 특정 변수의 타입을 **특정 타입이라고 확신**할 수 있는 경우 타입 단언을 사용할 수 있다.

대표적인 예가 DOM에서 Element를 찾는 것이다.
```ts
const button = document.querySelector("#myButton");
```
- querySelector로 받은 `button` 변수의 타입은 `Element | null`이다.

<br />


만약 `button`이 `HTMLButtonElement` 타입이라고 개발자가 확신할 수 있다면 타입 단언을 이용할 수 있다.

```ts
const button = document.querySelector('#myButton') as HTMLButtonElement;
```

<br />

위와 같은 `querySelector` 함수를 제네릭을 이용해 호출 시그니처를 선언할 수 있다.

```ts
querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;

querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;

querySelector<E extends Element = Element>(selectors: string): E | null;
```

- 만일 E의 타입이 명시가 안 된다면 기본값으로 `Element`를 사욯한다.
- 리턴 받고 싶은 타입이 있다면 제네릭에 명시해줄 수 있다.


<br />

```ts
const button = document.querySelector<HTMLButtonElement>("#myButton");
```

타입 단언도 가능하지만 함수의 리턴 타입을 통제할 때 함수 시그니처와 제네릭을 사용하면 더 안전하고 깔끔한 코드를 작성할 수 있을 것이다!!