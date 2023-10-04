# any를 구체적으로 변형해 사용해 사용하기

any는 자바스크립트에서 매우 큰 범위의 타입이다.

일반적으로는 any보다 더 구체적으로 표현할 수 있는 타입이 존재한다.

따라서 가급적 구체적인 타입을 찾아 타입 안정성을 높이도록 하자.

이 상황은 모두 극단적인 상황이므로, 착한(?) 타입스크립트 개발자는 any사용을 지양하면 좋겠다 ㅎㅎ

## 예제 1. 매개변수로 배열을 받을 때

두 코드 모두 별로지만 미묘한 차이가 있다. 하지만 결국 똥과 설사의 차이랄까..

```ts
function getLengthBad(array: any) {
  return array.length;
}

function getLength(array: any[]) {
  return array.length;
}
```

두 타입 중에 하나를 쓰자면.. 아래를 쓰자. 그 이유는,

- `array.length`의 타입이 체크된다. (위는 체크되지 않는다)
  - 따라서 위 예시에서 반환타입이 `any` 대신 `number`로 추론된다.
- 함수가 호출될 때 매개변수가 배열인지 체크하게 된다.

## 예제 2. 매개변수가 키와 속성이 있는 객체를 받을 때

키와 속성이 있는 객체라 함은 우리가 쓰는 일반적인 객체라고 생각하면 되겠다.

값을 알 수 없는 경우라면 인덱스 시그니처를 사용해 any처럼 선언하면 된다.

```ts
function has12LetterKey(o: { [key: string]: any }) {
  for (const key in o) {
    if (key.length === 12) {
      return true;
    }
  }
  return false;
}
```

### 💡 잠깐! object 타입을 사용할 수 있지 않은가? 왜 인덱스 시그니처 인가?

object 타입은 모든 비 기본형 타입을 포함하는 타입이다.

아래 예시를 보면 object가 어떤 타입을 가지는지 판단하기 편리할 것 이다.

```ts
class C {}
const a: object = 0; // <-- error!
const b: object = ''; // <-- error!
const c: object = [];
const d: object = {};
const e: object = C;
const f: object = undefined; // <-- error!
const g: object = null; // <-- error!
const h: object = { foo: 'bar' };
const i: object = { name: 'sfdfds' };
h.bar; // Property 'foo' does not exist on type 'object'.
```

**object 타입은 객체의 키를 열거할 수는 있지만 속성에 접근할수는 없다! !**

왜 그럴까 생각해본다면, 저번 시간에 바다님이 정리한 글의 이유가 아닐지 싶다. [왜 타입스크립트는 Object.keys의 타입을 적절하게 추론하지 못할까](https://github.com/JNU-econovation/hotsix-study/pull/38)

```ts
function hasTVLetterKey(o: object) {
  for (const key in o) {
    console.log(key);
    console.log(o[key]); // ERROR ! 인덱스 시그니처를 사용하면 접근 가능하다.
  }
}
```

지금까지 any를 구체적으로 변형해 사용하는 방법을 알아보았지만, 그럴수록 any사용을 권장한다는게 아니라 가능하면 타입을 구체화 해서 사용하도록 하자.

## 참고

- https://stackoverflow.com/questions/72795467/why-use-index-signature-key-string-any-instead-of-object-type
