## Awaited\<Type\>

비동기 함수의 `await` 또는 Promises의 `.then()` 메서드와 같이 Promise를 재귀적으로 해결하는 작업을 모델링하기 위한 것
간단히 말하면, `Awaited<Type>`를 사용하면 Promise로 감싸진 값의 내부값을 추출할 수 있다.

```ts
type A = Awaited<Promise<string>>;
// A의 타입은 string으로 Promise<string>의 내부 값을 추출한 것

type B = Awaited<Promise<Promise<number>>>;
// B의 타입은 number로 Promise<Promise<number>>의 내부 값을 추출한 것

type C = Awaited<boolean | Promise<number>>;
// C의 타입은 number 또는 boolean으로 Promise<number>의 내부 값을 추출한 것이며,
// boolean은 이미 값이므로 변경되지 않음
```

## Partial\<Type\>

`Type`의 모든 속성을 **Optional**로 만들어주는 역할을 한다.

이를 이용해 해당 타입의 일부 속성만 업데이트하거나 변경할 수 있다.

```ts
interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}

const todo1 = {
  title: "organize desk",
  description: "clear clutter",
};

const todo2 = updateTodo(todo1, {
  // fieldsToUpdate
  description: "throw out trash",
});
```

`updateTodo` 함수를 호출할 때, `fieldsToUpdate` 객체에서 `description` 속성만 업데이트하고 나머지는 원래 `todo1` 객체와 동일하게 유지하게 된다.

## Required\<Type\>

`Type`의 모든 속성을 필수로 만들어주는 역할을 한다.

- `Partial<Type>`의 정반대 역할

```ts
interface Props {
  a?: number;
  b?: string;
}

const obj: Props = { a: 5 };
// 'a', 'b' 속성 Optional

const obj2: Required<Props> = { a: 5 };
// 'Required<Props>'를 사용하면 'a'와 'b' 속성은 반드시 포함되어야 함
// 'b' 속성이 누락되었으므로 오류가 발생
```

## Readonly\<Type\>

`Type`의 모든 속성을 읽기 전용(readonly)으로 만들어주는 역할

```ts
interface Todo {
  title: string;
}

const todo: Readonly<Todo> = {
  title: "Delete inactive users",
};
// todo 객체의 'title' 속성은 읽기 전용이므로 다시 할당할 수 없음

todo.title = "Hello";
// 'title' 속성을 재할당하려고 하면 오류가 발생
// "Cannot assign to 'title' because it is a read-only property."
```

### Object.freeze

객체를 "동결"하는 데 사용할 수 있다.

```ts
function freeze<Type>(obj: Type): Readonly<Type>;
```

## Record\<Keys, Type\>

주어진 `Keys`와 `Type`에 따라 속성 키가 `Keys`이고 속성 값이 `Type`인 객체 타입을 생성 - 객체의 속성 키와 해당 속성 값의 타입을 매핑할 수 있음

```ts
interface CatInfo {
  age: number;
  breed: string;
}

type CatName = "miffy" | "boris" | "mordred";

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};

cats.boris;
```

## Pick\<Type, Keys\>

주어진 `Type`에서 속성 키로 이루어진 `Keys`를 선택하여 새로운 타입을 생성

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;
// Todo에서 "title" 및 "completed" 속성만 선택하여 TodoPreview 타입을 정의합니다.

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};

console.log(todo);
```

## Omit\<Type, Keys\>

`Type`에서 `Keys`에 해당하는 속성을 제거하여 새로운 타입을 생성

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

type TodoPreview = Omit<Todo, "description">;
// Todo에서 "description" 속성을 제외한 TodoPreview 타입을 정의합니다.

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
  createdAt: 1615544252770,
};

console.log(todo);
```

## Exclude\<UnionType, ExcludedMembers\>

`UnionType`에서 `ExcludedMembers`에 해당하는 멤버를 제외한 새로운 유니온 타입을 생성

```ts
type T0 = Exclude<"a" | "b" | "c", "a">;
// type T0 = "b" | "c"

type T1 = Exclude<"a" | "b" | "c", "a" | "b">;
// type T1 = "c"

type T2 = Exclude<string | number | (() => void), Function>;
// type T2 = string | number

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };

type T3 = Exclude<Shape, { kind: "circle" }>;
// type T3 = { kind: "square"; x: number; } | { kind: "triangle"; x: number; y: number; }
```

## Extract\<Type, Union\>

주어진 `Type`에서 `Union`에 해당하는 유니온 멤버를 추출하여 새로운 타입을 생성

```ts
type T0 = Extract<"a" | "b" | "c", "a" | "f">;
// type T0 = "a"

type T1 = Extract<string | number | (() => void), Function>;
// type T1 = () => void

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };

type T2 = Extract<Shape, { kind: "circle" }>;
// type T2 = { kind: "circle"; radius: number; }
```

## NonNullable\<Type\>

주어진 `Type`에서 `null`과 `undefined`를 제외한 새로운 타입을 생성

```ts
type T0 = NonNullable<string | number | undefined>;
// type T0 = string | number

type T1 = NonNullable<string[] | null | undefined>;
// type T1 = string[]
```
