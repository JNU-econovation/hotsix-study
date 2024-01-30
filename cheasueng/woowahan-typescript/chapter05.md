# [1/31] 5장 타입 활용하기

## 조건부 타입

프로그램에서도 다양한 조건문을 사용하는데 타입스크립트도 또한 조건부를 이용해서 타입을 제한할 수 있다.

### extends와 제네릭

`T extends U ? X : Y` 를 일반적으로 사용한다. 이 책에서는 결제를 통해 예시를 알려준다.

```jsx
interface Bank {
	financialCode: string;
	companyName: string;
	name: string;
	fullName: string;
}
interface Card {
	finalcialCode: string;
	companyName: string;
	name: string;
	appCardType?: string;
}

type PayMethod<T> = T extends "card" ? Card : Bank;
type CardPaymethodType = PayMethod<"card">;
type BankPayMethodType = PayMethod<"bank">;
```

얼마나 쉽게 분기가 가능한가. PayMethod를 통해 쉽게 타입을 유추할 수 있다. 하지만 조건부 타입을 쓰지 않을때 얼마나 복잡한지 봐보자.

```jsx
interface PayMethodBaseFromRes {
	financialCode: string;
	name: string;
}

interface Bank extends PayMethodBaseFromRes {
	fullName: string;
}

interface Card extends PayMethodBaseFromRes {
	appCardType?: string;
}
type PayMethodInfo<T extends Bank | Card> = T & PayMethodInterface;
type PayMethodInterface {
	companyName: string;
	...
}
```

useQuery를 사용할 때 위와같이 선언하고 작성한다. 이를 onSuccess를 통해 아래와 같이 반환한다고 가정해보자.

```jsx
type PayMethodType = PayMethodInfo<Card> | PayMethodInfo<Bank>;
excport const useGetRegisteredList = (
	type: "card" | "appcard" | "bank"
): UseQueryResult<PayMethodType[]> => {
	const url = `beaminpay/codes/${type === 'appcard' ? 'card' : 'type'}`;

	const fetcher = fecherFactory<PayMethodType[]>({
		onSuccess: (res) => {
			const usalbePocketList =
				res?.filter(
					(pocket: PocketInfo<Card> | PocketInfo<Bank>) =>
						pocket?.useType === 'use'
					) ?? [];
			return usablePocketList;
		},
	});

	const result = useCommonQuery<PayMtehodType[]>(url, undefined, fetcher);

	return result;
};
```

만약 이렇게 된다면 result의 타입은 무엇일까? Card도 Bank도 되는 타입이 될 것이다. 이는 당연하게도 DX에 영향이 간다. 나도 이렇게 개발했을것 같지만, 이제는 조건문을 추가해야할 것 같다.

처음 코드는 2개만 되는데 이에 대해 더 확장하면 어떻게 해야할까?

```jsx
type payMethodType<T extends 'card' | 'appcard' | 'bank'> T extends
	| 'card'
	| 'appcard'
	? Card
	: Bank;
```

이처럼 다양한 상태에 대해서 받을 수 있다. 물론 react-query에서도 이어서 타입을 사용할 수 있다.

### infer를 통한 타입 추론

extends에서 추론할 때 infer를 통해 좀더 크게 타입을 내려줄 수 있다.

되게 복잡한 route와 menu가 있다고 가정해보자. 여기서 특정 이름들만 가지고온다고 가정해보자.

```jsx
type UnpackMenuNames<T extends ReadonlyArray<MenuItem>> = T extends
ReadOnlyArray<infer U>
	? U extends MainMenu
		? U["subMenues"] extends inter V
			V extends ReadonlyArray<SubMenu>
			? UnpackMenuNames<V>
			: U["name"]
		: never
	: U extends SubMenu
	? U["name"]
	: never
: never;
```

이런식으로 특정하게 해서 가지고 올 수 있다. 지금은 매우 복잡하게 해서 가지고 올 수 있다 정도로만 이해해도 좋을 듯 싶다.

## 템플릿 리터럴 타입 활용하기

타입을 조합해서 사용할 수 있다. 특정한 타입은 대부분 string을 통해서 선언되는데 강력한 도구인 리터럴을 통해 선언할 수 있다.

```jsx
type Vertical = 'top' | 'bottom';
type Horizon = 'left' | 'right';

type Direction = Vectical | `${Vertical}${Capitalize<Horizon>}`;
```

> 참고로 너무 많은 조합은 느리게할 수 있기 때문에 조심해야한다.

## 커스텀 유틸리티 타입 활용하기

많은 타입을 다루게 된다면 Pick, Omit등을 이용하여 제어하기 편하게 할 수 있다.

### PickOne 유틸리티 함수

서로 다른 2개 이상의 객체를 유니온 타입으로 받을 때 타입 검사가 제대로 되지 않는다. 이를 위해 식별할 수 있는 유니온 타입 객체를 유니온으로 받는다. 이렇게 하면 문제를 유니온 타입을 검사할 때 문제를 해결할 수 있지만, type을 다 넣어줘야 한다.

```jsx
type Card = {
  type: "card",
  card: string,
};
type Account = {
  type: "account",
  account: string,
};
```

위처럼 한가지의 일을 생기게 되는데 type을 모두 추가해야한다는 것이다. 그러면 이를 해결하는 방법을 보여준다.

```jsx
type PickOne<T> = {
	[P in keyof T]: Record<P, T[P]> & Partial<Record<Exclude<keyof T, P>, underfined>>;
}[keyof T];
```

### NonNullable 타입 검사 함수를 사용하여 간편하게 타입 가드하기

```jsx
type NonNullable<T> = T extends null | undefined ? never : T;
```

## 불변 객체 타입으로 활용하기

keyof, as const로 타입을 구체적으로 설정하면 컴파일단계에서 발생할 수 있는 실수를 줄일 수 있다.

여기서 예시로 Atom컴포넌트에서 theme style객체 활용하는 법에 대해 설명한다. theme객체의 색상, 폰트 사이즈의 키값을 props로 받고 theme객체에서 값을 받아오는 것으로 가정한다.

```jsx
interface Props {
	fontSize?: stirng;
	backgorundColor?: string;
	color?: string;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
}

const button: FC<Props> = ({fontSize, backgroundColor, color, children }) => {
	return (
		<ButtonWrap
			fontSize={fontSize}
			backgorundColor={backgroundColor}
			color={color}
		>
			{children}
		</ButtonWrap>
	);
};

const ButtonWrap = styled.button<Omit<Props, "onClick">>`
	color: ${({ color }) => theme.color[color ?? 'default']};
	background-color: ${({ backgroundColor }) =>
		theme.bgColor[backgroundColor ?? 'default']);
	fontSize: ${({ fontSize }) => theme.fontSize[fontSize ?? 'default']);
`;
```

위와 같이 사용하면 fontSize, backgorundColor, color에 이상한 값들이 들어오게 되어 문제가 생기게 된다. 타입스크립트에서 typeof와 keyof로 값들을 출력하여 다음과 같이 활용할 수 있다.

```jsx
const colors = {
	red: '#F45452',
	green: '#0C952A',
	blue: '#1A7CFF',
};

interface ColorType typeof colors;
type ColorKeyType = keyof ColorType;
```

## Record 원시 타입 키 개선하기

Record를 통해 무한한 음식 객체를 생성할 수 있어 사용에 조심해야한다.

```jsx
type Category = string;
interface Food {
  name: string;
  // ...
}

const footByCategory: Record<Category, Food[]> = {
  한식: [{ name: "제육덮밥" }, { name: "뚝배기 불고기" }],
  일식: [{ name: "초밥" }, { name: "텐동" }],
};

foodCategory["양식"].map((food) => console.log(food.name));
// 위에서는 typescript에서 오류가 나지 않지만, 런타임에서는 난다.
```

이를 방지하기 위해 category를 유닛 타입으로 변경하면 해당 오류가 나오지 않지만, 무한한 확장을 위해서는 이렇게 하면 안된다. 그렇다면 이제 줄 수 있는 방법 undefined일 수도 있다는 상황을 만들어 주면 개발과정에서 이를 발견하고 해결할 수 있는 힌트를 제공할 수 있다.

```jsx
type PartialRecord<K extends string, T> = Partial<Record<K, T>>;
type Category = string;

interface Food {
	name: string;
	// ...
}

const footByCategory: PartialRecord<Category, Food[]> = {
	한식: [{ name: '제육덮밥' }, { name: '뚝배기 불고기' }],
	일식: [{ name: '초밥' }, { name: '텐동' }],
};
foodCategory["양식"].map((food) => console.log(food.name));
// 위에서는 typescript에서 오류가 발생한다. 그래서 옵셔널 체이닝을 통해 해결해야한다.
```
