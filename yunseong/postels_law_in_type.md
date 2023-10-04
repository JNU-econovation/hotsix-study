# 사용할 때는 너그럽게, 생성할 때는 엄격하게

**함수의 매개변수는 타입의 범위가 넓어도 되지만, 결과를 반환할 때는 일반적으로 타입의 범위가 더 구체적이여야 한다.**

> 이번 챕터의 예시는 도메인이 복잡하니 잘 따라오도록 하자.

예시로 3D 매핑 API는 카메라의 위치를 지정하고, 경계 박스의 뷰포트를 계산하는 방법을 제공한다.

(이 글에서는 예시 코드가 파편화 되어있다. 한번에 보고 싶다면 [before.ts](./src/postels_law_in_type/before.ts)를 참고하길 바란다.)

(가급적 예시코드는 TS playground에서 직접 확인해보길 추천한다.)

```ts
/** 카메라의 위치를 조정하는 함수 */
declare function setCamera(camera: CameraOptions): void;
/** 경계 박스의 뷰포트를 계산하는 함수 */
declare function viewportForBounds(bounds: LngLatBounds): CameraOptions;

/** 카메라의 위치에 관한 타입 */
interface CameraOptions {
  center?: LngLat;
  zoom?: number;
  bearing?: number;
  pitch?: number;
}

/** 위도 경도에 관한 타입 */
type LngLat =
  | { lng: number; lat: number }
  | { lon: number; lat: number }
  | [number, number];

/** 위도 경도의 경곗값을 지정하는 타입 */
type LngLatBounds =
  | { northeast: LngLat; southwest: LngLat }
  | [LngLat, LngLat]
  | [number, number, number, number];
```

예시가 구체적으로 어떤일을 하는 지는 일단 알 필요가 없다. 다만 맨 처음 문장인 **함수의 매개변수는 타입의 범위가 넓어도 되지만, 결과를 반환할 때는 일반적으로 타입의 범위가 더 구체적이여야 한다.** 에 집중해 읽기 바란다.

먼저 setCamera는 CameraOptions를 매개변수로 받는다. CameraOptions는 모든 값이 선택적이므로,(카메라의 위치를 조정하는데 center, zoom, bearing, pitch등은 독립적으로 동작하므로. 예시로 우리가 카메라를 조작할 때 zoom을 땡기는 것과 삼각대의 높이를 조절하는 일을 관련이 없다.) 매개변수의 범위가 넓다고 볼 수 있다.

마찬가지로 두번째 함수가 무슨일을 하는지 정확히 와닿지 않지만 매개변수로 받는 타입이 굉장히 넓다는 것을 알 수 있다. 조합수로 따지면 19가지나 된다.(왜 19가지인지는 직접 고민해보길 바란다.)

이제 GeoJSON(위치 정보를 표준화해 표현하는 방식) 기능을 지원하도록 뷰포트를 조절하고, 새 뷰포트를 URL에 저장하는 함수를 작성해보자.

마찬가지로 도메인에 대한 설명은 참고만 하면된다. 로직 전체를 이해할 필요는 없다. (이번 주제를 공부하기 위한 조미료 정도라고 생각하자.)

코드는 위 예제랑 이어진다. TS playground에 붙여넣고 보아도 좋다.

```ts
/** 표준 geoJSON 을 따른다. 더 많은 속성이 있지만 생략 */
type Feature = {
  geometry: {
    coordinates: [number, number][];
  };
};
/** Feature를 기반으로 경곗값을 구하는 함수. 로직은 몰라도 되고 타입에 집중하자. */
function calculateBoundingBox(f: Feature): LngLatBounds {
  let box: LngLatBounds = [1, 2, 3, 4]; // 임의의 값
  /** box의 값을 수정한다고 생각하자. 지금 로직은 생략 */
  const helper = (coords: any[]) => {
    // ...
  };
  const { geometry } = f;
  if (geometry) {
    helper(geometry.coordinates);
  }
  return box; // helper의 로직을 생략했으므로 예제 구현을 위해 임의의 값을 리턴
}
/** 뷰포트 조절 및 새 뷰포트 URL을 저장하는 함수 */
function focusOnFeature(f: Feature) {
  const bounds = calculateBoundingBox(f); // 경곗값을 구한다.
  const camera = viewportForBounds(bounds); // 구한 경곗값으로 뷰포트를 계산한다.
  const {
    center: { lat, lng },
    zoom,
  } = camera; // ERROR!
  // ERROR: lat, lng 가 없습니다.
  // ERROR: zoom은 number | undefined
  window.location.search = `?v=@${lat},${lng},z${zoom}`; // 뷰포트를 URL에 저장
}
```

이 예제에서 오류가 발생한 곳을 보자. 바로 `const { center: {lat, lng }, zoom } = camera;` 부분이다.

에러가 발생한 이유는,

1. center에 lat, lng가 있다는 보장을 할 수가 없다. LngLat 타입이 넓기 때문이다. (3가지 경우)
2. zoom 타입 또한 `number | undefined` 로 추론된다.

결국 `viewportForBounds()` 가 `CameraOptions`를 반환하므로 **만들어진 이후에도 반환값이 자유로운 걸** 알 수 있다.

따라서 문제를 해결하기 위한 유일한 방법은 타입을 좁히는 것, 즉 유니온 타입을 각 요소별로 코드를 분기하는 것이다.

즉, `CameraOptions`의 모든 값이 선택 값이므로 `viewportForBounds`에서 타입을 좁혀서 리턴하면 해결된다.

이렇듯 수많은 선택적 속성을 가지는 반환 타입과 유니온 타입은 함수를 사용하기 어렵게 만든다.

**즉, 매개변수의 타입 범위가 넓으면 사용하기 편리하지만, 반환 타입의 범위가 넓으면 불편하다.(이번 주의 핵심)**

## 어떻게 해결 가능한가?

(예제 코드 전문은 [after.ts](./src/postels_law_in_type/after.ts)에서 제공한다.)

### 기본 형식 구분하기

유니온 타입의 요소별 분기를 위한 한가지 방법은, 좌표를 위한 기본 형식(매개변수 형식)을 구분하는 것이다.

앞서 예시에서, `LngLat` 이 함수의 매개변수 타입을 다양하게 하는 원인이였다.

따라서, 자바스크립트의 관례, `Array`와 `ArrayLike` 의 구분처럼 `LngLat`과 `LngLatLike`한 값을 구분해보겠다.

```ts
// before
type LngLat =
  | { lng: number; lat: number }
  | { lon: number; lat: number }
  | [number, number];
type LngLatBounds =
  | { northeast: LngLat; southwest: LngLat }
  | [LngLat, LngLat]
  | [number, number, number, number];

// after
interface LngLat {
  lng: number;
  lat: number;
}
type LngLatLike = LngLat | { lon: number; lat: number } | [number, number];

type LngLatBounds =
  | { northeast: LngLatLike; southwest: LngLatLike }
  | [LngLatLike, LngLatLike]
  | [number, number, number, number];
```

### 반환값 엄격하게 하기

그리고, 문제였던 `viewportForBounds`를 보자. 반환값이 너무 넓다. 따라서 명세에 맞는 구체적인 반환값으로 변경하자.

```ts
// before
declare function viewportForBounds(bounds: LngLatBounds): CameraOptions;

interface CameraOptions {
  center?: LngLat;
  zoom?: number;
  bearing?: number;
  pitch?: number;
}

// after
declare function viewportForBounds(bounds: LngLatBounds): Camera;

/** 모든 속성을 가지는 카메라 타입을 지정한다. */
interface Camera {
  center: LngLat;
  zoom: number;
  bearing: number;
  pitch: number;
}
```

이렇게 되면 `Camera`는 너무 엄격한 타입이 되므로, 앞서 말한 `setCamera`에서 매개변수를 느슨하게 받을 수 없다.

따라서 이전에 써준 `CameraOptions`를 재정의 해주자.

```ts
// 예시 a
interface CameraOptions extends Omit<Partial<Camera>, 'center'> {
  center?: LngLatLike;
}
```

조금 복잡하지만 설명하자면, 다음 타입과 똑같다고 보면된다. Camera 타입을 기준으로 유틸리티 타입을 직접 적용해보면 좋겠다.

```ts
// 예시 b
interface CameraOptions {
  center?: LngLatLike;
  zoom?: number;
  bearing?: number;
  pitch?: number;
}
```

이렇게 써주지 않고 `예시 a` 처럼 예시를 든 이유는, Camera타입을 활용하기 위해서이다. 불필요한 코드의 반복을 줄일 수 있다.

아래는 예시 b를 활용한 예시다. 느낌이 오겠지만 중복된 코드가 존재함을 알 수 있다.

```ts
// 예시 b를 활용한 예. 너무 코드가 중복되지 않은가?
interface Camera {
  center: LngLat;
  zoom: number;
  bearing: number;
  pitch: number;
}

interface CameraOptions {
  center?: LngLatLike;
  zoom?: number;
  bearing?: number;
  pitch?: number;
}
```

이제 `focusOnFeature`를 봐보자. 이제 의도에 맞게 `viewportForBounds`가 사용되고 있는걸 볼 수 있다.

또한 코드 사용자도 조금 더 명시적으로 사용가능해졌다.

```ts
/** 뷰포트 조절 및 새 뷰포트 URL을 저장하는 함수 */
function focusOnFeature(f: Feature) {
  const bounds = calculateBoundingBox(f);
  // bounds는 넓은 타입이지만 구체적인 Camera 타입(엄격한)을 리턴한다.
  const camera = viewportForBounds(bounds);
  // CameraOptions 타입의 지정으로 너그럽게 사용 가능하다.
  setCamera({ zoom: 1 });
  // Camera로 추론되므로 사용하는데 문제 없어짐
  const {
    center: { lat, lng },
    zoom,
  } = camera;
  window.location.search = `?v=@${lat},${lng},z${zoom}`;
}
```

## 오늘의 결론

- 매개변수 타입은 넓어도 좋으나(너그럽게), 반환하는 타입은 구체적(엄격하게)으로 하는 것이 좋다.

  - 선택적 속성과 유니온 타입은 반환타입보다는 매개변수 타입에 더 일반적이다.

- 매개변수와 반환타입의 재사용을 위해 **기본 형태(반환타입)** 과 느슨한 형태(매개변수 타입)를 도입하는 것이 좋다.
