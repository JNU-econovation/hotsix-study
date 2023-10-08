# decorators

다른 언어(특히 java)에서 많이 쓰는 문법중 하나가 anotation입니다. javascript에는 없지만 typescript에는 있으며, 확실히 자주쓰는 function을 획기적으로 줄어들게 할 요소인 것만큼은 분명합니다.  
node로 backend를 구성하는 경우 사용하면 더욱더 편리한 함수가 될 것 같아 소개드립니다.(nestjs에서는 적극적으로 사용합니다)

참고로 typescript에서는 decorators로 부릅니다. 또한 이 문법은 아직 [실험적 기능](https://www.typescriptlang.org/docs/handbook/decorators.html)이지만 stage 3단계로 사실상 들어갈 예정입니다.

## 개념

저희가 decorator을 알기 이전에 먼저 함수의 결합에 대해서 알아야 합니다.  
고등 이과 수학 과정에 함수의 합성에 대해서 생각해봅시다

`f(x) = y`, `g(y) = z`라는 함수가 있다고 생각해봅시다. 이 함수를 합성하는 방법으로 `g(f(x)) = z` 라는 것을 쉽게 생각할 수 있을 것입니다. 또한 이를 표현하는 방법으로 `(g ∘ f)(x)`를 많이 사용합니다. 추후 이런 문법 모양과 비슷하게 typescript에서 작동합니다.

다시 말하면 decorator는 함수를 감싸 작동하는 방식이며, 함수의 결합처럼 여러개의 함수를 결합하여 사용할 수도 있습니다.

참고로 사용법은 다음과 같습니다.

```ts
// single line
@g @f x
// multiple lines
@g
@f
x
```

## 개략적인 결과물

```ts
function first() {
  console.log("first(): factory evaluated");
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("first(): called");
  };
}

function second() {
  console.log("second(): factory evaluated");
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("second(): called");
  };
}

class ExampleClass {
  @first()
  @second()
  method() {}
}
```

위에서 함수를 먼저 실행한다고 이야기 했었습니다. 그렇다면 위와 같은 실행 순서는 어떻게 될까요?

```
first(): factory evaluated
second(): factory evaluated
second(): called
first(): called
```

위와 같이 실행이 됩니다. 함수를 감싼(밖) 순서부터 실행됨을 알 수 있습니다. 또한 return의 callback함수를 통해서 데코레이터 함수가 반환 되는 것을 확인할 수 있습니다.

반환될 때 요소는 다음 아티클에 자세히 쓰도록 하겠습니다(이를 잘 이용하면 더욱 깔끔한 코드를 이용할 수 있기 때문입니다)

## 활용 법

대표적인 활용법으로는, observer패턴이나, 글로벌한 등록, 아니면 log등 넓게 펼처진 계층에 대해서 제거하여 쓸 수 있습니다.

사실 이는 spring하는 친구들에게 물어보면 훨신 좋은 대답이 들어올 것입니다.

이 활용에 대한 자세한 예시는 다음 아티클에서 데코레이터 함수가 반환되는 경우와 함께 작성하도록 하겠습니다.
