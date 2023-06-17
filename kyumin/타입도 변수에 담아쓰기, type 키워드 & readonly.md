# 타입도 변수에 담아쓰기, type 키워드 & readonly

> 타입 정의가 너무 길변 Type Aliases (별칭)

코드를 열심히 짜다 보면

```tsx
let 동물: string | number | undefined;
```

매우 길고 복잡하게 타입을 나열하는 경우가 많습니다.

**1. 이게 길고 보기싫으면**

**2. 나중에 또 사용하고 싶으면**

변수에 담아쓰십시오.

변수만드는 것 처럼 type 이라는 키워드를 쓰면 됩니다.

type 키워드 쓰는걸 type alias 라고 합니다.

alias를 번역하자면 별칭인데 저는 그냥 쉽게 변수라고 부르겠습니다.

```tsx
type Animal = string | number | undefined;
let 동물: Animal;
```

**type 타입변수명 = 타입종류**

타입을 변수처럼 만들어서 쓰는 alias 문법입니다. 관습적으로 대문자로 시작합니다.

일반 자바스크립트 변수랑 차별을 두기 위해 AnimalType 이런 식으로 작명하는게 좋을 것 같습니다.

> object 타입도 저장가능합니다

```tsx
type 사람 = {
  name: string;
  age: number;
};

let teacher: 사람 = { name: "규민", age: 20 };
```

object에 타입지정할 때 자주 활용할 수 있겠군요

type 키워드 안쓰면 이렇게 만들어야함

```tsx
let teacher: {
  name: string;
  age: number;
} = { name: "규민", age: 20 };
```

에구디러

미래의 내가 봤을 때 이해가 어려울 것 같으면 좋은 코드가 아닙니다

> readonly로 잠그기

```tsx
const 출생지역 = "seoul";
출생지역 = "busan"; //const 변수는 여기서 에러남
```

const 변수라고 아십니까.

const 변수는 값이 변하지 않는 변수를 만들고 싶을 때 const 쓰면 됩니다.

재할당시 에러가 나기 때문에 값이 변하는걸 미리 감지하고 차단할 수 있으니까요.

![Untitled](https://github.com/Klomachenko/git-practice/assets/102893954/b55e2fbd-8593-48d0-9045-3d8551fed6fb)

```tsx
const 여친 = {
  name: "엠버",
};
여친.name = "유라"; //const 변수지만 에러안남
```

하지만 object 자료를 const에 집어넣어도 object 내부는 마음대로 변경가능합니다.

const 변수는 재할당만 막아줄 뿐이지 그 안에 있는 object 속성 바꾸는 것 까지 관여하지 않기 때문입니다.

object 속성을 바뀌지 않게 막고 싶으면 타입스크립트 문법을 쓰십시오.

readonly 키워드는 속성 왼쪽에 붙일 수 있으며

특정 속성을 변경불가능하게 잠궈줍니다.

```tsx
type Girlfriend = {
  readonly name: string;
};

let 여친: Girlfriend = {
  name: "엠버",
};

여친.name = "유라"; //readonly라서 에러남
```

이러면 사이버세상에서 여친과 평생살고 결혼까지 할 수 있습니다.

한번 부여된 후엔 앞으로 바뀌면 안될 속성들을 readonly로 잠궈봅시다.

(물론 readonly는 컴파일시 에러를 내는 것일 뿐 변환된 js 파일 보시면 잘 바뀌긴 합니다)

<img width="976" alt="image" src="https://github.com/Klomachenko/git-practice/assets/102893954/6d373c20-4843-4659-8bc8-801eb016ef93">

<img width="757" alt="Untitled 2" src="https://github.com/Klomachenko/git-practice/assets/102893954/67aa93bd-8e38-4073-8374-a747858b4db3">

- readonly를 통해 고향 위조를 막아주는 모습

> 속성 몇개가 선택사항이라면

그니까 어떤 object자료는 color, width 속성이 둘다 필요하지만

어떤 object 자료는 color 속성이 선택사항이라면

type alias를 여러개 만들어야하는게 아니라 물음표연산자만 추가하면 됩니다.

```tsx
type Square = {
  color?: string;
  width: number;
};

let 네모2: Square = {
  width: 100,
};
```

Square라는 type alias를 적용한 object 자료를 하나 만들었습니다.

근데 color 속성이 없어도 에러가 나지 않습니다.

실은 물음표는 **"undefined 라는 타입도 가질 수 있다~"**라는 뜻임을 잘 기억해둡시다.

진짠지 확인하고싶으면 마우스 올려보면 됩니다.

> type 키워드 여러개 합쳐보기

```tsx
type Name = string;
type Age = number;
type NewOne = Name | Age;
```

OR 연산자를 이용해서 Union type을 만들 수도 있습니다.

위 코드에서 NewOne 타입에 마우스 올려보시면 string | number라고 나올겁니다.

```tsx
type PositionX = { x: number };
type PositionY = { y: number };

type XandY = PositionX & PositionY;

let 좌표: XandY = { x: 1, y: 2 };
```

object에 지정한 타입의 경우 합치기도 가능합니다.

& 기호를 쓴다면 object 안의 두개의 속성을 합쳐줍니다.

위 코드에서 XandY 타입은 { x : number, y : number } 이렇게 정의되어있을 겁니다.

합치기는 초딩용어고 멋진 개발자말로 **extend** 한다라고 합니다.

- 저번 스터디때 interface 키워드와 함께 있었는데 이번에 조금 더 쉽게 이해할 수 있었습니다

물론 Type alias & Type alias 만 가능한게 아니라

Type alias & { name : string } 이런 것도 가능합니다.

> type 키워드는 재정의가 불가능

```tsx
type Name = string;
type Name = number;
```

이러면 에러가 날 겁니다.

<img width="596" alt="Untitled 3" src="https://github.com/Klomachenko/git-practice/assets/102893954/5fcccfa6-1c47-4d0b-b000-61deb3b354bd">

나중에 type 키워드랑 매우 유사한 interface 키워드를 배우게 될텐데

이 키워드를 쓰면 재정의가 가능합니다. 재정의하면 & 하는거랑 똑같은 기능을 하는데

하지만 재정의 불가능한 편이 더 안전하지 않을까요.
