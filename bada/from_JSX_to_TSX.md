# [우아한타스] 8장. JSX에서 TST로

# 8.1 리액트 컴포넌트 타입

## 1. 클래스 컴포넌트 타입

- React.Component
- React.PureComponent

두 클래스의 타입은 동일

```jsx
interface Component<P = {}, S = {}, SS = any> extends ComponentLifecycle<P, S, SS> {}

class Component<P, S> {
    /* ...생략 */
}

class PureComponent<P = {}, S = {}, SS = any> extends Component<P, S, SS> {}
```

`**React.Component`와 `React.PureComponent`의 차이점**

- PureComponent는 현재 state, props와 바뀔 state, props를 얕은 비교한 뒤 변경 사항이 있으면 리렌더링한다.
    - setState가 실행되고 state가 바뀌지 않았으면 리렌더링 X
- Component는 state, props가 바뀌지 않아도 리렌더링

## 2. 함수 컴포넌트 타입

- 함수 선언식
    
    ```jsx
    function Welcome(props: WelcomeProps): JSX.Element {}
    ```
    
- 함수 표현식
    - React.FC
    - React.VFC
    - JSX.Element 반환 타입 지정
        
        ```jsx
        const Welcome = ({ name }: WelcomeProps}): JSX.Element => {};
        ```
        

리액트 v18 부터 React.VFC 삭제, React.FC에서 children이 사라짐

## 3. Children props 타입 지정

보편적인 children type

```jsx
type PropsWithChildren<P> = P & { children?: ReactNode | undefined };
```

ReactNode는 ReactElement, boolean, number 등 여러 타입을 포함

→ 구체적으로 타이핑하고 싶다면 추가로 타이핑 필요

## 4. render 메서드와 함수 컴포넌트의 반환 타입

**부제 : React.ReactElement vs JSX.Element vs React.ReactNode**

### ReactElement

```tsx
interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
	type: T;
	props: P;
	key: string | null;
}
```

- React.createElement의 반환 타입
- 가상 DOM의 엘리먼트는 ReactElement 형태로 저장

### JSX.Element

```tsx
declare global {
	namespace JSX {
		interface Element extends React.ReactElement<any, any> {}
	}
}
```

- ReactElement를 확장하고 있는 타입
- 글로벌 네임스페이스에 정의
    - 외부 라이브러리에서 컴포넌트 타입을 제정의할 수 있는 유연성
    

### React.Node

```tsx
type ReactText = string | number;
type ReactChild = ReactElement | ReactText;
type ReactFragment = {} | Iterable<ReactNode>;

type ReactNode =
	| ReactChild
	| ReactFragment
	| ReactPortal
	| boolean
	| null
	| undefined;
```

- ReactElement 외에도 boolean, string, number 등의 여러 타입 포함

**포함관계:**

<aside>
💡 ReactNode > ReactElement > JSX.Element

</aside>

## 5. ReactElement, ReactNode, JSX.Element 활용하기

### ReactElement

**JSX**

- 리액트에서 UI를 표현하는데 사용
- 리액트 엘리먼트를 생성하기 위한 문법
- 트랜스파일러 : JSX → createElement 메서드 변환

즉, ReactElement는 JSX의 createElement 메서드 호출로 생성된 리액트 엘리먼트를 나타내는 타입

### ReactNode

**ReactChild**

```tsx
type ReactText = string | number;
type ReactChild = ReactElement | ReactText;
```

- ReactElement보다 넓은 범위

**ReactNode**

```tsx
type ReactFragment = {} | Iterable<ReactNode>; // ReactNode의 배열 형태

type ReactNode =
	| ReactChild
	| ReactFragment
	| ReactPortal
	| boolean
	| null
	| undefined;
```

- 넓은 범주의 타입!
- render 함수가 반환할 수 있는 모든 형태를 담고 있음

### JSX.Element

```tsx
declare global {
	namespace JSX {
		interface Element extends React.ReactElement<any, any> {}
	}
}
```

- ReactElement가 props과 타입 필드에 대해 any 타입을 가지도록 확장
    - 

## 6. 사용 예시

| ReactNode | 리액트 컴포넌트의 prop으로 다양한 형태를 가질 수 있게 하고 싶을 때 유용 |
| --- | --- |
| JSX.Element | 리액트 엘리먼트를 prop으로 전달 받아 render props 패턴으로 컴포넌트를 구현할 때 |
| ReactElement | JSX.Element 예시 확장 + 추론 관점에서 더 유용하게 활용 가능 |

**render props 패턴**

```tsx
interface Props {
	icon: JSX.Element;
}

const Item = ({ icon }: Props) => {
	// prop으로 받은 컴포넌트의 props에 접근 가능
	const iconSize = icon.props.size;
	
	return (<li>{icon}</li>);
}

// icon prop에는 JSX.Element 타입을 가진 요소만 할당 가능
const App = () => {
	return <Item icon={<Icon size={14} />} />
}
```

**ReactElement 예시**

```tsx
interface IconProps {
	size: number;
}

interface Props {
	// props 타입으로 IconProps 타입 지정
	icon: React.ReactElement<IconProps>;
}

const Item = ({ icon }: Props) => {
	// icon prop으로 받은 컴포넌트의 props에 접근하면, props의 목록이 추론된다
	const iconSize = icon.props.size;
	
	return (<li>{icon}</li>);
}

// icon prop에는 JSX.Element 타입을 가진 요소만 할당 가능
const App = () => {
	return <Item icon={<Icon size={14} />} />
}
```

## 7. 리액트에서 기본 HTML 요소 타입 활용하기

### DetailedHTMLProps와 ComponentWithoutRef

HTML 태그의 속성 타입을 활용하는 대표적인 2가지 방법

**DetailedHTMLProps**

```tsx
type NativeButtonProps = React.DetailedHTMLProps<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>;

type ButtonProps = {
	onClick?: NativeButtonProps["onClick"];
}
```

**ComponentPropsWithoutRef**

```tsx
type NativeButtonType = React.ComponentPropsWithoutRef<"button">;
type ButtonProps = {
	onClick?: NativeButtonType["onClick"]
}
```

### 언제 ComponentPropsWithoutRef를 사용하면 좋을까

컴포넌트의 props로서 HTML 태그 속성을 확장하고 싶을 때의 상황에 초점을 맞춘 예시

```tsx
const Button = () => {
	return <button>버튼</button>;
}
```

```tsx
type NativeButtonProps = React.DetailedHTMLProps<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>;

const Button = (props: NativeButtonProps) => {
	return <button {...props}>버튼</button>;
}
```

위 예시처럼 DetailedHTMLProps를 사용해서 HTMLButtonElement의 속성을 모두 전달했을 때의 문제점

- 함수형 컴포넌트는 클래스형 컴포넌트와 달리 `인스턴스`가 없다.
    - 클래스형 : ref 객체는 마운트도니 컴포넌트의 인스턴스를 current 속성값으로 가짐
    - 함수형 : 인스턴스가 없기 때문에 ref에 기대한 값이 할당되지 않음

ref를 넘겨주기 위해선 `forwardRef`를 사용해야 한다.

```tsx
const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});
```

```tsx
function forwardRef<T, P = {}>(
	render: ForwardRefRenderFunction<T, P>,
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;
```

- 첫 번째 제네릭 : ref 타입
- 두 번째 제네릭 : props 타입

```tsx
type NativeButtonType = React.ComponentPropsWithoutRef<"button">;

const Button = forwardRef<HTMLButtonElement, NativeButtonType>({props, ref}) => {
	return (
		<button ref={ref} {...props}>
			버튼
		</button>
	)
}
```

props 타입으로 DetailedHTMLProps와 같이 ref를 포함하는 타입을 사용하게 되면 실제로는 동작하지 않는 ref를 받도록 타입이 지정되어 예기치 못한 에러가 발생할 수 있음

→ HTML 속성을 확장하는 props를 설계할 때는 ComponentPropsWithoutRef 타입을 사용하여 ref가 실제로 forwardRef와 함께 사용될 때만 props로 전달되도록 타입을 정의히는 것이 안전

# 8.2 타입스크립트로 리액트 컴포넌트 만들기

## 1. JSX로 구현된 Select 컴포넌트

```tsx
const Select = ({ onChange, options, selectedOption }) => {
	const handleChange = (e) => {
		const selected = Object.entries(options)
			.find(([_, value]) => value === e.target.value)?.[0];
		onChange?.(selected);
	}

	return (
		<select
			onChange={handleChange}
			value={selectedOption && options[selectedOption]}
		>
		{Object.entries(options).map(([key, value]) => (
			<option key={key} value={value}>
			{value}
			</option>
		))}
		</select>
	);
};
```

## 3. props 인터페이스 적용하기

```tsx
type Option = Record<string, string>; // {[key: string]: string}

interface SelectProps {
	options: Option;
	selectedOption?: string;
	onChange?: (selected?: string) => void
}

const Select = ({ onChange, options, selectedOption }: SelectProps) => 
	// ...
```

- 컴포넌트 사용 시 각 속성에 어떤 타입의 값을 전달해야 할지 알 수 있음

## 5. 훅에 타입 추가하기

```tsx
const FruitSelect = () => {
	// 타입 매개변수가 없다면 fruit의 타입이 undefined로만 추론 → Error
	const [fruit, setFriut] = useState<string | undefined>();	

	return (
		<Select ... />
	)
};
```

state나 setState를 한정된 타입으로 제한할 수 있음

```tsx
type Fruit = "apple" | "banana" | "blueberry";

const FruitSelect = () => {
	// 타입 매개변수가 없다면 fruit의 타입이 undefined로만 추론 → Error
	const [fruit, setFriut] = useState<Fruit | undefined>();	

	const onChange = () => {
		setFruit("orange"); // ERROR
	}

	return (
		<Select ... />
	)
};
```

## 9. 공변성과 반공변성

객체의 메서드 타입을 정의하는 2가지 방법

```tsx
interface Props<T extends string>{
	onChangeA?: (selected: T) => void;
	onChangeB?(selected: T): void;
}

const Component = () => {
	const changeToPineApple = (selectedApple: "apple") => {
		console.log(selectedApple);
	}

	return (
		<Select
			//Error
			onChangeA={changeToPineApple}
			// OK
			onChangeB={changeToPineApple}
		/>
	)
}
```

- onChangeA일 때는 타입 에러 발생

| 공변성
(Covariance) | A가 B의 서브타입이면, T<A>는 T<B>의 서브타입이다. |
| --- | --- |
| 반공변성
(Contravariance) | A가 B의 서브타입이면, T<B>는 T<A>의 서브타입이다. |
- 타입스크립트에서 타입들은 **기본적으로 공변성 규칙**을 따른다.
- 유일하게 **함수의 매개변수**는 반공변성을 갖고 있다.

**공변성**

```tsx
let stringArray: Array<string> = [];
let array: Array<string | number> = [];

array = stringArray; // OK - stringArray는 array를 포함
stringArray = array; // Error

// --------------------------------------------------

let subObj: { a: string; b: number } = { a: '1', b: 1 };
let superObj: { a: string | number; b: number } = subObj; // superObj는 subObj 포함

// subObj <: superObj
// 각각의 프로퍼티가 대응하는 프로퍼티와 같거나 서브타입이어야 한다.
```

**반공변성**

```tsx
type Logger<T> = (param: T) => void;

let logNumber: Logger<number> = (param) => {
   console.log(param); // number
 };

let log: Logger<string | number> = (param) => {
  console.log(param); // string | number
};

logNumber = log; // OK
log = logNumber; // Error

// 기본적으로 number <: string | number 지만, 함수 매개변수 제네릭에서는 거꾸로
// Logger<string | number> <: Logger<number>
```

- 함수의 리턴값 타입 : 공변성
- 함수의 매개변수 타입 : 반공변성