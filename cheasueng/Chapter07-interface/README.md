# [인터페이스](https://www.typescriptlang.org/docs/handbook/interfaces.html)

인터페이스는 type과 비해 더 빠른 컴파일러 성능, 클래스와 더 나은객체 상호 운용성을 위해 사용이 된다.

## 7.1 타입 별칭 vs 인터페이스

인터페이스의 특징 및 사용

- 속성 증가를 위해 병합할 수 있다.
  - 이는 내장된 전역 인터페이스 또는 npm 패키지와 같은 외부 코드를 사용할 때 유용하다.
- 클래스가 선언된 구조의 타입을 확인하는데 사용할 수 있지만 타입 별칭은 사용할 수 없다.
- 인터페이스에서 타입 검사기가 더 빨리 동작한다.(새로운 리터럴의 동적 복사보다 더 쉽게 캐시할 수 있는 명명된 타입을 선언함)
- 명명된 객체로 간주되어 어려운 케이스에서 나타나는 오류 메시지를 더 쉽게 읽을 수 있다.

## 7.2 속성 타입

interface도 type처럼 선택적 속성을 가질 수 있다.

### 7.2.2 읽기 전용 속성

읽기 전용으로 만들어주는 readonly속성이 있다. typescript에서만 작동하며, 혹시 모르게 돌아갈 것을 막는다.

### 7.2.3 함수와 메서드

함수를 선언하는 방법을 다음과 같이 2가지 버전으로 지원하는데, 메서드 구문과 속성 구문으로 구분할 수 있다.

- 메서드 구문: 인터페이스 멤버를 member(): void와 같이 객체의 멤버로 호출되는 함수로 선언
- 속성 구문: 인터페이스 멤버를 member: () => void와 같이 독립 함수로 동일하게 선언

```ts
interface HasBothFunctionTypes {
    property: () => string;
    method(): string;
}
```

> 참고로 this를 사용한다면 메서드 함수를 사용하는 것이 더 좋다. 아마 스코프 방식은 this를 상속하지 않는다는 것이 가장 큰 이유인듯 싶다.

### 7.2.4 호출 시그니처

```ts
type FunctionAlias = (input: string) => number;
interface CallSignature {
  (input: string): number;
}

const typedFunctionAlias: FunctionAlias = (input) => input.length;
const typedCallSignature: CallSignature = (input) => input.length;
```

다음과 같이 interface의 호출 시그니쳐는 함수처럼 대체 가능하다. 그리고 추가적으로 더 자세하게 호출이 가능한데 이는 다음을 보자.

```ts
interface FuncitonWithCount {
    count: number;
    (): void;
}

let hasCallCount: FunctionWithCount;

function KeepTrackOfCalls() {
  keepTrackOfCalls.count += 1;
  console.log(`'i've been called ${keepsTrackOfCalls.count} times!`);
}

keepsTrackOfCalls.count = 0;
hasCallCount = keepsTrackOfCalls; // OK

function doesNotHaveCount() {
  console.log("No idea!");
}

hasCallCount = doesNotHaveCount; // Error
```

다음처럼 count같이 내부 변수 부분도 선언할 수 있다.

### 7.2.5 인텍스 시그니처

javascript에서는 객체 속성 조회(loopup)은 암묵적으로 string으로 반환한다.  
그래서 인터페이스의 객체는 문자열 키와 함께 가장 일반적으로 사용한다.

```ts
interface WordCounts { 
  [i: string]: number;
}

const counts: WordCounts = {};
counts.apple = 0;
counts.banana = false; // ㄸㄲ꺢
```

다음의 경우에서는 object가 key로 string을 value로 number를 가지게 된다.

하지만 이는 허점을 만들어 낼 수 있다.

```ts
interface DatesByName {
  [i: string]: Date;
}
const publicDates: DaatesByName = {
    Frankenstein: new Date("1 January 1818"),
}

console.log(publishDates.Beloved.toString());
```

위처럼 코드를 작성해도 Beloved는 undefined이지만 Typescript에서는 Date로 인식해서 compile할 때는 정상작동한다. 즉 typescript에서는 정상작동을 항상 보장하지 않음을 알 수 있다.

#### **속성과 인덱스 시그니처 혼합**

interface는 명명된 속성과 포괄적인 string 인덱스 시그니처를 한번에 퐇마할 수 있다.

```ts
interface HisoricalNovels {
  Oroonoko: number;
  [i: string]: number;
}

const novels: HitoricalNovels = {
  Outlander: 1001,
  Oroonoko: 1688,
};
```

#### **숫자 인덱스 시그니처**

자바는 암묵저으로 객체 속성 조회 키를 문자열로 변환하지만, 객채의 키로 숫자를 가끔 쓸때도 있다.

### 7.2.6 중첩 인터페이스

type처럼 interface도 다음과 같이 중첩해서 사용가능하다.

```ts
interface Novel {
  author: {
    name: string;
  };
  setting: Setting;
}

interface Setting {
  place: string;
  year: number;
}
```

## 7.3 인터페이스 확장

typescript는 다른 interface에서 extends를 통해 복사하여 선언할 수 있다.

```ts
interface Writing {
  title: string;
}

interface Novella extends Writing {
  pages: number;
}

let myVoella: Novella = {
  pages: 195,
  title: 'loopy'
}
```

인터페이스는 기본적인 entity타입에서 다른 entity를 포함하는 superset을 만들 때 매우 유용하다.

### 7.3.1 재정의된 속성

파생 인터페이스는 다른 타입으로 속성을 다시 선언해 기본 인터페이스의 속성을 override할 수 있다.(주의해야 할 것은 더 상위의 개념으로 가능한거지, 하위 개념이나 아예 새로운 것을 시도하는 것은 불가능하다.)

```ts
interface WithNullableName {
  name: string | null;
}

interface WithNonNullableName extends WithNullableName {
  name: string;
}

interface WithNumbericName extends WithNullableName {
  name: number | string // ERROR
}
```

### 7.3.2 다중 인터페이스 확장

여러개의 다른 인터페이스를 확장해서 선언할 수 있다. Java의 [다이아몬드 상속](https://siyoon210.tistory.com/125)문제처럼 여러개의 인터페이스를 상속받으면 문제가 생길 것 같지만, 사실 Java에서도 interface일 때는 여러개의 상속을 받을 수 있다.

## 7.3 인터페이스 병함

인터페이스는 서로 병합이 가능하다.

```ts
interface Merged {
  fromFirst: string;
}

interface Merged {
  fromSecond: string;
}
```

일반적으로 잘 사용하지 않지만, 외부 패키지나 Window등 내장된 전역 인터페이스를 보강하는데는 좋다.

### 7.4.1 이름이 충돌되는 멤버

동일한 이름을 가진 **속성**는 중복해서 만들 수 없다.

```ts
interface MergedProperties {
  same: (input: boolean) => string;
  different: (input: string) => string;
}

interface MergedProperties {
  same: (input: boolean) => string
  different: (input: number) => string; // ERROR
}
```

그럼 다른 언어의 overloading처럼 안될까? 라고 생각했는데 [지원이 안된다](https://www.tutorialsteacher.com/typescript/function-overloading)고 한다.

그래도 두가지 오버로드가 있는 메서드를 만들 수 있다.

```ts
interface MergedMethods {
  differenet(input: string): string;
}

interface MergedMethods {
  different(input: number): string; //OK
}
```
