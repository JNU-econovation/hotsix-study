# React에서 typescript를 어떻게 써야할까?

## React에서 지원하는 typescript

React에서는 크게 Event와 Props를 관리하는데 있어 도움을 주는 Type들을 제공해줍니다.

1. 다음과 같이 event를 다루는데 있어서 기존의 HTML의 Type뿐 아니라 React에서 이를 확장하여 지원해줍니다.

```ts
interface Props {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
```

2. React에서 useState와 관련된 Type을 지원해줍니다.

```ts
interface Props = {
  setState: React.Dispatch<React.SetStateAction<number>>;
};
```

3. React에서는 함수형 컴포넌트인지, 클래스형 컴포넌트인지 알려줍니다.

- 클래스형 컴포넌트입니다.

```ts
interface MyProps {
  message: string;
}

interface MyState {
  count: number;
}

class App extends React.Component<MyProps, MyState> {
  state: MyState = {
    count: 0,
  };
  render() {
    return (
      <div>
        {this.props.message} {this.state.count}
      </div>
    );
  }
}
```

- 함수형 컴포넌트입니다.

```ts
interface MyProps {
  hello: string;
}

const App: React.FC<MyProps> = ({ hello }) => {
  return <div>hello: {hello}</div>;
};

const App: React.FC = ({ hello }: MyProps) => {
  return <div>hello: {hello}</div>;
};
```

4. React에서는 PropsWithChild라는 독특한 util type이 있습니다.

```ts
const App: React.FC<PropsWithChildren> = ({ children }) => {
  return <div>{children}</div>;
};
```

하지만 주의 사항은 위와 같은 코드에서는 children이 옵셔널로 글어오게 되어 있습니다. 이를 방지하기 위해서는 StrictPropsWithChildren를 만들어서 사용 할 수 있습니다.

```ts
export type StrictPropsWithChildren<P = unknown> = P & {
  children: ReactNode;
};

const App: React.FC<StrictPropsWithChildren> = ({ children }) => {
  return <div>{chilren}</div>;
};
```
