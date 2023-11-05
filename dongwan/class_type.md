# class의 타입

> 우테코 프리코스를 진행하는데 class를 사용할 때마다 값을 초기화해주지 않으면 타입이 추론이 불가능해 메소드도 못쓰고.. 테스트도 못돌리고.. 타입스크립트로 어떻게 완화할 수 있을지 알아보자..

## 함수 속성

```ts
class withPropertyParameters {
  takesParameters = (input: boolean) => (input ? "Yes" : "No");
}
const instance = new WithPropertyParameters();
instance.takesParameters(true); //OK
instance.takesParameters(123); //error
```

함수 속성에는 매겨 변수와 반환 타입을 지정할 수 있다.

위 클래스는 타입이 (input:boolean) => stirng인 takesParameters속성을 가진다.

## 초기화 검사

strict config설정이 활성화 된 경우 타입스크립트에 undefined 타입으로 선언된 각 속성이 생성자에서 할당되었는지 확인한다.

```ts
class MissingInitializer {
  property: string;
}

new MissingInitializer().property.length;
//legth -> undefined
```

property의 값을 초기화 해주지 않으면 strict설정을 끌 시 타입 오류는나지 않지만 자바스크립트 런타임 에서는 undefined 오류가 발생한다.

```ts
class MissingInitializer {
  property!: string[];
}
```

strict 설정을 키고 엄격한 검사가 필요없는 프로퍼티의 경우 다음과 같이 검사를 피하게 할 수 있다.

## readonly

```ts
class Quote {
    readonly text: string;

    constructor(text:string) {
        this.text = ;
        //OK
    }

    emphasize() {
        this.next += "!";
        //readonly 프로퍼티 할당 오류
    }
}
```

readonly로 선언된 속성은 선언된 위치 또는 생성자에서 초깃값만 할당할 수 있다.
모든 위치에서 속성은 읽을 수만 있고 쓸 수는 없다. 생성자 외의 emphasize프로퍼티에서 값을 저장하려고 하면 오류가 발생한다.

## 타입으로서의 클래스

```ts
class SchoolBus {
  getStudents() {
    return ["students", "teachers"];
  }
}

function withSchoolBus(bus: SchoolBus) {
  console.log(bus.getStudents());
}

withSChoolBus(new SchoolBus()); //OK

withSchoolBus({
  getStudents: () => ["driver"], //OK
});

withSchoolBus({
  getStuduents: () => 123, //number -> string[] 할당 오류
});
```

## 멤버 접근성

```ts
class Base {
  isPublicNumber = 0;
  public isPublicNumber2 = 1;
  protected isProtected = 2;
  private isPrivate = 3;
  #truePrivate = 4;
}

class Subclass extends Base {
  examples() {
    this.isPublicNumber; //OK
    this.isPublicNumber2; //OK
    this.isProtected; //OK
    this.isPrivate; //access 불가
    this.#truePrivate; //access불가
  }
}

new Subclass().isPublicNumber; //OK
new Subclass().isPublicNumber2; //OK
new Subclass().isProtected; //protected error
new Subclass().isPrivate; //access 불가
```

protected, private는 타입스킙트 클래스 멤버로 멤버 접근성으 제한하지만
자바스크립트로 컴파일할 경우 public으로 선언된 것 처럼 컴파일 된다.
즉 #프레픽스로 선언된 클래스 멤버만 진정 접근성을 제어할 수 있다.
