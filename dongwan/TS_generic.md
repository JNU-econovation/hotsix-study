#TS_generic

## generic type?

- generalize type : 데이터의 타입을 일반화 한다.
- 모든 타입에 범용적으로 사용 가능
- 함수를 호출할 때마다 상황에 따라 다른 타입을 담는다.

  ```tsx
  function func<T>(value: T): T {
    return value;
  } //T <- 타입 변수

  /*
  T : type
  E : element
  K : key
  V : value
  */

  //변수명은 보통 이렇게
  ```

  이런 식으로 사용한다.

## why use generic

- 강의를 들으며 여러 문법을 접하다 보니 generic이 유동적이고 강력한 타입 선언 방법인 것은 알겠다.
  - 유동적이고 범용적인게 TS에서 꼭 좋은 것인지는 모르겠다.
- generic을 써야하는 이유는 무엇일까?

1. **타입의 반환**

   ```tsx
   //non-generic
   function logText(text: any): any {
     return text;
   }

   //generic
   function logText<T>(text: T): T {
     return text;
   }
   ```

   위와 같이 여러 타입을 반환할 수 있는 함수를 만들었다.

   타입스크립트는 string으로 추론을 하겠지만 실행 과정, 결과의 타입은 알 수가 없다.

   만약 string 타입을 넘긴다고 해도 any 타입이 반환된다는 정보만 얻을 뿐이다.

   이럴 때 쓸 수 있는게 generic일 것이다.

2. **재사용성 문제 해결**

   ```tsx
   interface Person {
     name: String;
   }

   const convertStringToArray = (value: String): Array<String> => {
     return [value];
   };

   const convertNumberToArray = (value: Number): Array<Number> => {
     return [value];
   };

   const convertPersonToArray = (value: Person): Array<Person> => {
     return [value];
   };
   ```

3. 그 외에도 리액트와의 호환이 좋고, 유동성이 좋다는 등 여러 장점이 있다고한다.

하지만 제네릭이 좋은건 알겠는데 도대체 어떤 상황에 사용하는지 궁금해졌다.

### **Example of using generic in react**

```tsx
interface SummaryProps<T extends object, K extends keyof T> {
  data: T;
  property: K;
}

export function Summary<T extends object, K extends keyof T>({
  data,
  property,
}: SummaryProps<T, K>) {
  const value = data[property] as string;

  return (
    <div>
      {typeof property === "string" ? (
        <p>
          {property}: {value}{" "}
        </p>
      ) : (
        ""
      )}
    </div>
  );
}
```

Summary라는 컴포넌트를 생성했다. 컴포넌트의 props는 T타입의 객체이고, K타입의 프로퍼티를 갖는다.

데이터라는 객체의 프로퍼티는 <p>고 해당 프로퍼티의 타입이 string이 아니라면 아무것도 리턴하지 않는다.

제네릭을 통해 컴포넌트의 내용, 타입을 걸러낸 예시다.

만들어진 컴포넌트말고 직접 하나의 컴포넌트를 만들어보며 예시를 들어보자.

Tab을 누르면 Tab별로 주어진 item으로 변경되는 컴포넌트를 만든다고 가정하자.

- 컴포넌트
  ```tsx
  <TabBar items={anyTypeOfArray} onTabClick={selectHandler} />
  ```
- type
  ```tsx
  interface TabBarProps<T> {
    items: any[];
    selectedItem: any;
    onTabClick: (item: any, selectedIndex: number) => void;
  }
  ```
  컴포넌트에 위와 같이 타입을 지정하면 어떻게 될까?
  위에서 말한 것 처럼 any로 타입을 지정한다면 onTabClick이 어떤 타입의 파라미터를 반환하고, selectedItem이 어떤 타입의 데이터를 받는지 정확히 알 수 가 없다. 항상 any를 지양해야하는 이유가 generic의 존재 이유인 것 같다.
  이제 generic을 통해 해당 문제를 해결해보자.
- item

  ```tsx
  interface MySocial {
    id: number;
    name: string;
    link: string;
  }

  const socials: MySocial[] = [
    { id: 11, name: "WebSite", link: "https://www.fabiobiondi.dev" },
    { id: 12, name: "Youtube", link: "https://www.youtube.com/c/FabioBiondi" },
    { id: 13, name: "Twitch", link: "https://www.twitch.tv/fabio_biondi" },
  ];
  ```

  items[]에 들어갈 Mysocial타입의 item들을 만들었다.
  객체 socials는 Mysocial 타입을 갖고 id, name, link 프로퍼티들은 각각 number, string, string타입을 갖는다.

- component edit

  ```tsx
  <TabBar<MySocial>
    selectedItem={selectedSocial}
    items={socials}
    onTabClick={selectHandler}
  />
  ```

  컴포넌트에 generic으로 타입을 부여했다. 이제 각각의 데이터들은 완전한 타입을 반환할 수 있다.

  ```tsx
  // TabBar.tsx
  interface TabBarProps<T> {
    items: T[];
    selectedItem: T;
    onTabClick: (item: T, selectedIndex: number) => void;
  }

  export function TabBar<T extends { id: number; name: string }>(
    props: TabBarProps<T>
  ) {
    const { items, selectedItem, onTabClick } = props;
    return (
      <>
        <div className="flex gap-x-3">
          {items.map((item, index) => {
            const activeCls =
              item.id === selectedItem.id
                ? "bg-slate-500 text-white"
                : " bg-slate-200";
            return (
              <div
                key={item.id}
                className={"py-2 px-4 rounded " + activeCls}
                onClick={() => onTabClick(item, index)}
              >
                {item.name}
              </div>
            );
          })}
        </div>
      </>
    );
  }
  ```

  최종적으로 컴포넌트의 타입을 이렇게 부여할 수 있다. 재사용하기에도 용이하고 타입 반환에도 용이하다.
