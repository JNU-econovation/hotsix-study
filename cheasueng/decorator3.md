## 데코레이터

### Property Decorator

프로퍼티 데코레이터는 형식의 객체를 반환하기 때문에 프로퍼티 설정을 바꿀 수 있다.

```ts
function propertyDecorator(target: any, propName: string) {
  return ...
}
```

target은 객체인데 static프로퍼티라면 클래스의 생성자 함수, 인스턴스 프로퍼티라면 클래스의 prototype 객체이다.

반환값은 Property Descriptor 형태로 리턴을 하면 된다.

다른 블로그의 예시를 가지고 오면 아래와 같이 설명할 수 있다.

```ts
function SetDefaultValue(numberA: number, numberB: number) {
  return (target: any, propertyKey: string) => {
    const addNumber = numberA * numberB;
    let value = 0;

    // 데코레이터가 장식된 DataDefaultType의 num 이라는 프로퍼티의 객체 getter / setter 설정을 추가한다.
    Object.defineProperty(target, propertyKey, {
      get() {
        return value + addNumber; // 조회 할때는 더하기 시킴
      },
      set(newValue: any) {
        value = newValue - 30; // 설정 할때는 30을 뺌
      },
    });
  };
}

class DataDefaultType {
  @SetDefaultValue(10, 20)
  num: number = 0;
}

const test = new DataDefaultType();

test.num = 30;
console.log(`num is 30, 결과 : ${test.num}`); // num is 30, 결과 : 200

test.num = 130;
console.log(`num is 130, 결과 : ${test.num}`); // num is 130, 결과 : 300
```

### Parameter Decorator

```ts
function parameterDecorator(
	target: any,
	methodName: string,
	paramIndex: number
) {
    ...
}
```

웃긴 것은 사실 모든 위에것이랑 호완이 된다는 것이다.  
여기에서는 paramIndex가 추가되 형태이다.

### 데코레이터 호출 순서

에코레이터 호출 순서로는 property -> method -> parameter -> class 순서이다.

큰 범위에서부터 작은 범위로 가면 된다고 생각하면 된다.

### Reflection

런타임에 객체의 변수, 속성 및 메서드를 조작하는 프로그램의 일종이다.  
Refelct객체의 모든 메서드는 정적이다. 이를 통하여 간단하게 객체 자체를 조작하는 함수를 만들 수 있다.

몇가지 메서드를 보면 다음과 같다.

- Reflect.apply() - 지정된 인수로 함수를 호출.
- Reflect.constructor() - 새 연산자처럼 작동.
- Reflect.defineProperty() - Object.defineProperty()와 유사. 객체에 성공적으로 정의 되어 있는지 부울 값을 반환.
- Reflect.deleteProperty() - 삭제 연산자.
- Reflect.get() - 속성값을 반환.
  Reeflect.getOwnPropertyDescriptor() - Object.getOwnPropertyDescriptor()와 유사.  
  ...

#### 약간 사용을 해보자.

```ts
Reflect.construct(target, args, [, newTarget]);

class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

let args = ["John", "Doe"];

let john = Reflect.construct(Person, args);

console.log(john instanceof Person); // true
console.log(john.fullName); // John Doe
```

생긴거만 보면 함수형에 좋지 않을까 싶다.

## Docs

[Refelction](https://5takoo.tistory.com/229)  
[Decorator](https://inpa.tistory.com/entry/TS-%F0%9F%93%98-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EB%8D%B0%EC%BD%94%EB%A0%88%EC%9D%B4%ED%84%B0-%EA%B0%9C%EB%85%90-%EC%82%AC%EC%9A%A9%EB%B2%95-%EC%A0%95%EB%A6%AC)
