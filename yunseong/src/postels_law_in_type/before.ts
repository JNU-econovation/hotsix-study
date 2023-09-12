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
