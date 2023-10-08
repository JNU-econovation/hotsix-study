# 공변성과 반공변성 in TS

최근 진행하는 프로젝트들은 관리자 권한이 필요한 경우가 많았다.

보통 일반 유저와 관리자의 타입을 어떤 방식으로 구분하는지 알아보다가 ‘타입 공변성’이라는 개념에 대해 알게 되었다.

## 1. 공변성

```tsx
class User {
  username: string;

  constructor(username: string) {
    this.username = username;
  }
}

class Admin extends User {
  isSuperAdmin: boolean;

  constructor(username: string, isSuperAdmin: boolean) {
    super(username);
    this.isSuperAdmin = isSuperAdmin;
  }
}
```

```tsx
const user1: User = new User("user1"); // ok
const user2: User = new Admin("admin1", true); // ok
```

User클래스와 Admin클래스는 어떤 관계를 지니고 있을까?

`Admin`이 `User`를 상속하기 때문에, `Admin`은 베이스 타입인 `User`의 대체 가능한 서브 타입이라고 할 수 있다.

공변성의 관점에서 이를 나타내보자.

```
Admin <: User
```

Admin이 User의 서브타입이고 위와 같은 관계를 만족할 때 공변한다고 말할 수 있다.

```tsx
type IsSubtypeOf<S, P> = S extends P ? true : false;
```

다음과 같이 공변성을 확인하는 타입을 정의해보고 공변성을 확인해보자.

```tsx
type Ex1 = IsSubtypeOf<Admin, User>; //true
type Ex2 = IsSubtypeOf<"hello", string>; //true
type Ex3 = IsSubtypeOf<42, number>; //true
```

이처럼 선언된 타입 뿐만 아니라 원시값과 같이 다양한 타입들도 공변성으로 정의할 수가 있다.

### 예시

인증 비동기 함수에서 `Promise<User>` 또는 `Promise<Admin>`을 리턴한다고 가정해보자.

Admin <: User 라는 것은 `Promise<Admin> <: Promise<User>` 임을 의미할까?

```tsx
type asyncEx1 = IsSubtypeOf<Promise<Admin>, Promise<User>>;
//true
```

![ex1](/dongwan/img/sub<base.png)

위 사진은 공변성의 정의를 나타낸 것이고, 간단하게 BaseType과 SubType이 공변일 때, Promise<T>, Map><T>와 같은 타입을도 공변이 됨을 알 수 있다.

## 2. 반공변성

```tsx
type Func<Param> = (param: Param) => void;
//타입이 Param인 하나의 파라미터를 가지는 함수타입을 만들었다.
type Ex1 = IsSubtypeOf<Func<Admin>, Func<User>>; //false
type Ex2 = IsSubtypeOf<Func<User>, Func<Admin>>; //true
```

🤔 공변성과 달리 서브타입과 베이스타입의 관계가 반대가 된다.

이런 관계를 반공변이라고 하는데 일반적으로 함수 타입은 파라미터의 타입과 관련하여 반공변이다.

![ex2](/dongwan/img/base<sub.png)

### 주의할 점

함수의 서브타이핑에서 파라미터의 타입은 반공변이지만 함수가 반환하는 리턴값은 또 다시 공변이다.

```tsx
const admins: Admin[] = [
  new Admin("dongwan", true),
  new Admin("yunseong", false),
];

const superAdmins = admins.filter((admin: Admin): boolean => {
  return admin.isSuperAdmin;
});

superAdmins; // [ Admin('dongwan', true) ]

const isYunseongAdmin = admins.filter((user: User): boolean => {
  return user.username.startsWith("yunseong");
});

isYunseongAdmin; // [ Admin('joker', false) ]
```
