# alternative typescript

현재 typescript를 쓰지 않는 프로젝트를 하고 있다.  
리엑트에서 typescript를 쓰지 않다가 불편하여 어떻게 하면 type을 전달 할 수 있을지에 대한 고민과 그 다양한 해결 방법을 제시한다.

가장 가져가야할 핵심은 다음과 같다.

1. 순수하게 javascript로 시작해서 javascript로 끝난다.
2. vscode에서 type을 인식하여 intellisence를 적용 시켜준다.

## JSDocs

JSDocs는 javascript에 타입을 알려주는 좋은 예시 중 하나이다. 심지어 docs형식이라 깔끔하다.  
JSDocs는 거의 모든 것이 해결이 되지만 더 편하게 쓰는 방법 2가지를 가지고 왔다.

### React Function Component에서 Props를 JSDocs로 표현하기

React의 FC(Function Component)의 Props는 구조 분해 할당을 다루기 매우 힘들다.
이를 JSDocs로 표현하는 방법은 다양하게 있지만 이 방법이 가장 편한 것 같아 소개하고자 한다.

```jsx
// types/product.d.ts
export type product = {
  id: string,
  category: string,
  productImagePath: string[],
  name: string,
  rentalPrice: number,
  regularPrice: number,
  location: string,
  commentCount: number,
};

/**
 * @param {object} props
 * @param {import("../../types/product").product} props.data
 * @returns {React.FC}
 */
export const ProductItem = ({ data }) => {
  const { id, name, commentCount, location, productImagePath, rentalPrice } =
    data;
  return <div>exmpale</div>;
};
```

위의 코드를 보면 data라는 애를 한번에 받기 힘들다. 그래서 props.data라는 형태로 미리 선언해둔 type을 선언할 수 있다.  
ts-node를 통해 검사하지도 않고(즉 javascript를 건들지 않고), vscode의 intellisence를 적극적으로 활용할 수 있다.

위와 같이 복잡한 형태가 아니라면 다음처럼 정의 할 수 있다.

```jsx
/**
 * @param {{
 *  id: string
 * }}
 * @returns {React.FC}
 */
export const ProductDetail = ({ id }) => {
  return <div>exmpale</div>;
};
```

@param안에 한번에 정의도 가능하긴 하다.

### JSDocs를 위해서 Typescript를 이용하기

typescript를 지원하지 않는 프로젝트는 일반적으로 type.d.ts를 이용하기도 한다.  
그래서 위에서 살작 보였다 싶이 import를 통해서 type만 슬쩍 가지고 오는 경우도 있다.

개인적으로 보기가 불편해서 더 좋은 방법이 없을까 고민했지만, 저 방법만이 가장 순수하게 좋은 방법 인 것 같아 채용해서 쓰고 있다.

## proptypes

`import PropTypes from 'prop-types';`를 통해서 props의 타입을 지정해줄 수 있다.

```jsx
import PropTypes from "prop-types";

class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

Greeting.propTypes = {
  name: PropTypes.string,
};
```

참고로 성능상의 이유로 propTypes는 개발모드에서만 작동한다고 한다.
이와 같은 경우에는 javascript에 직접적인 영향이 가기 때문에 생략하기로 하였다.
