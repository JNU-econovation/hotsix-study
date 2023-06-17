# [Typescript 5.1 new](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-1.html)

## return에 `undefined`를 선언하기 더 쉬워졌다

javascript에서는 `return`을 붙이지 않고 함수를 종료하면 함수의 반환 값은 undefined입니다.

```js
function foo() {
  // no return
}

// x = undefined
let x = foo();
```

그러나 이전 버전의 TypeScript에서는 반환 값을 주지 않는 function은 void나 any를 가졌습니다. 이 의미는 "`undefined`를 반환 하는 함수"라는 것을 명시하기 위해서는 최소한 한개의 반환문이 있어야 합니다.

```ts
// ✅ fine - we inferred that 'f1' returns 'void'
function f1() {
    // no returns
}
// ✅ fine - 'void' doesn't need a return statement
function f2(): void {
    // no returns
}
// ✅ fine - 'any' doesn't need a return statement
function f3(): any {
    // no returns
}
// ❌ error!
// A function whose declared type is neither 'void' nor 'any' must return a value.
function f4(): undefined {
    // no returns
}
```

`undefined`를 반환하는 함수를 만드는 API를 만들때 힘들 수도 있습니다. 즉 한개 이상의 `undefined`나 `return`이 명시되어야 한다는 것입니다.

```ts
declare function takesFunction(f: () => undefined): undefined;
// ❌ error!
// Argument of type '() => void' is not assignable to parameter of type '() => undefined'.
takesFunction(() => {
    // no returns
});
// ❌ error!
// A function whose declared type is neither 'void' nor 'any' must return a value.
takesFunction((): undefined => {
    // no returns
});
// ❌ error!
// Argument of type '() => void' is not assignable to parameter of type '() => undefined'.
takesFunction(() => {
    return;
});
// ✅ works
takesFunction(() => {
    return undefined;
});
// ✅ works
takesFunction((): undefined => {
    return;
});
```

위와 같은 행동은 사용자가 제어할 수 없는 함수를 호출할 때 답답하고 혼란스러울 수 있습니다. undefined와 void의 상호작용을 이해하거나 `undefined` 함수에 `return`이 필요한지 여부 등의 상호 작용을 이해하는 것은 복잡해보였습니다.

첫번째로, TypeScript 5.1은 아무것도 반환하지 않는 함수에 대해서 `undefined`를 허용합니다.

```ts
// ✅ Works in TypeScript 5.1!
function f4(): undefined {
    // no returns
}
// ✅ Works in TypeScript 5.1!
takesFunction((): undefined => {
    // no returns
});
```

두번째로, 함수에 반환 표현이 없고 `undefined` 함수를 반환할 것으로 예상되는 함수로 전달되는 경우 TypeScript는 해당 함수의 반환값을 `undefined`로 추론합니다.

```ts
// ✅ Works in TypeScript 5.1!
takesFunction(function f() {
    //                 ^ return type is undefined
    // no returns
});
// ✅ Works in TypeScript 5.1!
takesFunction(function f() {
    //                 ^ return type is undefined
    return;
});
```

또 다른 유사한 문제점을 해결하기 위해서 TypeScript에서 `--noImplicitReturns`옵션을 넣으면 `undefined`만 반환하는 함수는 `void`와 비슷하게 모든 코드는 return으로 끝나야한다는 명시를 해야한다고 줄 수 있다.

```ts
// ✅ Works in TypeScript 5.1 under '--noImplicitReturns'!
function f(): undefined {
    if (Math.random()) {
        // do some stuff...
        return;
    }
}
```

더 자세하게 알고 싶다면 [원본의 이슈](https://github.com/microsoft/TypeScript/issues/36288)와 [PR](https://github.com/microsoft/TypeScript/pull/53607)을 보면 된다.

## Getters와 Setters의 관계없는 타입

TypeScript 4.3에서는 `get`과 `set`을 두개의 다른 타입으로 짝지어서 명시가 가능했다.

```ts
interface Serializer {
    set value(v: string | number | boolean);
    get value(): string;
}
declare let box: Serializer;
// Allows writing a 'boolean'
box.value = true;
// Comes out as a 'string'
console.log(box.value.toUpperCase());
```

처음에 저희는 `get`타입을 `set`타입의 subtype이어야 하게 만들었습니다. 즉 다음과 같이 작성할 수 있습니다.

```ts
box.value = box.value;
```

위와 같은 수식은 항상 유효했습니다.

그러나, 기본 API와 제안된 API에는 getters와 setters사이에 전혀 관련이 없는 유형이 많이 있습니다. 예를 들어, 가장 일반적인 경우인 DOM과 [CSSStyleRule](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleRule)API에 있는 `style` 프로퍼티를 보겠습니다. 모든 스타일 규칙은[CSSStyleDeclartion](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration)에 있는 [style 프로퍼티](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleRule/style)에 있습니다. 그러나, 프로퍼티에 작성을 하려고 시도하면, 이것은 string에서만 실행이 됬을 것입니다.

TypeScript 5.1에서는 명시적인 명명이 있을 경우 `get`과 `set`와 전혀 상관 상관 없는 유형을 허용합니다. 이 버전의 TypeScript에서는 아직 이러한 내장 인터페이스의 유형이 변경되어 있지 않지만, 이제 다음과 같은 방식으로 CSSStyleRule을 정의할 수 있습니다:

```ts
interface CSSStyleRule {
    // ...
    /** Always reads as a `CSSStyleDeclaration` */
    get style(): CSSStyleDeclaration;
    /** Can only write a `string` here. */
    set style(newValue: string);
    // ...
}
```

이것은 `set`에 "valid"한 데이터만 허용하도록 요구하지만, 일부 초기화가 되어 있지 않는 경우 `get`가 `undefined`로 정의할 수 있도록 지정하는 등 다른 패턴도 허용합니다.

```ts
class SafeBox {
    #value: string | undefined;
    // Only accepts strings!
    set value(newValue: string) {
    }
    // Must check for 'undefined'!
    get value(): string | undefined {
        return this.#value;
    }
}
```

사실 이것은 `--exactOptionalProperties`에서 선택적 속성을 검사하는 방식과 유사합니다.

더 자세하게 읽고 싶다면 다음 [PR](https://github.com/microsoft/TypeScript/pull/53417)을 참고하세요.
