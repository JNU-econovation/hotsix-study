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
}

class Student {
  name: stirng;
  age: number;
  school: string;
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

타입스크립트에서는 이 외의 방법으로 is, satisfy, as등을 지원합니다.

### is는 특정 함수에서 동작하게 설정 할 수 있습니다.

```ts
class Human {
  name: string;
  age: number;
}

class Student {
  name: stirng;
  age: number;
  school: string;
}

interface Response {
  type: string;
  body: Human | Student;
}

function getShcool(arg: any): arg is Student {
  return arg.school;
}
```

추후에 satisfy랑 hasOwnProperty등에 대해서 다루도록 하겠습니다.
