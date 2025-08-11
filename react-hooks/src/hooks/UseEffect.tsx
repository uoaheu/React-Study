import { useState, useEffect } from 'react'

export default function UseEffectHook() {
  const [count, setCount] = useState<number>(0);
  const [text, setText] = useState<string>("");
  const [cnt, setCnt] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(10);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  
  // 1. 마운트 시 한 번 실행 (빈 배열)
  useEffect(() => {
    console.log('컴포넌트 처음 마운트');
  }, []);

  // 2. 특정 값(count)이 마운트 될 때마다 실행
  useEffect(() => {
    console.log(`count값 변경: ${count}`);
  }, [count]);

  // 3. 입력값이 들어올 때마다 실행
  useEffect(() => {
    console.log(`입력값 변경 : ${text}`);
  }, [text]);

  // 4. 모든 마운트 시 실행
  useEffect(() => {
    console.log('모든 마운트 시 실행 !! ');
  });

  // 5. 최대 클릭 수 지정해서 실행
  useEffect(() => {
    console.log(`현재 클릭 횟수 : ${cnt}, 최대 5번까지 클릭 가능 !`);
    if(cnt > 5) {
        alert('최대 5번까지 클릭이 가능합니다 !');
        setCnt(5);
    }
  }, [cnt]);

  // 6. 카운트다운
  useEffect(() => {
    if(!isRunning) return; // 실행 상태가 아니면 종료

    const timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer); // 0 되면 멈춤
            return 0;
          }
          return prev - 1;
        });
    }, 1000);

    return() => {
        clearInterval(timer); // 언마운트/중지 시 정리
    };
  }, [isRunning]);
  // seconds가 변할 때마다 로그
  useEffect(() => {
    console.log(`남은 시간: ${seconds}초`);
  }, [seconds]);


  return (
    <div style={{ maxWidth: 600, margin: '20px auto', padding: 20 }}>
      {/* 기본 카운터 */}
      <div style={{ marginBottom: 30 }}>
        <h3>기본 카운터</h3>
        <h5>콘솔창 함께 확인해보기</h5>
        <p>카운트 : {count} 회</p>
        <button onClick={() => setCount(count + 1)}>
            증가
        </button>
      </div>

      {/* 텍스트 입력 */}
      <div style={{ marginBottom: 30 }}>
        <h3>텍스트 입력</h3>
        <h5>콘솔창 함께 확인해보기</h5>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="입력하면 콘솔에 로그찍힘" /> 
      </div>

      {/* 최대 클릭 수 지정 */}
      <div style={{ marginBottom: 30 }}>
        <h3>최대 클릭 수 = 5회</h3>
        <h5>콘솔창 함께 확인해보기</h5>
        <p>카운트 : {cnt} 회</p>
        <button onClick={() => setCnt(cnt + 1)}>
            증가
        </button>
        <button onClick={() => setCnt(0)}>
            리셋 버튼
        </button>
      </div>

      {/* 카운트다운 타이머 */}
      <div style={{ marginBottom: 30 }}>
        <h3>카운트다운 타이머</h3>
        <h5>콘솔창 함께 확인해보기</h5>
        <p style={{ fontSize: 50 }}>{seconds}초</p>
        <div>
            <button onClick={() => setIsRunning(true)} disabled={isRunning}>
                시작
            </button>
            <button onClick={() => setIsRunning(false)} disabled={!isRunning}>
                정지
            </button>
            <button onClick={() => { setSeconds(10); setIsRunning(false); }}>
                리셋
            </button>
        </div>
      </div>


      {/* 핵심 정리 */}
      <div style={{ padding: 15, backgroundColor: '#e7f3ff', borderLeft: '4px solid #007bff' }}>
        <h4>핵심 포인트</h4>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>의존성 배열로 실행 시점 제어 (<code>[]</code>: 마운트 1회, <code>[state]</code>: 해당 값 변경 시)</li>
            <li>반환값(cleanup)은 컴포넌트 언마운트 또는 의존성 변경 직전에 실행</li>
            <li>타이머, 이벤트 리스너, 구독 등은 cleanup에서 반드시 해제</li>
            <li>렌더마다 실행하려면 의존성 배열을 생략하지만, 성능 주의</li>
        </ul>
      </div>
    </div>
  )
}