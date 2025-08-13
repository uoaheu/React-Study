import { useState, useMemo, useEffect } from 'react'

const heavyWork = (n: number) => {
    console.log('무거운 작업 진행 중 !');
    for(let i = 0; i < 987654321; i++) {} // 임시로 진행되는 무거운 작업
    return '무거운 작업 진행 ' + n + '회';
}

const lightWork = (n: number) => {
    console.log('가벼운 작업 진행 중 !');
    return '가벼운 작업 진행 ' + n + '회';
}


export default function UseMemoHook() {
    return (
        <div style={{ maxWidth: 900, margin: '24px auto', padding: 20 }}>
            <h2>무거운 계산: 비최적 vs useMemo 비교</h2>
            <p style={{ fontSize: '0.9rem', color: '#666', padding: 10 }}>
                - 무거운 작업 버튼 = 1초 이상 걸리는 연산 수행 | 실제 서비스에서는 이미지 처리, 복잡한 계산, 대량 데이터 가공 등에 해당합니다.
                <br />
                - 가벼운 작업 버튼 = 즉시 처리되는 간단한 연산 | 화면 갱신, 간단한 숫자 계산 등이 여기에 해당합니다.
            </p>
    
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                <NaiveVersion />
                <UseMemoVersion />
            </div>


            {/* (2) useEffect 의존성 비교 */}
            <h2 style={{ marginTop: 32 }}>useEffect: 객체 의존성 비최적 vs 최적 비교</h2>
            
            <p style={{ fontSize: '0.9rem', color: '#666', padding: 10 }}>
                상황 : 글씨 크기(숫자)와 테마(다크/라이트) 2가지 상태가 있습니다.
                <br />
                목표 : 콘솔 로그는 <strong>테마 버튼</strong>을 눌렀을 때만 찍히게 하고 싶습니다.
                <br />
                비최적 : 매 렌더마다 새 객체를 만들어 <code>useEffect</code> 의존성이 매번 달라져서, 글씨 크기만 바꿔도 콘솔이 찍힙니다.
                <br />
                최적 : 객체를 <code>useMemo</code>로 안정화하여 테마 변경시에만 실행됩니다. + 원시값(<code>isDark</code>)만 의존성으로 두는 방법도 존재합니다.
            </p>

            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                <NaiveVersion2 />
                <UseMemoVersion2 />
            </div>

        </div>
    );
}

/* ---------------- (1) 무거운 계산 예시 ---------------- */

// 비최적 : 렌더 본문에서 직접 호출 -> 어떤 상태가 바뀌어도 매 렌더마다 heavyWork 재실행
function NaiveVersion() {
    const [heavyTodo, setHeavy] = useState(0);
    const [lightTodo, setLight] = useState(0);
  
    // 매 렌더마다 실행됨 (light만 바뀌어도 heavy 실행)
    const heavyWorkResult = heavyWork(heavyTodo);
    const lightWorkResult = lightWork(lightTodo);
  
    return (
        <section style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
            <h3> 1. 비최적 (직접 호출)</h3>
            <div style={{ marginBottom: 12 }}>
                <strong>무거운 작업</strong>{' '}
                <button onClick={() => setHeavy(v => v + 1)}>+1</button>
                <span> — {heavyWorkResult}</span>
            </div>

            <div>
                <strong>가벼운 작업</strong>{' '}
                <button onClick={() => setLight(v => v + 1)}>+1</button>
                <span> — {lightWorkResult}</span>
            </div>
      </section>
    );
}
  

// 최적 : useMemo로 heavy 계산을 의존성(heavyTodo) 변경시에만 재계산
function UseMemoVersion() {
    const [heavyTodo, setHeavy] = useState(0);
    const [lightTodo, setLight] = useState(0);
  
    // heavyTodo가 바뀔 때만 heavyWork 실행
    const heavyWorkResult = useMemo(() => heavyWork(heavyTodo), [heavyTodo]);
    // 참고로 light는 가벼우니 꼭 메모할 필요는 없지만, 비교를 위해 동일하게 처리
    const lightWorkResult = useMemo(() => lightWork(lightTodo), [lightTodo]);
  
    return (
        <section style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
            <h3> 2. 최적 (useMemo)</h3>
            <div style={{ marginBottom: 12 }}>
                <strong>무거운 작업</strong>{' '}
                <button onClick={() => setHeavy(v => v + 1)}>+1</button>
                <span> — {heavyWorkResult}</span>
            </div>

            <div>
                <strong>가벼운 작업</strong>{' '}
                <button onClick={() => setLight(v => v + 1)}>+1</button>
                <span> — {lightWorkResult}</span>
            </div>
        </section>
    );
}


/* ---------------- (2) useEffect 의존성 비교 ---------------- */

// 비최적 : 객체를 렌더마다 새로 만들어 의존성 참조가 매번 달라짐 → 글씨 크기만 바꿔도 effect 실행
function NaiveVersion2() {
    const [isDark, setIsDark] = useState(true);
    const [fontSize, setFontSize] = useState<number>(14);
  
    // 매 렌더마다 새로운 객체 생성 (참조가 바뀜)
    const darkMode = {
      mode: isDark ? 'DARK' : 'LIGHT',
    };
  
    useEffect(() => {
      console.log('다크/라이트 모드 변경 (비최적):', darkMode.mode);
    }, [darkMode]); // 객체 참조 비교: fontSize만 바꿔도 새 객체 -> effect 실행
  
    return (
      <section style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
        <h3>1. 비최적 (객체 의존성)</h3>
  
        <div style={{ marginBottom: 12 }}>
          <p>글씨 크기 조절</p>
          <button onClick={() => setFontSize(s => s + 2)}>+2</button>{' '}
          <button onClick={() => setFontSize(s => Math.max(10, s - 2))}>-2</button>
          <p style={{ fontSize }}>글자</p>
        </div>
  
        <div>
          <p>다크/라이트 모드</p>
          <button onClick={() => setIsDark(v => !v)}>다크모드 on/off</button>
          <div
            style={{
              marginTop: 8,
              width: 80,
              height: 40,
              borderRadius: 6,
              border: '1px solid #ccc',
              background: darkMode.mode === 'DARK' ? '#222' : '#fff',
            }}
          />
        </div>
      </section>
    );
}
  
// 최적 : 객체를 useMemo로 안정화
function UseMemoVersion2() {
    const [isDark, setIsDark] = useState(true);
    const [fontSize, setFontSize] = useState<number>(14);
  
    // 객체가 꼭 필요하면 useMemo로 참조 안정화
    const darkMode = useMemo(
      () => ({ mode: isDark ? 'DARK' : 'LIGHT' }),
      [isDark]
    );
  
    useEffect(() => {
      console.log('다크/라이트 모드 변경:', darkMode.mode);
    }, [darkMode]);
  
    return (
      <section style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
        <h3>2. 최적 (useMemo)</h3>
  
        <div style={{ marginBottom: 12 }}>
          <p>글씨 크기 조절</p>
          <button onClick={() => setFontSize(s => s + 2)}>+2</button>{' '}
          <button onClick={() => setFontSize(s => Math.max(10, s - 2))}>-2</button>
          <p style={{ fontSize }}>글자</p>
        </div>
  
        <div>
          <p>다크/라이트 모드</p>
          <button onClick={() => setIsDark(v => !v)}>다크모드 on/off</button>
          <div
            style={{
              marginTop: 8,
              width: 80,
              height: 40,
              borderRadius: 6,
              border: '1px solid #ccc',
              background: darkMode.mode === 'DARK' ? '#222' : '#fff',
            }}
          />
        </div>
      </section>
    );
}