# any의 진화를 이해하기

타입스크립트에서 일반적으로 변수의 타입은 변수를 선언할 때 결정된다.

이후 타입가드 등으로 정제할 수 있지만, 새로운 값이 추가되도록 확장할수는 없다.

그러나 any타입은 예외인 경우가 존재한다.

`@woowacourse/mission-utils` 의 `pickUniqueNumbersInRange` 함수를 예시로 봐보자.

(예제 편의 상 함수가 어느정도 각색되었음)

```ts
function pickUniqueNumbersInRange(
  startInclusive: number,
  endInclusive: number,
  count: number
) {
  // 생략: Random.#validateIntsRange(startInclusive, endInclusive, count);
  const result = [];

  for (let i = startInclusive; i <= endInclusive; i++) {
    result.push(i);
  }

  // 생략: return Random.shuffle(result).slice(0, count);
  return result.slice(0, count);
}
```

분명 선언될 때의 result의 타입은 any[]지만, 반환될 때의 result는 number[]임을 알수 있다.

왜냐하면 result 타입은 any[]로 선언되었지만 number 타입을 result에 넣는 순간부터 number[]로 진화(evolve)한다.

주의할 점은 진화는 타입 좁히기랑은 느낌이 다르다. 얼핏보면 타입 좁히기 처럼 보이지만, any의 특성 때문에 다음과 같이 확장됨을 볼 수 있다.

```ts
function someTest() {
  const result = []; // type: any[]
  result.push('a');
  console.log(result); // type: string[]
  result.push(11);
  console.log(result); // type: (number | string )[]
}
```

또한 조건문에서는 분기에 따라 타입이 변할 수도 있다.

```ts
function changeTypeByBranch() {
  let value;
  if (Math.random() < 0.5) {
    value = 'hello';
    value; // string
  } else {
    value = 112;
    value; // number
  }

  value; // string | number
}
```

조건문 안에서 재할당이 일어나면 마지막에 할당된 타입으로 변경된다.

```ts
function changeTypeByBranch() {
  let value;
  if (Math.random() < 0.5) {
    value = 'hello';
    value; // string
  } else {
    value = 112;
    value; // number
    value = /regexp/;
    value; //RegExp
  }

  value; // string | RegExp
}
```

try-catch문에서도 비슷한 메커니즘으로 동작한다.

```ts
function tryCatch() {
  let value = null;
  value; // null;
  try {
    someDanger();
    value = 12;
    value; // number
  } catch (e) {
    console.error(`[ERROR]: 무엇인가 잘못되었습니다.`);
  }
  value; // number | null
}
```

주의할 건 any 타입의 진화는 noImplicitAny가 설정된 상태에서 변수의 타입이 암시적 any인 경우만 발생한다.

즉, any를 명시적으로 선언하면 any가 유지된다.

```ts
function tryCatchAny() {
  let value: any = null;
  value; // any;
  try {
    someDanger();
    value = 12;
    value; // any
  } catch (e) {
    console.error(`[ERROR]: 무엇인가 잘못되었습니다.`);
  }
  value; // any
}
```

정리하자면 any타입의 진화는 암시적 any타입에 어떤 값을 할당할 때만 발생한다.

그리고 어떤 변수가 암시적 any 상태일 때 값을 읽으려하면 오류가 발생한다.

주의할 점은 암시적 any타입은 함수 호출을 거쳐도 진화하지 않는다는 점을 유의해야한다.

코드로 알아보자.

```ts
/** start부터 end까지의 자연수 배열을 반환하는 함수 */
declare function range(start: number, end: number): number[];
function square(start: number, end: number) {
  const result = [];
  range(1, 5).forEach((element) => {
    result.push(element ** 2);
  });
  result; // type : any
}
```

forEach안의 콜백 함수의 내용은 TS의 타입추론에 전혀 영향을 미치지 않고있다. 따라서 이점을 주의해야한다.
