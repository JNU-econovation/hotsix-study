# Closure이란?

여기서 말하는 Closure가은 javascript의 closure가 아닌 google에서 만든 closure가이다.  
이는 javascript의 컴파일러 일종이었는데 typescript와 비슷한 역활을 했다라고 생각하면 편하다.

## Typescript와 다른점이 무엇인데?

아무래도 문법이 조금 다르긴 하다.

**Typescript**

```ts
function max(a: number, b: number): number {
  return a > b ? a : b;
}
```

**Closure**

```js
/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
function max(a, b) {
  return a > b ? a : b;
}
```

문법적으로 Typescript는 javascript에 첨가되는 느낌이라면 Closure은 javascript에 추가되는 느낌이다.  
이 뿐만 아니라 Typescript는 경량화가 되지 않지만 Closure은 기본적으로 경량화(고급 최적화)가 기본이라는 것이다.

프로그래밍 언어론이라는 수업을 들었다면, 아니면 컴파일러에 대해서 알았다면 타입이 죽은 코드, 고급 최적화가 어떤 역활을 가져가는 것이고, 얼마나 쉽게 컴퓨터가 이해할 수 있을지 알 수 있을 것이다.  
Closure은 이런 이점을 가져가는 것이다.  
그 뿐 아니라 javascript런타임에서 잘 돌아갈 수 있으므로 컴파일러 없이 개발하다가 컴파일 할 수도 있다.

말만 들으면 Typescript보다 더 좋은 성능(더 작은 파일)을 가져갈 수 있을 것이고 개발 또한 매우 용이할 수 있다는 것을 알 수 있지 않는가?

## Closure의 단점

사실 경량화라는 과정은 매우 힘든 과정이다.  
모든 코드에 대해서 서로 어떠한 관계를 가져야하는지 알아야 하고, 어떤 것을 제거할 수 있는지 알아야 하며, 그 뿐 아니라 정해져 있는 규칙을 지켜야만 정확하게 동작하는 것이다.

그러면 이 영역이 어디가지일까? 우리가 다운받는 node_modules도 이곳에 종속된다.  
그러니깐 모든 코드가 이에 대해서 종속되어야 한다는 말인 것이다.

## 그러면 Typescript가 승리한 이유는 무엇일까?

사실 closure은 실수를 지적한다면, typescript는 생산성을 높이는데 사용한 것이다.  
첫번째로 closure은 opensource가 아니었지만, typescript는 등장부터 opensource였습니다.  
두번째로 node_modules에 종속적이지 않습니다.  
마지막으로 DefinitelyTyped의 부단한 누력으로 거의 모든 개발자가 쉽게 지원할 수 있었다.
