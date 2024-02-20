# 02/21

# 7장

## API 요청

API변경에 따른 side effect를 최소화 하기 위한 노력에는 무엇이 있을까?

### 서비스 레이어로 분리하기

### Axios활용하기

### 빌더 패턴

- 객체 생성을 더 편리하고 가독성 있게 만들기 위한 디자인 패턴
- 주로 복잡한 객체의 생성을 단순화하고, 객체 생성 과정을 분리하여 객체를 조립하는 방법을 제공한다.

```tsx
class API {
    readonly method: HTTPMethod;
    readonly url: string;
    basURL?: string;
    headers?: HTTPHeaders;
    params?: HTTPParams;
    data?: unknown;
    timeout?: number;
    withCredentials?: boolean;

    constructor(method: HTTPMethod, url: string) {
        this.method = method;
        this.url = url;
    }

    call<T>(): AxiosPromise<T> {
        const http: axios.create();
        if (this.withCredentials) {
            http.interceptors.request.use(
                response => response,
                error => {
                if (error.response && error.response.status === 401) {
                    /* 에러 처리 */
                }
                return Promise.reject(error);
                }
            )
        }
        return http.request({...this})
    }
}
```

```tsx
class APIBuilder {
  private _intance: API;
  constructor(method: HTTPMethod, url: string) {
    this._intance = new API(method, url);
    this._intance.basURL = apiHost;
    this._instance.data = data;
    this._instance.headers = {
      "Content-Type": "application/json",
    };
    this._intance.timeout = 10000;
    this._intance.withCredentials = false;
  }

  static get = (url: string) => new APIBuilder("GET", url);
  static post = (url: string) => new APIBuilder("POST", url);
  static put = (url: string) => new APIBuilder("PUT", url);
  static delete = (url: string) => new APIBuilder("DELETE", url);

  baseURL(value: string) {
    this._intance.basURL = value;
    return this;
  }

  headers(value: HTTPHeaders): APIBuilder {
    this._intance.headers = value;
    return this;
  }

  timeout(value: number): APIBuilder {
    this._intance.timeout = value;
    return this;
  }

  params(value: HTTPParams): APIBuilder {
    this._intance.params = value;
    return this;
  }

  data(value: unknown): APIBuilder {
    this._intance.data = value;
    return this;
  }

  withCredentials(value: boolean): APIBuilder {
    this._intance.withCredentials = value;
    return this;
  }

  build() {
    return this._intance;
  }
}
```

### API 응답 타입 지정하기

- 주의할 점 : 요청 처리 내에서 응답의 타입을 통일 한다면 응답이 없을 수 도 있는 UPDATE아 CREATE의 API를 처리하기 까다롭다.
- 어떤 응답이 들어있는지 알 수 없거나 로직에 영향을 주지 않느다면 unknown 타입을 이용하는 것도 좋다.

### View 모델

- API 응답은 변할 가능성이 크기 때문에 뷰모델을 사용하여 API 변경에 따른 범위를 한정해주는 것이 좋다.
- API 변경에 따른 컴포넌트 변경을 최소화 할 수 있다.
  ```tsx
  interface JobListItemResponse {
      name: string;
  }

  interface JobListResponse {
      JobItems: JobListItemResponse[];
  }

  class JobList {
      readonly totalItemCount: number;
      readonly items: JobListItemResponse[];

      constructor(response: JobListResponse) {
          this.totalItemCount = response.JobItems.length;
          this.items = response.JobItems;
      }
  }

  const fetchJobList = async (filter?: ListFetchFilter): Promise<JobListResponse> => {
      const {data} = await api
      .params({filter})
      .get('/jobs');
      .call<Response<JobListResponse>>();

      return new JobList(data);
  }
  ```
- API 응답을 뷰에서 필요한 구조로 가공하고, 뷰 컴포넌트는 필요한 정보를 손쉽게 렌더링할 수 있습니다. 만약 API 응답 구조가 변경되더라도 jobList클래스 내부의 수정만으로 뷰 컴포넌트는 변경 없이 동작할 수 있게 됩니다.

### Superstruct 라이브러리

- 편리한 인터페이스 정의와 유효성 검사
- 유효성 검사를 통해 개발자와 사용자에게 자세한 런타임 에러를 보여줌
- assert : 유효하지 않을 경우 에러
- is : 검사 결과에 따라 boolean return
- validate : [error, data]형식의 튜플을 반환
- infer : 기존 타입 선언 방식과 동일하게 타입 복사 가능

**_❓ superstruct의 단점은 뭘까?_**

## API 상태 관리

비동기 API를 호출하기 위해서는 API의 성공, 실패에 따른 상태가 관리 되어야 하므로 상태관리 라이브러리의 액션이나 훅과 같이 재정의된 형태를 사용해야 한다.

1. 상태 관리 라이브러리에서 호출

- ex) redux, jotai…
- MobX와 같은 라이브러리는 비동기 상태를 관리하기 위해 runInAction등과 같은 메서드를 사용하여 상태 변경을 처리한다.
- 모든 상태 관리 라이브러리에서 비동기 처리 함수를 호출하기 위해 액션이 추가될 때마다 관련된 스토어나 상태가 추가된다. 이로인한 문제점은 전역 상태 관리자가 모든 비동기 상태에 접근하고 변경할 수 있다는 것인데, 만약 2개 이상의 컴포넌트가 구독하고 있는 비동기 상태가 있다면 쓸데없는 비동기 통신이 발생하거나 의도치 않은 상태변경이 발생할 수 있다.
  → 훅, 옵저버 패턴 등

1. 훅으로 호출

- 위에서 말한 라이브러리에서 발생하는 문제들을 해결하기 위한 방법 중 하나가 리액트 쿼리나 useSwr을 사용하는 것이다.
- 훅은 캐시를 통해 비동기를 호출한다.
- 리액트 쿼리는 invalidateQueries를 통해 특정 키의 API를 유효하지 않은 상태로 만들 수 있다.
- 폴링 : 클라이언트가 주기적으로 서버에 요청을 보내 데이터를 업데이트
  **_→ 자동 캐러셀 같은 것도 이 방법을 이용한 건가?_**

## API 에러 핸들링

비동기 API 에러를 구체적이고 명시적으로 핸들링 해보자

### 타입 가드 활용

Axios 라이브러리에는 isAxiosError라는 타입 가드를 제공한다.

```tsx
interface ErrorResponse {
  status: string;
  serverDateTime: string;
  errorCode: string;
  errorMessage: string;
}
```

```tsx
function isServerError(error: unknown): error is AxiosError<ErrorResponse> {
  return axios.isAxiosError(error);
}
```

```tsx
const onClickDeleteHistoryButton = async (id: string) => {
  try {
    await axios.post(`/api/history/${id}/delete`);

    alert("삭제되었습니다.");
  } catch (error: unknown) {
    if (isServerError(error) && error.response?.data.errorMessage) {
      {
        setErrorMEssage(error.response.data.errorMessage);
        return;
      }
    }

    setErrorMessage("알 수 없는 오류가 발생했습니다.");
  }
};
```

- 이처럼 에러가 서버문제인지 아닌지 확인이 가능하다.

### 에러 서브클래싱

에러를 더 명시적으로 표시하고 파악하기 위해 서브클래싱을 활용할 수 있다.

- 어디서 어떤 문제가 발생했는지 알 수 있다.
- QA, 유지보수에 용이하다.
- 여러 에러 케이스 구조화 후, switch나 if문으로 핸들링

### 인터셉터를 활용한 에러 처리

_❓어떤 경우에 사용할까?_

### 에러 바운더리를 활용한 에러 처리

https://ko.legacy.reactjs.org/docs/error-boundaries.html

## API 모킹

### NextApiHandler

- Next.js를 사용하고 있다면 해당 라이브러리를 활용할 수 있다.

### axios-mock-handler

- 요청을 가로채서 요청에 대한 응답 값을 대신 반환

### MSW

## 우형 이야기

데이터 패칭 라이브러리

- 리액트 쿼리의 장점
  - 선형적이고 코드가 간결, 직관적임
  - suspense 제공
  - refetch, 캐싱에서 강력
  - useMutation의 제공
  - 번들 사이즈가 작다.
  - 러닝 커브가 낮다.
