재사용할 수 있는 체크 박스 컴포넌트를 타입스크립트를 이용해서 생성해본다고 가정해보자.

```tsx
import { clsx } from "clsx";
import { InputHTMLAttributes, useId } from "react";

export interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  labelClassName?: string;
  label?: string;
  type: "checkbox";
  size?: keyof typeof sizeType;
  color?: keyof typeof colorType;
}

const colorType = {
  primary:
    "border-[#16ADEA] bg-[#16ADEA] text-[#FFFFFF] focus:shadow-[0px_0px_4rem_.5rem_#A0C5FF7F] hover:border-[#1678EA7F] active:bg-[#0255D5] disabled:bg-[#A0C5FF7F] disabled:border-none disabled:cursor-not-allowed",
  secondary:
    "border-[#1D1D1D] bg-[#1D1D1D] text-[#E7E7E7] focus:shadow-[0px_0px_4rem_.5rem_#A0C5FF7F] hover:border-[#16ADEA] active:bg-[#0255D5] disabled:bg-[#A0C5FF7F] disabled:border-none disabled:cursor-not-allowed",
};

const sizeType = {
  small: "px-4 py-2",
  medium: "px-6 py-4",
  large: "px-8 py-6",
};

function CheckBox({ className, labelClassName, label, type, ...props }: CheckBoxProps) {
  const id = useId();

  return (
    <>
      <input {...props} id={id} type={type} className={clsx("border py-2 px-2", className)} />
      <label className={clsx(labelClassName)} htmlFor={id}>
        {label}
      </label>
    </>
  );
}
```

![Untitled](/img/utilityex1.png)

부정확한 확장, size라는 타입은 호환 불가라고 한다. 인터페이스 확장에서 오류가 발생한 것 같은데, 인터페이스를 뜯어보자.

![Untitled](/img/utilityex2.png)

많은 타입들이 상속되어 있는데 그 중에서 size라는 친구가 이미 상속되어 있는 것을 볼 수 있다.

그리고 size의 타입은 숫자인 것을 볼 수 있다.

```tsx
export interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  labelClassName?: string;
  label?: string;
  type: "checkbox";
  size?: 12; //ok
  color?: keyof typeof colorType;
}
```

이렇게 숫자를 할당하면 오류가 사라지는 걸 볼 수 있다.

하지만 css프레임워크를 사용해 미리 사이즈를 정해놓는 방식이라면 string으로 지정해야 빠른 설정이 가능한데 다른 방법이 없는지 생각해보자.

### 1. Pick

```tsx
export interface CheckBoxProps extends Pick<InputHTMLAttributes<HTMLInputElement>, "className" | "value"> {
  className?: string;
  labelClassName?: string;
  label?: string;
  type: "checkbox";
  size?: keyof typeof sizeType;
  color?: keyof typeof colorType;
}
```

HTMLInputElement에서 className, value등과 같은 필요한 값만 가져온다.

하지만 이 경우 size를 제외한 모든 필요 프롭스들을 모두 지정해 주어야 하기 때문에 좋은 방법은 아닌 것 같다.

### 2. Omit

```tsx
export interface CheckBoxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  className?: string;
  labelClassName?: string;
  label?: string;
  type: "checkbox";
  size?: keyof typeof sizeType;
  color?: keyof typeof colorType;
}
```

Omit을 통해 size를 제외한 다른 모든 프롭스들을 가져온다.

size의 할당 때문에 오류가 나는 경우이기 때문에 size를 제외해 인터페이스를 재정의 해주는 것이 맞는 방법인 것 같다.

이 외에도 폼과 같이 비슷한 컴포넌트를 재사용할 때에도 유용할 것 같다..!
