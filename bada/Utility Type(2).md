## Parameters<\Type>
`Type` 에서 파라미터 타입을 추출하는 데 사용되는 유틸리티 타입
- 함수 타입의 파라미터 타입을 담은 **`튜플 타입`** 을 생성

```ts
// 1. 빈 함수
type T0 = Parameters<() => string>; // T0: []

// 2. 문자열 파라미터를 갖는 함수
type T1 = Parameters<(s: string) => void>; // T1: [s: string]

// 3. 제네릭 함수
type T2 = Parameters<<T>(arg: T) => T>; // T2: [arg: unknown]

// 4. 특정 함수
declare function f1(arg: {a: number; b:string }): void;

type T3 = Parameters<typeof f1>; // T3: [arg: {a: number; b: string; }]
```

```ts
// 5. any
type T4 = Parameters<any>; // T4: unknown[]

// 6. never
type T5 = Parameters<never>; // T5: never

// 7. 함수가 아닌 타입
type T6 = Parameters<string>; // T6: any
// Error: Type 'string' does not satisfy the constraint '(...args: any) => any'

// 8. Function
type T7 = Parameters<Function>; // T7: any
// Error: Type 'Function' does not satisfy the constraint '(...args: any) => any'
```

## ConstructorParameters<\Type>
생성자 함수 타입에서 파라미터의 타입을 추출하여 `튜플` 또는 `배열` 타입 생성

```ts
// 1. ErrorConstructor
type T0 = ConstructorParameters<ErrorConstructor>; // T0: [message?: string | undefined]

// 2. FunctionConstructor
type T1 = ConstructorParameters<FunctionConstructor>; // T1: string[]

// 3. RegExpConstructor
type T2 = ConstructorParameters<RegExpConstructor>; // T2: [pattern: string | RegExp, flags?: string]


// 4. class constructor
class C {
	constructor(a: number, b: string) {}
}

type T3 = ConstructorParameters<typeof C>; // T3: [a: number, b: string]
```

```ts
// 5. any
type T4 = ConstructorParameters<any>; // T4: unknown[]

// 6. Function
type T5 = ConstructorParameters<Function>; // T5: never
// Error: Type 'Function' does not satisfy the constraint 'abstract new (...args: any) => any'
```
## ReturnType<\Type>
함수 타입 `Type` 의 반환 타입을 추출하여 새로운 타입 생성
- 함수가 오버로드된 경우, 마지막 시그니처의 반환 타입

```ts
// 1. 빈 함수
type T0 = ReturnType<() => string>; // T0: string

// 2. void
type T1 = ReturnType<(s: string) => void>; // T1: void

// 3. 제네릭 함수
type T2 = ReturnType<<T>() => T>; // T2: unknown

// 4. 제네릭 함수 2
type T3 = ReturnType<<T extends U, U extends number[]>() => T>; // T3: number[]

// 5. 특정 함수
declare function f1(): { a: number; b: string };
type T4 = ReturnType<typeof f1>; // T4: { a: number; b: string }

// 6. any
type T5 = ReturnType<any>; // T5: any

// 7. never
type T6 = ReturnType<never>; // T6: never

// 8. 함수가 아닌 타입
type T7 = ReturnType<string>; // T7: any
// Error: Type 'string' does not satisfy the constraint '(...args: any) => any'

// 9. Function 타입
type T8 = ReturnType<Function>; // T8: any
// Error: Type 'Function' does not satisfy the constraint '(...args: any) => any'

```


## InstanceType<\Type>
생성자 함수의 인스턴스 타입 추출

```ts
// 1. class
class C {
	x = 0;
	y = 0;
}
type T0 = InstanceType<typeof C>; // T0: C

// 2. any
type T1 = InstanceType<any>; // T1: any

// 3. never
type T2 = InstanceType<never>; // T2: never

// 4. string
type T3 = InstanceType<string>; // T3: any
// Error: Type 'string' does not satisfy the constraint 'abstract new (...args: any) => any'

// 5. function
type T4 = InstanceType<Function>; // T4: any
// Error: Type 'Function' does not satisfy the constraint 'abstract new (...args: any) => any'.
// Error: Type 'Function' provides no match for the signature 'new (...args: any): any'.
```


## ThisParameterType<\Type>
- 함수 타입에서 `this` 파라미터의 타입을 추출하는데 사용

```ts
function toHex(this: Number) {
	return this.toString(16);
}

function numberToString(n: ThisParameterType<typeof toHex>) {
	return toHex.apply(n);
}
```
`ThisParameterType<typeof toHex>` 는 `Number`

### apply()
```js
func.apply(context, args);
```
`func`의 `this`를 `context`로 고정해주고, 유사 배열 객체인 `args`를 인수로 사용할 수 있게 해준다.

## OmitThisParameter<\Type>
함수 타입에서 `this` 매개변수를 제거한 함수 타입 생성

```ts
function toHex(this: Number) {
	return this.toString(16);
}

const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);

console.log(fiveToHex()); // 5
```

### bind()
`this`를 수정하게 해주는 내장 메서드

```javascript
let boundFunc = func.bind(context);
```
- `this`가 `context`로 고정된 함수가 반환된다.

```js
let user = {
	firstName: "John"
};

function func(){
	alert(this.firstName);
}

let funcUser = func.bind(user);
funcUser(); // John
```
