# 05월 4째주

## CHAPTER 4 객체

### 4.1 객체 타입

```jsx
const poet = {
 born: 1935,
 name: "Mary Oliver",
};

poet['born'];
poet.name;

poet.end; // ERROR
```

다음과 같은 상황에서 poet은 born이 number, name이 string을 객체로 가질 수 있는 것을 알 수 있다.

typescript를 적용한 상태에서 poet의 없는 프로퍼티인 end를 출력하려고 하자 Error가 나오는 것을 볼 수 있다.

이처럼 typescript는 덕타입인 javascript와 다르게 코드의 타입을 체크한다.

1. 객체 타입 선언

    ```jsx
    let peorLater: {
     born: number;
     name: string;
    }
    ```

    위와 같인 객체타입을 설정할 수 있다.

2. 별칭 객체 타입

    ```jsx
    type Peot = {
     born: number;
     name: string;
    }
    
    let poetLater: Poet;
    ```

    각 객체마다 타입을 적는 것보다 별칭을 적어서 더 읽기 쉽게 만들 수 있다.

    > Learning Typescript에서는 인터페이스를 좀 더 사용 하는 추세라고 한다.
    >

### 4.2 구조적 타이핑

타입을 모두 충족한다면 해당 타입의 값으로 사용 할 수 있다.

```jsx
type WidthFirstName = {
 firstName: string;
}

type WidthLastName = {
 lastName: string;
}

const hasBoth = {
 firstName: "CheaSueng",
 lastName: "Lim"
}

let withFirstName: WithFirstName = hasBoth;
let withLastName: WithLastNAme = hasBoth;
// 위 두개는 오류가 나지 않는다.
```

즉 다음과 같이 모두 별칭 객체를 소유하고 있을 수 있다.

1. 사용 검사

    반대로 실제로 사용하고 있는지 검사할 수 도 있다.(어찌보면 강제화가 아닐까?)

    ```jsx
    type FirstAndLastNames = {
     first: string;
     last: string;
    }
    
    const hasOnlyOne: FirstAndLastNames = {
     first: "CheaSueng"
    } // ERROR
    
    type TimeRange = {
     strat: Date;
    };
    
    const hasStartString: TimeRange = {
     start: '1234-56-78'
    }; // ERROR 타입이 틀리다.
    ```

2. 초과 속성 검사

    더 많은 필드가 있더라도 오류를 낸다.(정말 정확하게 사용이 된다.)

    ```jsx
    type Poet = {
     born: number;
     name: string;
    }
    
    const poetMatch: Poet = {
     activity: "coding"
     born: 1999,
     name: "CheaSueng Lim"
    } // ERROR activity는 없다.
    ```

    초과 속성 검사는 귀찮을 수 있으나, 코딩을 깔끔하고 예상한대로 작동하게 만들 수 있으므로 귀찮다고 끄지말자!

3. 중첩된 객체 타입

    JSON생각하면 있어야 한다. 말그대로 중첩된 객체이다.

    ```jsx
    type Poem = {
     author: {
      firstname: string;
      lastName: string;
     };
     name = string;
    };
    ```

    위처럼 `{…}`로 나타낸다.

4. 선택적 속성

    ?를 통해서 있어도 되고 없어도 되는 것을 구현해할 수 있다. 주의 할 점은 `| undefined`와 다르다는 것이다. `| undefined`는 무조건 undefined이거나 값이 있거나 지만, ?를 통한 선택적 속성은 값이 없어도 되는 것을 상기하고 가야한다.

    ```jsx
    type Writers = {
     author: string | undefined;
     editor? : string
    }
    
    let Writers = {
     author: undefined
    }
    ```

### 4.3객체 타입 유니언

1. 유추된 객체 타입 유니언

```jsx
const poem = Math.random() > 0.5
 ? {name: "The double Image", pages: 7}
 : {name: "Her Kind", rhymes: true};
```

다음과 같이 작성하면 Typescript는 한개의 객체처럼 데이터를 유추한다. 사실 다른 객체라고 할지라도(내부 프로퍼티가 다른) 같은 것처럼 동작할 수 있는 여지가 있다.

1. 명시된 객체 타입 유니언

그래서 다음과 같이 명시된 객체 타입 유니언이라는 것이 생겼다.

```jsx
type PoemWithPages = {
 name: string;
 pages: number;
}

type PoemWithRhymes = {
 name: string;
 pages: boolean;
}

type Poem = PoemWithPages | PoemWithRhymes;
```

위처럼 타입을 union으로 지정하고 실행하면 PoemWithPages, PoemWithRhymes 둘 중 한개를 선택하여 타입을 지정해준다. 즉 타입을 fit하게 정해준다는 뜻이다.

1. 객체 타입 내로잉

안에 객체가 무엇이 들어있는지 확정이 된다면 같은 Type이라고 할 지라도 타입 가드 역활을 통해 해당 프로퍼티만 포함하는 Type으로 좁게 만들 수 있다.

```jsx
if("pages" in poem) {
 poem.pages; // poem은 PoemWithPages로 줄어든다
} else {
 poem.rhymes; // poem은 PoemWithRhymes로 줄어든다.
}
```

그리고 `if(poem.pages)`와 같은 형식으로 참 여부를 결정하는 것은 Typescript에서 허용하지 않는다. 즉 있을수 있는지 모르는 내부 프로퍼티를 접근하는 것은 위험하다고 판단하는 것이다.

1. 판별된 유니언

사실 위처럼 쓰는 것은 모든 객체의 속성을 알고 있어야 유용하지만 우리는 그러지 못한다.

```jsx
type PoemWithPages = {
 name: string;
 pages: number;
 type: 'pages';
}

type PoemWithRhymes = {
 name: string;
 pages: boolean;
 type: 'rhymes';
}

type Poem = PoemWithPages | PoemWithRhymes;
```

그래서 type이라는 프로퍼티를 추가해서 어느 타입인지 유추할 수 있게 만들면 편할 것이다.

```jsx
if(poem.type === 'pages') {
 poem.pages; // type을 통해 비교만 하더라도 Typescript는 Type을 줄여준다.
}
```

> 제네릭 데이터 운영을 위해서 자주 사용한다.
>

### 4.4 교차 타입

Typsecript에서 타입에 `|` 처럼 ‘또는’를 넣을 수 있듯이 `&`처럼 ‘그리고’를 넣을 수 있다.

```jsx
type ShortPoem = { author: string } & (
 | { kigo: string, type: 'haiku';}
 | { meter: number, type: 'villanelle';}
);
```

### 교차 타입의 위험성

교차타입을 많이쓰면 어떤 에러가 있는지 파악하는데 어려워진다. 그래서 특히 교차타입을 사용할 때는 가장 간결하게 만들 수 있도록 해야한다.

### never

교차 타입은 자칫하면 불가능한 타입을 만들기 쉽다. 특히 원시타입은 동시에 여러 타입이 될 수 없기 때문에 교차타입의 구성요소로 결합할 수 없다.

```jsx
type NotPossible = number & string; // never
```
