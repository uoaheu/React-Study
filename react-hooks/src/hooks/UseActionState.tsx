import { useState, useActionState } from "react";

// 공통 유틸 
function lotto(): number[] {
  const nums = new Set<number>();
  while (nums.size < 6) {
    nums.add(Math.floor(Math.random() * 45) + 1);
  }
  return [...nums].sort((a, b) => a - b);
}

// 로딩 스피너 컴포넌트
function LoadingSpinner() {
  const dotStyle = { width: '8px', height: '8px', backgroundColor: 'blue', borderRadius: '50%', animation: 'bounce 1s infinite' };
  return (
    <>
      <style>{`@keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); }}`}</style>
      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
        <div style={dotStyle}></div>
        <div style={{...dotStyle, animationDelay: '0.1s'}}></div>
        <div style={{...dotStyle, animationDelay: '0.2s'}}></div>
      </div>
    </>
  );
}

// 공통 스타일
const containerStyle = { maxWidth: '400px', margin: '0 auto', padding: '24px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'};
const buttonBase = { padding: '12px 24px', borderRadius: '8px', fontWeight: '600', minWidth: '140px', border: 'none', color: 'white', fontSize: '16px' };
const numberStyle = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', background: 'orange', color: 'white', fontWeight: 'bold', borderRadius: '50%'};

// --- 기존 코드 ---
function LottoManual() {
  const [numbers, setNumbers] = useState<number[] | null>(null); // 결과
  const [error, setError] = useState<string | null>(null); // 에러
  const [isPending, setIsPending] = useState<boolean>(false); // 로딩

  async function handleClick() {
    setIsPending(true); // 로딩 시작
    setError(null); // 에러 초기화
    setNumbers(null); // 번호 초기화

    try {
      await new Promise((r) => setTimeout(r, 1000)); // 서버 호출이 있다고 가정하고 1초 지연
      if (Math.random() < 0.1) throw new Error("오류 발생 !! 다시 시도해주세요."); // 10번 중 1번 실패
      setNumbers(lotto()); // 성공 시 번호 저장
    } catch (e: any) {
      setError(e?.message ?? "알 수 없는 오류가 발생했습니다."); // 실패 시 에러 저장
    } finally {
      setIsPending(false); // 로딩 종료
    }
  }

  const buttonStyle = { ...buttonBase, cursor: isPending ? 'not-allowed' : 'pointer', backgroundColor: isPending ? 'grey' : 'skyblue' };
  
  return (
    <div style={containerStyle}>
      <h3 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px' }}>
        🎱 로또 번호 생성기 (useState)
      </h3>
      
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <button onClick={handleClick} disabled={isPending} style={buttonStyle}>
          {isPending ? "생성 중..." : "번호 생성"}
        </button>
      </div>

      {isPending && (
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <LoadingSpinner />
          <p style={{marginTop: '8px'}}>행운의 번호를 생성하고 있어요...</p>
        </div>
      )}

      {error && (
        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'mistyrose',borderRadius: '8px' }}>
          <p style={{ color: 'red', textAlign: 'center', fontWeight: '500', margin: 0 }}>⚠️ {error}</p>
        </div>
      )}

      {numbers && !isPending && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '16px' }}>🍀 행운의 번호</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {numbers.map((n) => <span key={n} style={numberStyle}>{n}</span>)}
          </div>
          <p>행운을 빌어요! 🎉</p>
        </div>
      )}
    </div>
  );
}

// --- useActionState 버전 ---
type LottoState = { numbers: number[] | null; error: string | null };

// 이전 상태(prev)와 폼 데이터(formData)를 인자로 받음
async function lottoAction(_formData: FormData): Promise<LottoState> {
    await new Promise((r) => setTimeout(r, 1000)); // 서버 호출이 있다고 가정하고 1초 지연
    if (Math.random() < 0.1) {
        return { numbers: null, error: "오류 발생 !! 다시 시도해주세요." };
    }
    return { numbers: lotto(), error: null };
}

function LottoWithActionState() {    
  const [state, formAction, isPending] = useActionState<LottoState, FormData>(
    lottoAction,
    { numbers: null, error: null } // 초기 상태
  );
    
  const { numbers, error } = state;
  
  const buttonStyle = { ...buttonBase, cursor: isPending ? 'not-allowed' : 'pointer', backgroundColor: isPending ? 'grey' : 'lightgreen' };
    
  return (
    <div style={containerStyle}>
      <h3 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px' }}>
        🎲 로또 번호 생성기 (useActionState)
      </h3>
        
      <form action={formAction}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <button
            type="submit"
            disabled={isPending}
            style={buttonStyle}
          >
            {isPending ? "생성 중..." : "번호 생성"}
          </button>
        </div>
      </form>

      {isPending && (
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <LoadingSpinner />
          <p style={{ marginTop: "8px" }}>행운의 번호를 생성하고 있어요...</p>
        </div>
      )}

      {error && (
        <div style={{ marginBottom: "24px", padding: "16px", backgroundColor: "mistyrose", borderRadius: "8px" }}>
          <p style={{ color: "red", textAlign: "center", fontWeight: "500", margin: 0 }}>⚠️ {error}</p>
        </div>
      )}

      {numbers && !isPending && (
        <div style={{ textAlign: "center" }}>
          <p style={{ marginBottom: "16px" }}>🍀 행운의 번호</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
            {numbers.map((n) => (
              <span key={n} style={{...numberStyle, background: 'purple'}}>
                {n}
              </span>
            ))}
          </div>
          <p>행운을 빌어요! 🎉</p>
        </div>
      )}
    </div>
  );
}

// ----- 페이지: 위/아래로 두 컴포넌트 렌더 -----
export default function UseActionStateHook() {
  return (
    <div style={{ maxWidth: 600, margin: '20px auto', padding: 20}}>
      <div style={{ marginBottom: 30 }}>
        <LottoManual />
      </div>
      <div style={{ marginBottom: 30 }}>
        <LottoWithActionState />
      </div>
        
      {/* 핵심 정리 */}
      <div style={{ padding: 15, backgroundColor: '#e7f3ff', borderLeft: '4px solid #007bff' }}>
        <h4>핵심 포인트</h4>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li><strong>useState</strong> : 결과/에러/로딩을 각각 상태로 수동 관리</li>
          <li><strong>useActionState</strong> : 액션의 반환값이 곧 state, 로딩은 isPending으로 자동 관리</li>
          <li><strong>호출 방식</strong> : useState는 onClick 핸들러, useActionState는 <code>{`<form action={formAction}>`}</code> 제출</li>
          <li><strong>코드 양/실수율</strong> : useActionState가 코드 길이 및 로딩 토글 누락 같은 실수 낮음</li>
          <li><strong>언제 쓸까?</strong> 폼/서버 액션은 useActionState, 단순 위젯/로컬 상태는 useState</li>
        </ul>
      </div>
    </div>
  );
}




