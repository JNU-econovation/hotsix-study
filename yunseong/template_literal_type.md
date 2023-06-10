# 템플릿 리터럴 타입

템플릿 리터럴 타입은, 자바스크립트의 템플릿 리터럴 문법처럼 타입을 선언하고 사용하는 것이다.

## 여러개의 유니온 타입 합치기

예를 들어 여러개의 유니온 타입을 합치는 경우를 생각해보자.

```ts
type Region = 'KR' | 'JP';
type ServerName = `${Region} Server`;
```

```ts
type BoxModel = 'margin' | 'border' | 'padding';
type Place = 'top' | 'bottom' | 'left' | 'right';

type CssStyle = `${BoxModel}-${Place}`;
```

하지만 아직은 효용성이 있는지는 잘 모르겠다.

## 확장성 고려하기

어떤 요소에 이벤트를 등록한다고 가정해보자. 자바스크립트에서 이벤트는 두 가지 방법으로 등록할 수 있다.

```ts
// 1. addEventListener를 사용하는 방식
myElement.addEventListener('click', () => { ... });

// 2. on Handler 에 직접 접근
myElement.onClick = () => { ... }
```

아래와 같이 타입을 선언해보았다.

```ts
// 출처 : toss.tech
// 이벤트 이름이 하나 추가될 때마다....
type EventNames = 'click' | 'doubleClick' | 'mouseDown' | 'mouseUp';

type MyElement = {
  addEventListener(eventName: EventNames, handler: (e: Event) => void): void;

  // onEvent() 도 하나씩 추가해줘야 한다
  onClick(e: Event): void;
  onDoubleClick(e: Event): void;
  onMouseDown(e: Event): void;
  onMouseUp(e: Event): void;
};
```

위 처럼 타입을 선언하면 발생할 수 있는 문제는 무엇인가?

어떤 이벤트 타입이 추가될 때 마다 `EventNames`만 변경해야 하는 것이 아니라 `MyElement`의 타입도 변경해야한다는 문제점이 있다.

템플릿 리터럴 타입을 사용해 변경에 유연하게 대응해보자.

```ts
type EventNames = 'click' | 'doubleClick' | 'mouseDown' | 'mouseUp';

type HandlerNames = `on${EventNames}`;

type Handlers = {
  [key in HandlerNames]: (event: Event) => void;
};
type MyElement = Handlers & {
  addEventListener(eventName: EventNames, handler: (e: Event) => void): void;
};
```

템플릿 리터럴을 좀 더 심도 있이 사용할 수 있는 방법이 무궁무진하지만 이번주는 간단히 알아보는 정도로 마친다.
