### null 병합 연산자

null 병합 연산자 (nullish coalescing operator) ?? 은 nullish한 값(null 혹은 undefined)을 판별하여 or 연산을 하는 연산자이다.
(즉, null 과 undefined를 제외한 모든 Falsy 값을 그대로 리턴하기 위함. )

### 언제 ?? 를 써야할까?

일반적으로 논리 연산자 ||를 사용해 Falsy 체크를 하는 경우가 많다.
(\* Falsy : null, undefined,false, NaN, 0 , "" 등의 거짓 같은 값)

그런데 || 를 사용하면 "" , 0 와 같은 값 또한 false 로 판단하기 때문에 0, "" 값을 유효 값으로 사용해야 하는 경우 원치 않는 결과가 발생할 수 있다.
이럴 때 Nullish 병합 연산자 ??를 사용할 수 있다.

```js
const volume = localStorage.volume || 0.5;
```

로컬에 저장된 volume 값이 있으면 그 값을 volume에 할당하고, 없으면 0.5를 할당하는 연산이다. 이 경우 volume 이 0이라면 false가 되어 volume 은 0.5 가 된다.

```js
const volume = localStorage.volume ?? 0.5;
```

를 사용하면 volume 에 0이 들어오게 할 수 있다.

### null 병합연산자와 타입스크립트

```js
function printMessage(message?: string) {
  console.log(message || "Hello, world!");
}

function printMessage(message?: string) {
  console.log(message ?? "Hello, world!");
}
```

이 경우 default 값을 지정해 줄 때 ||이 아니라 ??을 쓰게 되면 빈 문자열도 출력해준다.
따라서 상황에 맞게 사용하면 의도치 못한 에러를 막을 수 있을것이다.
+)
https://typescript-eslint.io/rules/prefer-nullish-coalescing/
여기서 널 병합 연산자와 config 설정 관련 예제를 확인할 수 있다

---

참고 레퍼런스
https://all-dev-kang.tistory.com/entry/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-null-%EB%B3%91%ED%95%A9-%EC%97%B0%EC%82%B0%EC%9E%90nullish-coalescing-operator-%EC%97%90-%EB%8C%80%ED%95%98%EC%97%AC
https://velog.io/@yejinh/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-null-%EB%B3%91%ED%95%A9-%EC%97%B0%EC%82%B0%EC%9E%90%EC%99%80-%EC%98%B5%EC%85%94%EB%84%90-%EC%B2%B4%EC%9D%B4%EB%8B%9D
https://javascript.plainenglish.io/understanding-nullish-non-nullish-and-asserting-non-nullish-values-in-typescript-5a753fa0254d
