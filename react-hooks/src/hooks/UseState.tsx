import { useState, useRef } from 'react'

interface User {
  name: string
  age: number
}

export default function UseStateHook() {
  // 기본 타입들
  const [count, setCount] = useState<number>(0)
  const [name, setName] = useState<string>('')
  
  // 객체 상태
  const [user, setUser] = useState<User>({ name: 'John', age: 20 })
  const inputRef = useRef<HTMLInputElement>(null)
  
  // 배열 상태
  const [items, setItems] = useState<string[]>(['첫번째', '두번째'])
  const itemInputRef = useRef<HTMLInputElement>(null)

  // 함수형 업데이트 테스트
  const [testValue, setTestValue] = useState<number>(0)

  // 객체 업데이트 (올바른 방법)
  const onClickChangeAge = () => {
    /*
    잘못된 예제
    user.age = Number(inputRef.current?.value);
    setUser(user);
    - 객체를 직접 변경하면 참조가 동일해서 리렌더링 안됨
    */
    
    // 올바른 예제 - 새 객체 생성
    setUser({ ...user, age: Number(inputRef.current?.value) })
  }

  // 배열에 아이템 추가
  const addItem = () => {
    const newItem = itemInputRef.current?.value
    if (newItem) {
      setItems([...items, newItem])
      if (itemInputRef.current) itemInputRef.current.value = ''
    }
  }

  // 배열에서 아이템 제거
  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  // 함수형 업데이트 비교
  const wrongMultipleUpdate = () => {
    // 잘못된 방법 - 같은 값 참조
    setTestValue(testValue + 1)
    setTestValue(testValue + 1)
    setTestValue(testValue + 1)
  }

  const correctMultipleUpdate = () => {
    // 올바른 방법 - 이전 값 기반
    setTestValue(prev => prev + 1)
    setTestValue(prev => prev + 1)
    setTestValue(prev => prev + 1)
  }

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', padding: 20 }}>
      {/* 기본 카운터 */}
      <div style={{ marginBottom: 30 }}>
        <h3>기본 상태</h3>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count - 1)}>-</button>
        <button onClick={() => setCount(count + 1)}>+</button>
        <button onClick={() => setCount(0)}>리셋</button>
      </div>

      {/* 문자열 상태 */}
      <div style={{ marginBottom: 30 }}>
        <h3>문자열 상태</h3>
        <p>Name: {name || '(없음)'}</p>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="이름 입력"
        />
      </div>

      {/* 객체 상태 */}
      <div style={{ marginBottom: 30 }}>
        <h3>객체 상태 (불변성)</h3>
        <p>Name: {user.name}</p>
        <p>Age: {user.age}</p>
        <div>
          <input ref={inputRef} type="number" placeholder="새 나이" />
          <button onClick={onClickChangeAge}>나이 변경</button>
        </div>
        <div style={{ marginTop: 10, padding: 10, backgroundColor: '#f0f0f0', fontSize: 14 }}>
          <strong>주의:</strong> 객체를 직접 변경하면 참조가 동일해서 리렌더링이 안됨.<br/>
          새 객체를 만들어서 교체해야 함: <code>{'setUser({ ...user, age: newAge })'}</code>
        </div>
      </div>

      {/* 배열 상태 */}
      <div style={{ marginBottom: 30 }}>
        <h3>배열 상태</h3>
        <div>
          {items.map((item, index) => (
            <div key={index} style={{ marginBottom: 5 }}>
              <span>{item} </span>
              <button onClick={() => removeItem(index)} style={{ fontSize: 12 }}>삭제</button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10 }}>
          <input ref={itemInputRef} type="text" placeholder="새 아이템" />
          <button onClick={addItem}>추가</button>
        </div>
      </div>

      {/* 함수형 업데이트 */}
      <div style={{ marginBottom: 30 }}>
        <h3>함수형 업데이트</h3>
        <p>TestValue: {testValue}</p>
        <button onClick={() => setTestValue(0)}>리셋</button>
        <button onClick={wrongMultipleUpdate}>잘못된 +3 (실제론 +1)</button>
        <button onClick={correctMultipleUpdate}>올바른 +3</button>
        
        <div style={{ marginTop: 10, padding: 10, backgroundColor: '#fff3cd', fontSize: 14 }}>
          <strong>차이점:</strong><br/>
          - 잘못: <code>setCount(count + 1)</code> → 클로저로 인해 같은 값 참조<br/>
          - 올바름: <code>setCount(prev =&gt; prev + 1)</code> → 최신 값 기반 업데이트
        </div>
      </div>

      {/* 핵심 정리 */}
      <div style={{ padding: 15, backgroundColor: '#e7f3ff', borderLeft: '4px solid #007bff' }}>
        <h4>핵심 포인트</h4>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li><strong>불변성:</strong> 객체/배열은 직접 수정하지 말고 새로 만들기</li>
          <li><strong>함수형 업데이트:</strong> 이전 값에 의존할 때는 함수 사용</li>
          <li><strong>참조 비교:</strong> React는 Object.is()로 변경 감지</li>
          <li><strong>타입 안전성:</strong> TypeScript 제네릭으로 타입 명시</li>
        </ul>
      </div>
    </div>
  )
}