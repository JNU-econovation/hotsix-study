# Typescript를 계속해서 사용해야할까?

최근 Typescript를 쓰는 곳에서는 사용하지 않으려는 움직임이 있다. 대체 왜 그런 변화가 생겼을까?  
타입스크립트를 버린 사람들의 이야기를 들어보자.

## Turbo

Turbo에서 Typescript를 쓰던 것이 제거가 되었다.  
글 쓴 이의 말로는 Typescript로 개발하는데 있어서 많은 괴로움이 있다고 한다. 우리는 아직 Typescript를 쓰면서 그 괴로움을 많이 접하지 않았을 것이다. 이 라이브러리를 만드는 사람은 그런 괴로움을 겪고 싶지 않기도 하고 javascript의 prototype의 이념과 멀어지는 typescript를 좋아하지 않는 모습을 보여준다.

갑자기 개발을 하던 라이브러리에서 다른 사람들과 토론을 하지 않고 Typescript를 제거를 한 탓인지, Typescript 개발자들은 반발이 심했다. 이에 Turbo를 개발한 다비드 하이네마이어 핸슨은 [오픈소스의 홀리건 주의와 Typescript 멜트다운](https://world.hey.com/dhh/open-source-hooliganism-and-the-typescript-meltdown-a474bfda)이라는 글을 작성하였다.

이 글의 핵심은 각자 자기만의 이념을 인정하자는 것이다. 그만 비난하라는 것인데, 사실 이 비난은 오픈소스라는 명목을 버리고 혼자서 Typescript를 병합하는 것에 대한 욕이라는 것을 알아야 한다.(그러니깐 논점을 흐리게 보지 말고 오픈소스의 마음가짐을 다시 다잡자)

그렇다면 우리는 Typescript를 배워야 할까? 절대적으로 배워야 한다. 왜냐하면 Typescript를 알고 욕하는 것과 모르고 욕하는 것은 다르며, 현재 우리가 가고 싶은 대부분의 기업들은 Typescript를 지원하기 때문이다.(심지어 없으면 type을 만들어내는 종족들도 있다.)

## svelte

이 일 이전에 svelte에서 Typescript를 버리기도 하였다. 다만 이것은 절반 정도 버린 것이다. Typescript 대신에 JSDoc을 이용한다는 것이다. JSDoc을 사용하면 Typescript를 사용하는 사람들도 이를 사용할 수 있을 것이다.

이런 결정을 한 것은 단순히 개발을 더 편하게 하려고 하는 것이다. Typescript에서 디버깅을 할 때 불편한 것은 사실이다. 단순히 그 개발을 더 편하게 할 뿐이다.

그렇다면 JSDoc은 무엇일까?

### JSDoc

[Typescript는 JSDoc](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#handbook-content)을 지원한다.

이를 간단하게 살펴보자.(다른 사람들하고 협업한다면 기능적인 함수나 common함수에 대해서 JSDocs를 사용하는 것도 나쁘지 않는 것 같다.)

지원 되는 것은 다음과 같다.@type, @param(@arg, @argument), @returns(@return) @typedef, @callback, @template, @satisfies, Property Modifiers(@public, @private, @protected, @readonly), @override, @extends(@augemtns), @implements, @class(@constructor), @this ...  
정말 많은 내용을 지원하는 것을 알 수 있다. 사실 Typescript를 배웠다면 더 쉽고 간편하게 쓸 수 있을 것이다.

```ts
/**
 * @type {string}
 */
let s;

/** @type {PromiseLike<string>} */
let promisedString;

/** @type {string | boolean} */
let sb;

// 심지어 여기서는 더 대단한 것을 지원한다
/** @type {function(string, boolean): number} */
let sbn;
/** @type {(s: string, b: boolean) => number} */
let sbn2;
```

이 외에도 내용을 정의 할 수 있는데 이정도면 Typescript가 아닌가 싶을 정도이다.

```ts
/**
 * @typedef {Object} SpecialType - creates a new type named 'SpecialType'
 * @property {string} prop1 - a string property of SpecialType
 * @property {number} prop2 - a number property of SpecialType
 * @property {number=} prop3 - an optional number property of SpecialType
 * @prop {number} [prop4] - an optional number property of SpecialType
 * @prop {number} [prop5=42] - an optional number property of SpecialType with default
 */

/** @type {SpecialType} */
var specialTypeObject;
specialTypeObject.prop3;
```

그리고 4.9버전에 추가된 @satisfies도 또한 된다는 것을 확인할 수 있다. 역시 google인듯 싶다.

더 잘 써보고 싶다면 [다음](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#handbook-content) 사이트에서 찾아보면 좋을 것이다.

[Turbo hada](https://news.hada.io/topic?id=10779)
[Turbo 8](https://world.hey.com/dhh/turbo-8-is-dropping-typescript-70165c01)
[Svelte Typescript 포기](https://typefully.com/dylayed/svelte-typescript-jsdoc-XalfMuZ)
