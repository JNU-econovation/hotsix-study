# Compiler option

타입스크립트를 이용해 프로젝트를 진행할 때, npm init처럼 초기에 설정해 주어야 하는 부분들이 있다.
config설정을 초기에 잘해야 나중에 유지보수가 편리할 것 같아 간단한 것만 정리해 보았다.

```jsx
{
    "compilerOptions": {"target" : "ESNext",
    "module" : "ESNext",
    "outDir" : "dist",
    "strict": true,
    "moduleDetection" : "force",
    },
    "ts-node": {"esm": true},
    "include": ["src"]
}
```

- 현재 이해할 수 있는 기본적인 것만 추가로 작성했다.

  ### 전역 속성

  - **files**
    ```jsx
    {
      [
      "files":
        "src/main.ts",
        "src/utils.ts",
        "src/types.d.ts"
      ]
    }
    ```
    프로젝트에서 컴파일할 파일들의 목록을 명시적으로 지정하는 속성이다.
    files 속성은 exclude보다 우선순위가 높다.
    만일 이 속성이 생략되면 include와 exclude 속성으로 컴파일 대상을 결정한다.
  - **extends**
    ```jsx
    {
      "extends": "./configs/base",
      "compilerOptions": {
        "strictNullChecks": false
      },
      "files": [
        "src/main.ts",
        "src/utils.ts",
        "src/types.d.ts"
      ]
    }
    ```
    extends는 다른 tsconfig.json 파일의 설정들을 가져와 재사용할 수 있게 해주는 옵션이다. 보통 extends 속성은 tsconfig.json 파일의 최상위에 위치한다.
    예를들어 config/base.json 파일의 속성 설정을 현 tsconfig.json 파일에 포맷이 맞으면 base파일의 설정을 상속 받게 된다.
  - **include**
    ```jsx
    {
      "compilerOptions": {
        ...
      },
      "include": [
        "src/*.ts", // src 디렉토리에 있는 모든 .ts 파일
        "dist/test?.ts" // dist 디렉토리에 있는 test1.ts, test2.ts , test3.ts ..등에 일치
        "test/**/*.spec.ts" // test 디렉토리와 그 하위 디렉토리에 있는 모든 .spec.ts 파일
      ]
    }
    ```
    include 속성은 files 속성과 같이 프로젝트에서 컴파일할 파일들을 지정하는 속성이지만, **와일드 카드** 패턴으로 지정한다는 점에서 차이가 있다. 또한 include는 files 속성과는 달리 exclude보다 약해 include에 명시되어 있어도 exclude에도 명시되어 있으면 제외 되게 된다.
    - **wild card**
    ```jsx
    * : 해당 디렉토리에 있는 모든 파일
    ? : 해당 디렉토리에 있는 파일들의 이름 중 한 글자라도 포함하면 해당
    ** : 해당 디렉토리의 하위 디렉토리의 모든 파일을 포함
    ```
  - **exclude**

    ```jsx
    {
      "compilerOptions": {
        ...
      },

      "exclude": [
        "node_modules", // node_modules 디렉토리를 제외
        "**/*.test.ts" // 모든 .test.ts 파일을 제외
      ]
    }
    ```

  ### 환경설정 옵션

  - **target**
    ```jsx
    "compilerOptions": {
    	"target": "ES6" // 어떤 버전의 자바스크립트로 컴파일 될 것인지 설정
        // 'es3', 'es5', 'es2015', 'es2016', 'es2017','es2018', 'esnext' 가능
    }
    ```
  - **lib**
    ```jsx
    "compilerOptions": {
    	"lib": ["es5", "es2015.promise", "dom"], // 컴파일 과정에 사용될 라이브러리 파일 설정
        /*
        es5: global type을 사용하기 위함 (Array, Boolean, Function 등..)
        es2015.promise: Promise를 사용하기 위함
        dom: setTimeout, console.log 등 dom에서 지원해주는 기능들을 사용하기 위함
        */
    }
    ```
  - **jsx**
    ```jsx
    "compilerOptions": {
    	"jsx": "preserve"
    ```
    - react : .js 파일로 컴파일 된다. (JSX 코드는 React.createElement() 함수의 호출로 변환됨)
    - react-jsx : .js 파일로 컴파일 된다. (JSX 코드는 \_jsx() 함수의 호출로 변환됨)
    - react-jsxdev : .js 파일로 컴파일 된다. (JSX 코드는 \_jsx() 함수의 호출로 변환됨)
    - preserve : .jsx 파일로 컴파일 된다. (JSX 코드가 그대로 유지됨)
    - react-native : .js 파일로 컴파일 된다. (JSX 코드가 그대로 유지됨)
