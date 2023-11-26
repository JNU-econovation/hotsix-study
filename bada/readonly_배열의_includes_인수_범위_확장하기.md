
## 문제
Array에 `as const`를 붙이면 **읽기 전용 array**가 된다. 그리고 값 자체가 타입이 된다.

```ts
const colors = ['red', 'green', 'blue'] as const; // readonly ["red", "green", "blue"]
type ColorType = typeof colors[number] // "red" | "green" | "blue"
function doWithColor(color: ColorType): void {
  // do something
}
```

사용자에게 입력을 받고, 그 입력이 `colors` 내에 존재하는지 확인하기 위한 코드이다.
```ts
const userInput: string = getUserInput();
if (colors.includes(userInput)) { // Error: Argument of type 'string' is not assignable to parameter of type '"red" | "green" | "blue"'.
	doWithColor(userInput); // Error: Argument of type 'string' is not assignable to parameter of type '"red" | "green" | "blue"'.
} else {
	console.log("잘못된 input 입니다.")
}
```
하지만, 타입스크립트가 추론한 `includes()` 함수의 타입을 보면 인자로 `red`, `green`, `blue` 중 하나만 받도록 되어 있다.

그렇기 때문에 colors에서 includes의 인자로 userInput을 넘겨주면 에러가 발생한다.

### 값은 똑같고 타입만 다른 `string` 배열
```ts
const userInput: string = getUserInput();
const typeCheck: string[] = [...colors];
if (typeCheck.includes(userInput)) {
	doWithColor(userInput); // Error: Argument of type 'string' is not assignable to parameter of type '"red" | "green" | "blue"'.
} else {
	console.log("잘못된 input 입니다.")
}
```
- `userInput`은 여전히 `string`
- doWithColor 입장에서 userInput은 `"red" | "green" | "blue"` 뿐 아니라 `"purple"` 과 같은 이상한 값이 들어올 가능성이 있다고 판단하기 때문에 에러가 발생한다.

## Type Predicates

Type Predicates 를 이용해 타입을 좁힐 수 있다.

- `string`은 아주 다양한 것을 포함할 수 있지만, `"red" | "green" | "blue"`은 3개 뿐이다.
- `purplue`은 `ColorType`이 될 수 없고, 오직 `string`만 가능하다.
- 모든 `ColorType`은 `string`이다.

Type Predicates를 한다는 것은 본래 `input`이었던 `userInput` 값을, 직접 검자를 해서 그 값의 타입을 `ColorType`으로 간주한다는 것이다.

```ts
export function contains<T extends string>(
  list: ReadonlyArray<T>,
  value: string,
): value is T {
  return list.some((item) => item === value);
}
```
- return 값: boolean
- 하지만 `: input is ColorType`과 같이 `is` 키워드를 넣어 정의
- `list` : readonly 배열
- `value`: 검사하고자 하는 값

`list` 안에 하나라도 `value`와 일치하는 것이 있다면, `true`를 반환하고, 그렇지 않다면 `false`를 반환하는 함수

`valse is T`의 의미는 `contains` 함수의 결과가 참이라면 `value`를 `T` 타입으로 간주해도 좋다는 뜻이다.

```ts
const userInput: string = getUserInput();
const typeCheck: string[] = [...colors];
if (contains(colors, userInput)) {
  // 올바른 userInput 이다!
  doWithColor(userInput);
} else {
  // 올바르지 않은 userInput 이다!
}
```

이렇게 contains 함수를 사용해 포함 여부를 확인하고 타입을 좁혀주면 더이상 에러가 발생하지 않는다.

## ts-reset
간단하게 ts-reset 라이브러리를 사용하면 includes() 함수에서 발생하는 에러를 해결할 수 있다.

https://www.daleseo.com/ts-reset/