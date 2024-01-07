# 3장 : 고급 타입

## TS의 독자적 타입 시스템

### any

any 타입은 자바스크립트의 모든 값을 오류 없이 받을 수 있다. 하지만 any를 사용하느 방식은 타입을 명시하지 않은 것과 동일한 효과를 나타낸다. 이전 윤성님이 작성한 글을 자세히 보자.

[](https://github.com/JNU-econovation/hotsix-study/blob/main/yunseong/use_any_narrow.md)

그럼에도 any타입을 사용해야 할 상황을 3가지 정도 들 수 있다.

1. 개발 단계에서 임시로 값을 지정해야할 때
    - 추후 변경될 가능성이 있거나 세부 타입이 확정되지 않은 경우
2. 어떤 값을 받아올지, 넘겨줄지 정할 수 없을 때
    - API 요청 및 응답 처리, 콜백 함수 전달, 타입이 잘 정제되지 않아 파악이 힘든 외부 라이브러리 등을 사용할 때
3. 값을 예측할 수 없을 때
    - Fetch API의 값을 예측할 수 없을 때

> **우형 이야기**
> 

우형 팀에서 any, unknown을 사용한 경험에 대한 이야기

- any : 지양하지만 응답 객체의 구조를 정확히 알 수 없는 상황
- unknown : any보다는 많이 사용함. any는 아무거나, unknown은 잘 모르겠지만 테스트해 나가보자라는 뜻으로 사용할 때가 있다. unknown으로 선언된 것은 에러를 발생시키기에 좀 더 안전하다고 생각한다고 한다.
- ‘’ as unknown as Type의 강제 타입 캐스팅을 쓸 때도 있으나 any와 다를 바 없어 지양해야한다.

### void

아무런 값을 반환하지 않는 함수의 경우 기본적으로 void타입이 사용된다. 

```jsx
const showModal = (type: ModalType): void => {
feedbackSlice.actions.createModal(type);
};
```

위와 같은 방식으로 함수 반환 타입을 void로 지정할 수 있지만 undefined와 null을 직접 사용해서 타입을 지정하는 것이 더 바람직하다고 한다.

### never

최하위 타입인 never타입도 함수와 관련하여 많이 사용한다.

값을 반환할 수 없는 함수를 작성할 때 사용하는데

1. 에러를 던지는 경우
2. 무한 루프를 실행하는 경우

가 있다.

### array

```jsx
const array1: Array<number> = [1,2,3];
// = number[]

const array2: number[] | string[] = [1, 'string
]
```

TS에선 위와 같은 방식으로 배열 타입을 선언할 수 있다.

array타입의 경우 배열의 길이까지는 제한할 수 없는데 그래서 사용하는 것이 **튜플**이다.

```jsx
const tuple: [number] = [1];
```

다음과 같이 길이가 1인 배열을 선언할 수 있다.

useState역시 튜플 타입을 반환하고 길이가 2(상태와 세터)로 제한되있음을 알 수 있다.

또한 튜플은 배열이기 때문에 구조분해 할당이 가능하다.

```tsx
const graph : [number , number] = [12.3 , 32.1];

// Destructuring Tuples
const [x , y] = graph;

console.log(x);  // 12.3
console.log(y);  // 32.1
```

## 타입 조합

### 인덱스 시그니쳐

특정 타입의 속성 이름은 알 수 없지만 속성값의 타입을 알고 있을 때 사용한다.

인터페이스 내부에 [Key: K]: T 꼴로 타입을 명시해주변 되는데 이는 해당 타입의 속성 키는 모두 K 타입이어야 하고 속성값은 모두 T 타입을 가져야 한다는 의미다.

```jsx
interface IndexSignature {
 [key : string]: number;
}
```

[](https://github.com/JNU-econovation/hotsix-study/blob/main/bada/인덱스_시그니처.md)

이전에 바다님이 작성하신 글을 자세히 보자.

인덱스 시그니쳐를 언제 어떻게 써야하는지 알 수 있다.

### 인덱스드 엑세스

특정 속성이 가지는 타입을 조회

```tsx
const PromotionList = [
	{ type: 'product', name: 'chicken' }
	{ type: 'product', name: 'pizza' }
	{ type: 'card', name: 'cheer-up' }
]
```

```tsx
type ElementOf<T> = typeof T[number];
// type PromotionItemType ={type: string; name: string }
type PromotionItemType = ElementOf<PromotionList>;
```

### 제네릭

재사용성을 높이기 위해 사용 하는 문법이다. 타입스크립트도 정적 타입을 가지는 언어이기 때문에 제네릭 문법을 지원하고 있다.

제네릭은 일반화된 데이터 타입, 즉 내부적으로 사용할 타입을 미리 정해두지 않고 타입 변수를 사용해서 해당 위치를 비워 두고 그 값을 사용할 때 타입을 지정하여 사용한다.

```tsx
type ExampleArrayType<T> = T[];
canst array1: ExampleArrayType<string> = ['치킨', '피자', '우동'];
```

### 제한된 제네릭

```tsx
type ErrorRecor<Key extends string> = Exclude<Key, ErrorCodeType> extends never?Partial<RecordKey, boolean>:never;
```

타입 매개변수가 특정 타입으로 묶였을 때 키를 바운드 타입 매개변수라고 부르고 string을 상한 한계라고 한다.

제네릭을 이용해 string타입으로 제한하는 예시다.