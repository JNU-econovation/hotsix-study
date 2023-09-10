## styled-component 에 타입 지정하기

해커톤에 사용한 코드들을 타입스크립트로 마이그레이션 해 보고 싶었는데, 해커톤은 아무래도 스타일이 중요하다보니 styled-component 관련 코드들이 많았다. 그래서 typescript에서 styled-component를 사용 하는 방법에 알아보았고, 추가로 전체적인 테마를 설정하는 방법에 대해 공부해보았다.

`npx create-react-app 디렉토리명 --template typescript`

`npm i styled-components`

`npm i -D @types/styled-components`

를 통해 react app 을 만들어 준 후 시작했다.

---

### 프롭스를 전달해야 할 때

```js
export const Button =
  styled.button <
  { background: string } >
  `
  background-color: ${(props) =>
    props.background ? "rgba(68, 96, 239, 1)" : "#a2a2a2"};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;
```

props 에 타입을 지정해주지 않으면 에러가 난다. 프롭스가 여러개일 경우 interface로 해주면 좋다.

### 스타일 타입 정의하기

styled.d.ts 파일을 만들어 기본 스타일 타입들을 지정해 줄 수 있다.

```ts
import "styled-components";
// 타입 확장하기
declare module "styled-components" {
  export interface DefaultTheme {
    dark: {
      backgrounds: string;
      main: string;
      other: string;
    };
    light: {
      backgrounds: string;
      main: string;
      other: string;
      point: string;
    };
  }
}
```

+)
d.ts파일은 기존 JavaScript로 만들어진 모듈들을 TypeScript 환경에서도 사용할 수 있도록 따로 타입만 정리해서 넣어둔 파일이다. 해당 파일을 확장해서 사용할 수 있다.

단, type 키워드, interface 같은 타입 정의만 넣을 수 있고
함수의 경우엔 { } 중괄호를 붙이는 게 불가능하며 파라미터 & return 타입만 지정 가능하다.

### 테마 스타일 지정하기

다크모드를 하고 싶은 경우, 혹은 그 외에도 공통으로 들어가게 되는 스타일을 지정하고 싶을 때 사용한다.

```js
import { defaultTheme } from "styled-components";
export const theme: defaulTheme = {
  dark: {
    backgrounds: `#333`,
    main: `rgba(255,255,255,0.85)`,
    other: `rgba(255,255,255,0.65)`,
  },
  light: {
    backgrounds: `#fff`,
    main: `rgba(0, 0, 0, 0.85)`,
    other: `rgba(0, 0, 0, 0.75)`,
    point: `rgba(0, 0, 0, 0.02)`,
  },
};
```

App.js 에 ThemeProvider 로 기본 테마를 지정해준다.

```js
import { ThemeProvider } from "styled-components";
import { theme } from "./../src/styles/theme";
...
return (
  // dark 모드
  <ThemeProvider theme={theme.dark}>
    <Component />
  </ThemeProvider>
);
```

이렇게 지정해준 테마는 다른 파일들에서 이용 가능하다.
만약 테마를 바꾸고 싶으면 App.ts 파일만 변경하면 되기 때문에 편리하다.

```js
const Container = styled.div`
  background-color: ${(props) => props.theme.backgrounds};
  color: ${(props) => props.theme.main};
`;
```
