# Using

## Using?

- 타입스크립트 5.2 버전부터 지원될 수도 있는 새로운 키워드
- let, const변수 선언 키워드에 기능이 추가된 형태고 using을 이용해 선언된 변수는 블록 스코프를 벗어날 때 자동으로 자원을 해제해준다.

### 기존의 자원해제

```tsx
async function getUsers() {
  const db = await getDb();
  const users = await db.query("SELECT id FROM users");
  await db.close();
  return users;
}
```

만약 어떤 이유로 쿼리를 가져오는데에 실패하여 오류가 발생한다면 db.close()가 실행되지 않고 db가 연결된 상태로 유지된다.

```tsx
async function getUsers() {
  const db = await getDb();
  try {
    const users = await db.query("SELECT id FROM users");
    return users;
  } catch {
    console.log("error");
  } finally {
    await db.close();
  }
}
```

그렇다면 이런 방식으로 해결할 수 있는데 이 코드의 문제점은 db를 사용하는 모든 코 드에서 db를 수동적으로 닫아줘야 한다는 것이다.

이는 코드가 길어지고, 반복적인 패턴이고, 개발자가 자원을 해제하지 못할 경우 메모리 누수로도 이어지는 좋지 않은 패턴이기도 하다.

### using을 통한 자원해제 ( Symbole.dispose )

```tsx
function main() {
	using myRsource = getResource();
	console.log(myResource.data);
}
main();
```

using키워드를 사용하기 위해서는 변수가 폐기될 때 실행될 **Symbol.dispose**함수를 작성해야한다.

```tsx
function getResource() {
	return {
		data: 'start'
		[Symbol.dispose]: ()=> {
			console.log('end')
		}
	}
}
```

이와 같이 코드가 짜여진 경우 main함수가 완료되고 myResource 변수가 블록을벗어나면 JS는 자동으로 **Symbol.dispose**안의 코드를 실행해 end를 출력한다.

만약 Symbol.dispose안의 코드가 비동기로 실행되어야할 경우 await using과 함께 Symbol.asyncDispose를 사용할 수 있다.

```tsx
async function getDb() {
  const connection = await mysql.connect("...");
  return {
    connection,
    [Symbol.asyncDispose]: async () => {
      await connection.close();
    },
  };
}
```

### 이게 왜 TS키워드?

얼핏 보면 그냥 새로운 JS키워드가 추가된 것 같은데 이게 왜 5.2부터 지원되는 TS버전의 키워드인지 궁금해서 구글링 했는데 별 내용이 나오지 않았다.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f9d7fb1e-3137-4377-bcf6-ffc91ab408c5/746b3fc3-3d38-4dfe-b838-69c25e1a37c3/Untitled.png)

<img src="/dongwan/img/usingExample.png">

나중에 문서가 제대로 나오면 찾아보자..!
