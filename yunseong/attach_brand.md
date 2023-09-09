# 공식 명칭에는 상표 붙이기 - 상표 기법

구조적 타이핑이라는 특성 때문에 가끔 코드가 이상한 결과를 낼 수 있습니다.

```ts
interface Vector2D {
  x: number;
  y: number;
}

function calculateNorm(p: Vector2D) {
  return Math.sqrt(p.x * p.x + p.y * p.y);
}

calculateNorm({ x: 3, y: 4 });

const vec3D = { x: 3, y: 4, z: 1 };
calculateNorm(vec3D); // 정상. 그러나..
```

타입스크립트가 평가하기에는 코드적으로 문제가 없습니다. 하지만 수학적(도메인)으로 따지면 3차원 벡터보다는 2차원 벡터를 사용해야 맞습니다.

함수가 3차원 벡터를 허용하지 않게 하려면 공식 명칭(nominal typing)을 사용해 해결할 수 있습니다.

```ts
interface Vector2D {
  _brand: '2d';
  x: number;
  y: number;
}

function vec2D(x: number, y: number): Vector2D {
  return { x, y, _brand: '2d' };
}

function calculateNorm(p: Vector2D) {
  return Math.sqrt(p.x * p.x + p.y * p.y);
}

calculateNorm(vec2D(3, 4));

const vec3D = { x: 3, y: 4, z: 1 };
calculateNorm(vec3D); // Error!
```

## 런타임에 검사하는 것과 동일한 효과 얻기

상표 기법을 사용해서 타입시스템에서 동작하지만 런타임에 상표를 검사하는 것과 동일한 효과를 얻을 수 있습니다.

예시로 절대경로를 체크하는 코드를 살펴보겠습니다. 런타임에는 절대경로로 시작하는지 체크하기 쉽지만, 타입 시스템에서는 절대 경로를 판단하기 어렵기 때문에 상표 기법을 사용합니다.

```ts
type AbsolutePath = string & { _brand: 'abs' };

function listAbsolutePath(path: AbsolutePath) {
  // ...
}

function isAbsolutePath(path: string): path is AbsolutePath {
  return path.startsWith('/');
}
```

런타임에서 string 타입이면서 \_brand를 가지는 객체는 만들 수 없습니다. (직접 할당 해보세요.)

따라서 AbsolutePath는 온전히 타입 시스템의 영역이 됩니다.

사용처에서 어떻게 사용하는지 좀 더 살펴보겠습니다. 아래 foo는 절대 경로를 사용하는 어떤 함수라고 가정합니다.

```ts
function foo(path: string) {
  if (isAbsolutePath(path)) {
    // 이 구간에서 실제로는 _brand 속성이 없지만, AbsolutePath 로 추론됩니다.
  }
}
```

앞 예시에서 작성한 `isAbsolutePath`는 조건에 통과한다면 AbsolutePath로 추론하게 됩니다.

로직 상 절대경로( `/`로 시작)의 조건을 만족한다면, TS는 해당 path를 AbsolutePath로 추론한다는 말입니다.

하지만 실제로 \_brand를 가지지는 않습니다. 다만, 타입 시스템을 살짝 속임으로써 이득을 얻는다고 생각이 들었습니다. (마치 타입 단언처럼요.)

> ### 잠깐!
>
> 개인적으로는, 책에서 나온 이 예제는 Template Literal Type으로 검사할 수 있다고 생각하였습니다.
>
> ```ts
> type AbsolutePath = `/${string}`;
>
> foobao('/df');
> foobao('/sdfbsb/sdf/fd/3344');
> foobao('1/df'); // error!
> ```
>
> 따라서 앞 예제로 런타임에서 어떤 문자열이나 데이터의 형식을 검사하는 것과 동일하게 타입 시스템에서 검사할 수 있음에 초점을 두고 읽어주시기 바랍니다. ㅎㅎ

## 타입 시스템에서 표현할 수 없는 수많은 속성을 모델링하기

상표 기법은 타입 시스템 내에서 표현할 수 없는 수많은 속성들을 모델링 하는데에도 사용합니다.

목록에서 한 요소를 찾기 위해 이진 검색을 하는 경우를 예시로 들어보겠습니다.

아래 로직은 이해하지 못해도 됩니다. xs라는 배열을 받아, 그 배열안에 x라는 값이 있는지 수행하는 함수라고 생각하시면 됩니다.

```ts
// 로직은 이해하지 않아도 됩니다.
function binarySearch<T>(xs: T[], x: T): boolean {
  let low = 0;
  let high = xs.length - 1;
  while (high >= low) {
    const mid = low + Math.floor((high - low) / 2);
    const v = xs[mid];
    if (v === x) return true;
    [low, high] = x > v ? [mid + 1, high] : [low, mid - 1];
  }
  return false;
}
```

이진 탐색은 아시다시피 정렬된 배열에 한해서 유효합니다. 하지만 TS는 목록이 정렬이 되었다는 걸 보장해주기 힘듭니다.

따라서 상표 기법을 사용해보겠습니다. 아까와 비슷합니다.

```ts
function isSorted<T>(xs: T[]): xs is SortedList<T> {
  for(let i = 0; i < xs.length; i++) {
    if(xs[i] < xs[i-1]) return false;
  }
  return true;
}

function binarySearch<T>(xs:SortedList<T>, x: T) { ... }
```

binarySearch를 사용하려면, **정렬되었다는 상표**가 붙은 SortedList 타입의 값을 사용하거나 isSorted를 호출하여 정렬되었음을 증명해야합니다.
