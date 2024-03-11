# 9장 훅

## 리엑트 훅은 레전드입니다

16버전 이전에는 Class component에서만 상태를 가질 수 있었기 때문에 componentDidMount, componentDidUpdate와 같은 생명주기를 통해 상태를 바꿀 수 있었다.(사실 이는 다른 앱과 유사성을 가지는게 아닐까 싶다.) 하지만 16.8버전이 나오고 나서 AOP를 해결하는, 즉 관심사를 분리하는 혁신적인 방법인 hook이 등장하였다.

### useState

```jsx
function useState<S> {
 initialState: S | (() => S)
}: [S, Dispatch<SetStateAction<S>>];

type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);
```

아시다싶이, `() =>`를 통한 처리는 늦은 처리가 됩니다.(계산된 처리)

### useEffect, useLayoutEffect

두개다 순수하지 않는 함수를 실행시키는 부분으로 생각하면 좋습니다.

```jsx
function useEffect(effect: EffectCallback, deps?: DependencyList): void;
type DependencyList = ReadonlyArray<any>;
type EffectCallback = () = void | Destructor;
```

두개의 차이점은 useEffect는 mount가 다 되고 나서 실행되는 함수이나 useLayoutEffect는 mount 되기 전에 실행되는 함수입니다. 여기의 예시로는 “안녕하세요, 님!”이 아닌, “안녕하세요, 배달이님!” 이라는 것으로 바로 실행되게 만들 수 있다.

### useMemo, useCallback

이전에 생성된 값 또는 함수를 기억하여 동일한 함수를 실행 시키는 것을 막는다.

```jsx
type DependencyList = ReadonlyArray<any>;

function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;
functino useCallback<T extends (...args: any[]) => any(callback: T, deps: DependencyList): T;
```

### useRef

```jsx
function useRef<T>(initialValue: T): MutableRefObject<T>;
function useRef<T>(initialValue: T | null): RefObject<T>;
function useRef<T = undefined>(): MutableRefObject<T | undefined>;

interface MutableRefObject<T> {
 current: T;
}

interface RefObject<T> {
 readonly current: T | null;
}
```

크게 1, 2를 나누어 보면 되는데, 1번의 경우에는 current값이 변경될 수 있고, 2번재는 변경이 될 수 없다.

더 자세한 것은 [이 블로그](https://driip.me/7126d5d5-1937-44a8-98ed-f9065a7c35b5)를 살펴보자. [playground](https://www.typescriptlang.org/ko/play?#code/CYUwxgNghgTiAEAzArgOzAFwJYHtX2QGcQAlERAHgBUA+ACi1S2yggDVXkQAueKgSl4BZZBigAjCKXIB5cQCtwGajQDcAKFCRYCFOmx4CxMpVoMmLdpx594AH3ipkECIPgm5izCo1bocJDRMXHwiaVN4AF4CVFBERhBgejcRMUlwzyVqexi4hKSNdUYMEBhEKDAEVIkpDwUs2ngAb3UASDBkGDhUDF4qDQBfdSKe0vLK91l670aW1rgoYDwIAE94Dq6QHr6cpxdB4bA8Qgx4DABGKKNwiicAW3FS+gBmfg0j1BOzgCYrsJNbsgHk86HtXKogA)는 여기이다.

```jsx
function forwardRef<T, P = {}>(
 render: ForwardRefRenderFunction<T, P>
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;
```

ref를 쓰려면 다음과 같인 forwardRef를 사용하는 것을 추천한다.

여기서 useImperativeHandle을 사용할 수 있는데, ref를 통해 커스터마이징된 메서드를 호출할 수 있게 도와준다고 한다.

```jsx
type CreateFormHandle = Pick<HTMLFormElement, "submit">;

type CreateFormProps = {
 defaultValues?: CreateFormvalue;
}

const JotCreateForm: React.ForwardRefRenderFunction<CreateFormHandle, CreateFormProps> = (props, ref) => {
 useImperativeHandle(ref, () => ({
  submit: () => {
   /* submit 작업을 진행*/
  }
 }));
};

const createPage = () => {
 const refForm = useRef<CreateFormHandle>(null);
 
 const handleSubmitButtonClick = () => {
  refForm.current?.submit();
 };
};
```

### Ref의 여러가지 특성

- useRef는 값이 바뀌어도 컴포넌트의 리렌더링이 발생하지 않는다.
- 값을 설정한 이후 즉시 조회 가능하다.

```jsx
type BannerProps = {
 autoplay: boolean;
}

const Banner = ({autoplay}: BannerProps) => {
 const isAutoPlayPause = useRef(false);
 
 if (autoplay) {
  // keyAutoPlay 값이 isAutoPlay가 변하자마자 사용해야 할 때 쓸 수 있다.
  const keepAutoPlay = !touchPoints[0] & !isAutoPlayPause.current;
 }
 
 return (
  <>
   {autoplay && (
    <button
     aria-label="자동 재생 일시 정지"
     // isAutoPlayPause는 사실 렌더링에는 영향을 미치지 않고 로직에만 영향을 주므로 상태로 사용해서 불필요한 렌더링을 유발할 필요가 없다.
     onClick={() => { isAutoPlayPause.current = true }}
    />
   )}
  </>
 );
};
}     
```
