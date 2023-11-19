# Decorator

## AOP가 무엇일까?

AOP는 Aspect Oreinted Programming이라고 관전 지향 프로그래밍이라고 부른다.  
어떤 로직을 기준으로 핵심적인 관점, 부가적인 관점으로 나누어서 보고 그 관점을 기준으로 각각 모듈화하겠다는 것이다.

이는 코드가 더럽게 느껴질 수 있어 단순한 페이지에서는 사용하지 않지만, 복잡한 페이지의 경우에는 사용하면 적합한 방법론으로 받아들여지고 있다.  
하지만 여러가지 단점이 있는데

1. 비지니스 로직에 온전히 집중할 수 있으며 인터페이스와 로직을 통일할 수 있다.
2. 비즈니스 로직만 있으므로 테스트 및 모킹하기도 쉽다.
3. 프레이무어크의 동작을 모르더라도 로직을 작성하는데 문제가 없다.

Typescript에서는 AOP를 위하여 Reflection과 Decorator를 통해서 선언하였다.  
일단 Reflection은 다음번 스터디때 서술하겠다.

## 그럼 Typescript에서 어떻게 구현했을까?

사실 데코레이터는 클래스, 메서드, 프로퍼티, 접근자, 파라미터에만 들어갈 수 있는데 각자 인자의 길이나 리턴 구성이 달라지게 된다.

### Class Decorator

기능의 확장때 보통 사용이 된다.

```ts
function classDecorator<T extends { new (...args: any[]): {} }>(
  constructorFn: T
) {}
```

여기서는 1개의 argument만 되는데 클래스가 넘어오게 되었다. 그래서 다음과 같은 형태로 사용할 수 있다.

```ts
function classDecorator<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  return class extends constructor {
    first_prop = "override";
    new_prop = "new property";
  };
}
```

### Mothod decorator

```ts
function methodDecorator(
	target: any,
	propertyKey: string,
	descriptor: PropertyDescriptor
) {
	...
}
```

메소드용 데코레이터는 Observer또는 수정, 대체하는데 사용할 수 있다.

첫번재 인자로는 클래스의 생성함수, 인스턴스라면 클래스의 proptotype객체가 들어오고  
두번째는 해당 method의 이름 그리고 마지막으로 세번째의 method property descriptor가 들어가게 된다.

여기서 method property descriptor가 생소하게 느껴질 것인데 크게 4가지가 있다고 생각하면 된다.

1. value: 현재의 값
2. writeable: 수정 가능의 여부(boolean)
3. enumarable: for .. in과 같이 순회의 가능 여부(boolean)
4. configuratable: Property definition이 수정 및 삭제 가능 여부(boolean)

이 것은 사실 Object.defineProperty()로 만들어진 것이기 때문에 이를 확인하면 더욱 자세하게 알 수 있다.

이를 이용하여 복잡한 데이터에 대해서 decorator을 사용하는 라이브러리(lit.js)가 있다.

파라미터와 프로퍼티는 추후에 또 후술하겠다.

## document

[AOP in TypeScript](https://d2.naver.com/helloworld/3010710)  
[Decorator](https://www.typescriptlang.org/docs/handbook/decorators.html)
[데코레이터 개념](https://inpa.tistory.com/entry/TS-%F0%9F%93%98-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EB%8D%B0%EC%BD%94%EB%A0%88%EC%9D%B4%ED%84%B0-%EA%B0%9C%EB%85%90-%EC%82%AC%EC%9A%A9%EB%B2%95-%EC%A0%95%EB%A6%AC)
