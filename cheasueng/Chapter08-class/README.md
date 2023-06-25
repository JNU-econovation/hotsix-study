# 06월 4째주

## 클래스

### 8.1 클래스 메서드

재귀 함수가 아니라면, 대부분 반환 티입을 유추할 수 있고, 메서드의 허용 가능한 수의 인자를 알 수 있다.

클래스 생성자(constructor)는 전형적인 클래스 메서드처럼 취급된다.

```ts
class Greeted {
  constructor(message: string) {
    console.log(`As I always say: ${message}!`)
  }
}

new Greeted("take chances, make mistakes, get messy");

new Greeted(); // ERROR
```

### 8.2 클래스 속성

타입스크림트에서 클래스의 속성을 읽거나 쓰려면 클래스에 명시적으로 선언해야한다.

#### 8.2.1 함수 속성

메서드 접근 방식은 함수를 클래스 프로토타입에 할당 하기 때문에 모든 클래스 인스턴스는 동일한 함수 정의를 사용한다.

```ts
class WithMethod {
  myMethod() {}
}

new WithMethod().myMethod === new WithMethod().myMethod; // true
```

값이 함수인 속성을 선언하는 방식도 있는데, 이렇게 하면 클래스의 인스턴스당 새로운 함수가 생성되며, 클래스 인스턴스를 가리켜야 하는 화살표 함수에서 this스코프를 사용하면 새로운 함수 생성 시간과 메모리 측면에서 이점이 있다.

```ts
class WithProperty {
  myPropeerty: () => {}
}

new WithMethod().myProperty === new WithMethod().myProperty; // false
```

속성에는 클래스 메서드와 독립 함수의 동일한 구문을 사용해 매개변수와 반환 타입을 지정할 수 있다. 함수 속성은 클래스 멤버로 할당된 값이고, 함수로 지정된다.

#### 8.2.2 초기화 검사

undefined타입으로 선언된 각 속성이 생성자에서 할당되었는지 확인한다.

```ts
class WithValue {
  immediate = 0;
  later: number;
  myBeUndefined: number | undefiend;
  unused: number; // ERROR

  constructor() {
    this.later = 1;
  }
}
```

생성자와 별도로 여러번 다시 초기화 될 수 있을 때도 있어서 이름 뒤에 !를 추가해 검사를 비활성화 할 수 있다.  
하지만 이는 타입 안전성을 떨어트리는 행위라서 클래스를 리팩토링해서 어서션이 필요하지 않게 하는 것이 더 좋다

#### 8.2.3 선택적 속성

인터페이스와 마찬가지로 이름 뒤에 ?를 추가해 속성을 옵션으로 선택할 수 있다. 이렇게 하는 경우 명시적으로 설정하지 않아도 문제가 되지 않는다.

#### 8.2.4 읽기 전용 속성

이름 앞에 readonly 키워드를 추가해 속성을 읽기 전용으로 선언할 수 있다. 인터페이스처럼 typescript에서만 동작한다.

> 만약 javascript에서도 읽기 보호를 넣고 싶다면 # privatge필드나 get()함수 사용의 고려를 하면 된다.

원시 타입의 초기값을 갖는 readonly는 속성이 조금 다른데, 가능한 좁혀진 리터럴 타입으로 유추된다.

```ts
class RandomQuote {
  readonly explicit: string = "Home is the nicest word there is.";
  readonly implicit = "Home is nicest word there is.";

  constructor() {
    if (Math.random() > 0.5) {
      this.explicit = "We start learning the minute we're born."; // OK
      this.implicit = "We start learning the minute we're born."; // ERROR 타입이 맞지 않음
    }
  }
}

const quote = new RandomQuote();

quote.explicit; // 타입: string
quote.implicit; // 타입: "Home is the nicest word there is."
```

### 8.3 타입으로서의 클래스

타입스크립트는 클래스의 멤버를 모두 포함하는 모든 객체 타입을 클래스에 할당할 수 있는 것으로 간주한다.

### 8.4 클래스와 인터페이스

implements를 이용하면 class에 인터페이스를 사용할 수 있으며, 누락된 메서드냐, 속성에 대해서 검사한다.  
인터페이스를 구현하는 것은 순전히 안정성 검사를 위해서이다.

#### 8.4.1 다중 인터페이스 구현

class는 다중 인터페이스를 선언할 수 있다.  
만약 한번에 두 인터페이스를 구현할 수 없도록 정의가 된 인터페이스라면 타입 오류가 발생한다.

```ts
interface AgeIsANumber {
  age: nmber;
}

interface AgeIsNotANumber {
  age: () => string;
}

class ASNumber implements AgeIsANumber, AgeIsNotANumber {
  age = 0; // ERROR
}
```

### 8.5 클래스 확장

기본 클래스에 선언된 모든 메서드나 속성은 파생 클래스라고도 하는 하위 클래스에서 사용할 수 있다.

#### 8.5.1 할당 가능성 확장

하위 클래스도 기본 클래스의 멤버를 상속한다. 하위 클래스의 모든 멤버가 동일한 타입의 기본 클래스에 이미 존재하는 경우 기본 클래스의 인스턴스를 하위 클래스 대신 사용할 수 있다.

```ts
class PastGrades {
  grades: number[] = [];
}

class LabeledPastGrades extends PastGrades {
  label?: string;
}

let subClass: LabelPastGrades;

subClass = new LabeledPastGrades();
subClass = new PastGrades();
```

#### 8.5.2 재정의된 생성자

자체 생성자가 없는 하위 클래스는 암묵적으로 기본 클래스의 생성자를 사용한다.  
또한 this또는 super에 접근전에 기본 클래스의 생성자를 호출해야 한다.  
타입스크립트에서는 super()를 호출하기 전에 this또는 super에 접근하려고 하는 겨우 타입 오류를 보여준다.

#### 8.5.3 재정의된 메서드

하위 클래스는 새 타입을 기본 클래스의 타입에 할당할 수 있는 한 동일한 이름으로 기본 클래스의 속성을 명시적으로 다시 선언할 수 있다.  
속성을 다시 선언하는 대부분의 하위 클래스는 해당 속성을 유니언 타입의 더 구체적인 하위 집합으로 만들거나 기본 클래스 속성 타입에서 확장되는 타입으로 만든다.  

만약에 허용되지 않는 값 집합을 확장하고하면 오류가 나온다.

```ts
class NumericGrade {
  value = 0;
}

class VegueGrade extends NumericGrade {
  value = Math.random() > 0.5 ?  : "..."; // ERROR
}

const instance: NumericGrade = new VegueGrade();

instance.value;
// 예상한 타입: number
// 실제 타입: number | string
```

### 8.6 추상 클래스

java처럼 추상 클래스를 작성할 수 있다. 대신 인스턴스화 할 수 없다.

```ts
abstruct class School {
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract getStudentTypes(): string[];
}

class Preschool extedns School {
  getStuentTypes() {
    return ["preschooler"];
  }
}

class Absence extends School { } // ERROR
```

### 8.7 멤버 접근성

자바스크림트는 클래스 멤버 앞에 #을 추가해 private클래스 멤버임을 나타낸다. priavte 클래스 멤버는 해당 클래스 인스턴스에서만 접근할 수 있다.  
자바스크립트 런타임은 private메서드나 속성에 접근하려고 하면 에러가 나올 것이다.

- public: 모든 곳에서 접근 가능
- protected: 클래스 내부 또는 하위 클래스에서만 접근 가능
- private: 클래스 내부에서만 접근 가능

위처럼 쓸 수 있지만 자바스크립트에서는 다 public처럼 쓸 수 있다. 그래서 #를 써야 진짜 private이다.

#### 8.7.1 정적 필드 제한자

항상 접근성 키워드를 먼저 작성하고 static, readonly키워드가 온다.
