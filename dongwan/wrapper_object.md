# 래퍼 객체의 할당 가능성

## 할당 가능성

- 타입스크립트는 변수의 초깃값을 읽고 해당 변수가 허용되는 타입을 결정한다. 나중에 해당 변수에 새로운 값이 할당되면, 새롭게 할당된 값의 타입이 변수의 타입과 동일한지 확인한다.
- string이 초기값인 변수에 boolean값을 넣으면 할당이 불가능 하기에 **할당 가능성이** 없다고 한다.
  ### 할당 가능성 오류
  - ‘type..is not assignable to type’ 형태의 오류는 가장 일반적인 오류다.
    - 첫번 째 type은 초기 할당된 타입이고 두번째 type은 이후 재할당된 타입이다. 위에서 든 예시 처럼 할당가능성이 없기 때문에 생기는 오류다.

## 래퍼 객체가 생기는 이유?

숫자, 문자열, 불리언 등 원시 타입의 프로퍼티에 접근하려고 할 때 생성되는 임시 객체를 래퍼 객체(wrapper object)라고 한다.

(표준 객체와는 다르다.)

```jsx
//in JS
const name = 'dongwan';
console.log(name.length); //7
console.log(name.charAt(0)); //'d'

//'name' is deprecated.(6385)
//lib.dom.d.ts(18091, 5): The declaration was marked as deprecated here.
```

name.length 혹은 name.charAt 처럼 프로퍼티를 참고하려고 할 때

- name = new String(’dongwan')
- 다음과 같이 래퍼 객체 String 일시적으로 실행되어, name을 객체화 시킨다.

<img src="/img/prototype.png">

- String.prototype을 상속받아 실행
- **즉, 원시타입을 객체화 시켜주는 객체형 데이터 타입을 래퍼객체 라고 한다.**

## But

```jsx
const name = 'dongwan';
name[0] = 'a';
console.log(name);
//dongwan
```

문제는 다시 반환될 때 객체 타입이 아닌 원시 타입으로 반환된다는 것이다.

그러면 사용됐던 객체 타입은 가비지 컬렉팅된다.

때문에 str의 값은 바뀌지 않는다.

### 래퍼객체 사용을 지양해야하는 이유

JS에서 선언되는 변수들은 모두 원시타입으로 선언됨

→ TS에서 변수를 래퍼객체로 선언한다면?

**할당 가능성 오류가 발생한다.**

```jsx
String !== string;
```

원시타입은 객체에 할당할 수 있지만, 객체 타입을 원시타입에 할당할 수는 없다.

그래서 TS에서는 원시타입을 지향해야한다.
