# typescript의 Gard방법

typescript는 type gard방법이 여러가지입니다.  
이미 javascript에서도 타입가드를 지원하고 있는데 이는 instanceof typeof등 입니다.

### 여기서 typeof는 type에 대한 값을 string으로 반환 합니다.

```ts
console.log(typeof "3"); // string
console.log(typeof 3); // number
```

### 또한 instanceof는 생성자의 prototype을 가지고 있는지 확인하는 것입니다.

```ts
class Human {
  name: string;
  age: number;
  gender: string;
  constructor() {
    this.name = "human name";
    this.age = 0;
    this.gender = "man";
  }
}

class Student {
  name: string;
  age: number;
  school: string;
  constructor() {
    this.name = "school name";
    this.age = 0;
    this.school = "school!!!";
  }
}

function isHuman(arg: Human | Student) {
  if (arg instanceof Human) {
    return true;
  }
  if (arg instanceof Student) {
    return false;
  }
}

const human = new Human();
const student = new Student();
isHuman(human); // true
isHuman(student); // false
```

타입스크립트에서는 이 외의 방법으로 is, satifies, as등을 지원합니다.

### is는 특정 함수에서 동작하게 설정 할 수 있습니다.

```ts
class Human {
  name: string;
  age: number;
  gender: string;
  constructor() {
    this.name = "human name";
    this.age = 0;
    this.gender = "man";
  }
}

class Student {
  name: string;
  age: number;
  school: string;
  constructor() {
    this.name = "school name";
    this.age = 0;
    this.school = "school!!!";
  }
}

function isStudent(arg: Student | Human): arg is Student {
  return typeof arg.school === "string";
}
```

위의 isStudent함수를 보면 arg가 Student인지 Human인지 나누어서 볼 수 있다.

```ts
function callGender = (arg: Student | Human) {
  if (arg instanceof Human) {
    return arg.gender;
  }
  return null;
}
```

이와 비슷하게 class로 작성이 되어 있었다면 이름 property 비교를 통해 다음과 같이 구분을 할 수 도 있지만 이제 코드에서 함수로 빼고 추상화를 하였다는 관점으로 이용 할 수 있다라고 생각하면 좋다.

### satifies는 as와 비슷하지만 더 안전합니다.

satifies는 ts버전 4.9에서 사용하는 아이로서 as와 비슷하게 upcast를 지원한다. 하지만 as와 같은 경우에는 안전하게 변환이 불가능하다(무조건적인 Type 선언이기 때문이다)

그러면 안전하게 타입을 업케스팅을 하려면 어떻게 해야할까? 바로 type을 제한하면 되는 것이다. 우리는 타입을 제한하는 방법으로서 type과 interface를 이용하는 방법에 대해 배웠다.

```ts
const variable1 = { grade: "a", score: 90 } satisfies { grade: string };
// error
const variable2 = { grade: "a", score: 90 } satisfies {
  grade: string;
  score: number;
  attribute: object;
};
const variable3 = {
  key: { grade: "a", score: 90 } satisfies { grade: string },
};
const variable4 = {
  key: { grade: "a", score: 90 } satisfies { grade: string },
};
const variable5 = {
  // error
  key: { grade: "a", score: 90 } satisfies {
    grade: string;
    score: number;
    attribute: object;
  },
};
```

다음과 같이 사용하여서 error를 잡아낼 수 있다.  
그러면 언제 쓸까? 이제 함수형에서 잘 쓸 수 있다고 생각이 된다.

```ts
const canDance = (human: Human) => {
  try {
    const dancer = Human satisfies { doDance: () => void };
    return dancer;
  } catch (e) {
    console.err(e);
    return null;
  }
};

interface Human {
  name: string;
  gender: string;
}

interface Dancer extends Human {
  doDance: () => void;
}

const dancer: Dancer = {
  name: "임채승",
  gender: "male",
  doDance: () => {
    console.log("yee~");
  },
};

canDance(dancer)?.doDance();
```

# hasOwnProperty는 과거에서부터 사용해왔고 지금도 사용한다.

이제 Object안에 다음과 같은 프로퍼티가 있는지 확인할 수 있는 코드입니다.

예를 들면 string += string을 하기 위해서는 toString이라는 메서드가 있어야 합니다. 그러면 + 를 구현할 때 string도 구현할 수 있는 것이죠. kakao나 toss등 안전한 타이핑을 위해서 TS가 있든 없든 많이 사용했다고 들었습니다.

```ts
const me = {
  firstName: "Lee",
  lastName: "JungHyun",
  toString() {
    return this.firstName + this.lastName;
  },
};

let text = "The author name is ";
// Bad - 프로토타입 체인을 통해 Object.toString 접근
if (me.toString) {
  text += me;
}
// Good - 직접 정의 or 오버라이딩한 프로퍼티가 있는지 확인
if (me.hasOwnProperty("toString")) {
  text += me;
}
```

[[satifies](https://engineering.ab180.co/stories/satisfies-safe-upcasting)
