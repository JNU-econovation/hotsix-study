# 왜 Typescript는 void 타입을 사용해도 값을 return 할 수 있을까?

## void의 기본 선언 방식

`void`는 주로 함수에서 `return`이 없을 경우 리턴 타입으로 `void`를 사용한다.

```ts
function func(): void {
  console.log("a");
}

function errorFunc(): void {
  return "a"; // error: 'string' 형식은 'void' 형식에 할당할 수 없습니다.
}
```

`errorFunc` 함수의 리턴 타입으로 `void`를 명시해 주었기 때문에 `return` 문에서 에러가 발생한다.

```ts
function func(): void {
  return; // OK!
}

function func2(): void {
  return undefined; //OK!
}
```

`undefined`를 리턴하면 에러가 발생하지 않는다.

- Javascript에서는 아무것도 반환하지 않는 함수는 암묵적으로 `undefined` 값을 반환하기 때문이다.
- `void`와 `undefined`는 다른 타입이다.
- 단지 `void` 반환 값으로 `undefined`가 허용될 뿐

## void 타입은 다른 타입의 값을 return 할 수도 있다.

void를 반환 타입으로 지정했을 시, undefined 외에 다른 타입의 값도 반환할 수도 있다.

### 함수 표현식에서 void

```ts
type VoidFunc = () => void;

const myFunc: VoidFunc = function () {
  return "hello"; // OK!
};
const myFunc2: VoidFunc = () => {
  return "hello"; // OK!
};

const a = myFunc(); // const a: void
```

`VoidFunc`라는 타입을 만들고, 함수 표현식에 타임을 지정해서 사용할 경우, 반환 타입이 void 임에도 에러가 발생하지 않는다.

반환 값을 변수에 할당하면 Typescript는 반환 값을 `void`로 추론한다.

### 메서드에서 void

```ts
const car = {
  move(): void {
    return "move!"; // error! : 'string' 형식은 'void' 형식에 할당할 수 없습니다.
  },
  break: function (): void {
    return []; // error! : 'never[]' 형식은 'void' 형식에 할당할 수 없습니다.
  },
};
```

메서드의 리턴 타입으로 `void`를 선언한 경우 에러가 발생한다.

하지만, 메서드의 함수 형태의 타입을 만들고, 객체에 그 타입을 지정한 경우에는 에러가 발생하지 않는다.

```ts
// type alias 대신, interface로 선언해도 마찬가지
type Car = {
  move: () => void;
  break: () => void;
};

const car: Car = {
  move() {
    return "move!"; // OK!
  },
  break: function () {
    return "break!"; // OK!
  },
};
```

Typescript는 js가 런타임에서 발생하는 에러를 사전에 알아차리기 위해 만들어졌다.
그렇다면 왜 Typescript는 왜 이런 void 타입에 대한 예외를 두었을까??

## void에 예외를 둔 이유

### void의 2가지 형태

타입스크립트에서 void는 2가지 형태로 사용할 수 있다.

1. 반환 값이 존재하면 안 된다.(undefined만 반환 가능)
2. return에 어떤 값이 와도 상관 없지만, 사용하지 않는다.

```ts
const target: number[] = [1, 2, 3];
const result: number[] = [0];

target.forEach((el) => result.push(el));
```

`Array.prototype.forEach` 메서드와 `Array.prototype.push` 메서드가 사용되었다.

이 때 push 메서드는 **배열의 길이**를 반환한다.

**push의 정의**

```ts
/**
 * Appends new elements to the end of an array, and returns the new length of the array.
 * @param items New elements to add to the array.
 */
push(...items: T[]): number;
```

`push`의 리턴 타입이 `number`이기 때문에, `forEach` 메서드에서 사용되는 콜백 함수의 리턴 타입은 `number`가 되어야 한다고 생각된다.

**forEach의 정의**

```ts
/**
 * Performs the specified action for each element in an array.
 * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
 * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
 */
forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
```

하지만, 실제 콜백함수의 리턴 값은 void이다.

이 예시에서 우리는 왜 Typescript는 void 반환 타입을 사용해도, 값을 반환할 수 있도록 해두었는지 추론할 수 있다.

TS의 타입 시스템은 **JS의 런타임 동장을 모델링**하는 타입 시스템을 갖고 있으므로, JS를 문제 없이 구현하기 위해 `void` 반환 타입에 예외를 둔 것이다.

forEach 메서드의 인자로 받는 콜백 함수는 어떤 값도 반환하면 안 된다.
하지만, JS에서는 반드시 반환 값이 없는 함수만 콜백함수로 사용되진 않기 때문에 JS와의 호환성을 고려해 Typescript가 이러한 결정을 한 것 같다!

## 결론

1. 타입으로 분리되지 않은 함수 자체에 붙어 있는 void 값은 return 값이 존재하면 안된다.
2. 타입으로 분리되거나 타입이 선언과 할당이 따로 나뉘어 있는 void 값은 값이 존재해도 된다.

void 반환 타입을 사용했는데 값을 반환 했음에도 타입 오류가 나지 않는다면 void 선언 위치를 잘 살펴보자.
