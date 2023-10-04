/** 카메라의 위치를 조정하는 함수 */
declare function setCamera(camera: CameraOptions): void;
/** 경계 박스의 뷰포트를 계산하는 함수 */
declare function viewportForBounds(bounds: LngLatBounds): Camera;

/** 모든 속성을 가지는 카메라 타입을 지정한다. */
interface Camera {
  center: LngLat;
  zoom: number;
  bearing: number;
  pitch: number;
}

/** 카메라의 위치에 관한 타입 */
interface CameraOptions extends Omit<Partial<Camera>, 'center'> {
  center?: LngLatLike;
}

/** 위도 경도에 관한 타입 */
interface LngLat {
  lng: number;
  lat: number;
}

/** 위도 경도에 관한 타입. LngLatLike를 적용 */
type LngLatLike = LngLat | { lon: number; lat: number } | [number, number];

type LngLatBounds =
  | { northeast: LngLatLike; southwest: LngLatLike }
  | [LngLatLike, LngLatLike]
  | [number, number, number, number];

/** 표준 geoJSON 을 따른다. 더 많은 속성이 있지만 생략 */
type Feature = {
  geometry: {
    coordinates: [number, number][];
  };
};
/** Feature를 기반으로 경곗값을 구하는 함수. 로직은 몰라도 되고 타입에 집중하자. */
function calculateBoundingBox(f: Feature): LngLatBounds {
  let box: LngLatBounds = {
    northeast: {
      lng: 1,
      lat: 2,
    },
    southwest: {
      lng: 1,
      lat: 2,
    },
  }; // 임의의 값
  const helper = (coords: any[]) => {
    // ...
  };
  const { geometry } = f;
  if (geometry) {
    helper(geometry.coordinates);
  }
  return box;
}

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
