import React, { useState, useCallback, useEffect, useRef, memo } from "react";

// 랜덤 색상
const rand = () => `hsl(${Math.floor(Math.random() * 360)},70%,70%)`;

type ChildProps = {
  label: string;
  onClick: () => void;
};

const Child = memo(({ label, onClick }: ChildProps) => {
  const [bg, setBg] = useState(rand());
  const renderCountRef = useRef(0);
  const onClickRefChangeRef = useRef(0);
  renderCountRef.current += 1;

  // onClick "참조"가 바뀔 때만 색상 변경
  useEffect(() => {
    onClickRefChangeRef.current += 1;
    setBg(rand());
  }, [onClick]);

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 12,
        border: "1px solid #ddd",
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        display: "grid",
        gap: 10,
        minWidth: 280,
      }}
    >
      <div style={{ fontWeight: 700 }}>{label}</div>

      <div
        style={{
          height: 48,
          borderRadius: 8,
          background: bg,
          transition: "background-color 200ms ease",
          display: "grid",
          placeItems: "center",
          fontSize: 13,
        }}
        title="onClick 참조가 바뀔 때마다 색상이 랜덤으로 변경됩니다."
      >
        배경색(참조 변경 시 변경)
      </div>

      <div style={{ display: "flex", gap: 8, fontSize: 12 }}>
        <Badge>렌더: {renderCountRef.current}</Badge>
        <Badge tone="blue">onClick 참조 변경: {onClickRefChangeRef.current}</Badge>
      </div>

      <button
        onClick={onClick}
        style={{
          padding: "10px 14px",
          borderRadius: 8,
          border: "1px solid #ccc",
          background: "#fff",
          cursor: "pointer",
        }}
      >
        자식 버튼 클릭
      </button>
    </div>
  );
});

function Badge({
  children,
  tone = "gray",
}: {
  children: React.ReactNode;
  tone?: "gray" | "blue";
}) {
  const bg = tone === "blue" ? "rgba(33, 150, 243, .12)" : "rgba(0,0,0,.06)";
  const color = tone === "blue" ? "#1976d2" : "#333";
  return (
    <span
      style={{
        padding: "4px 8px",
        borderRadius: 999,
        background: bg,
        color,
        border: `1px solid ${
          tone === "blue" ? "rgba(33, 150, 243, .35)" : "rgba(0,0,0,.15)"
        }`,
      }}
    >
      {children}
    </span>
  );
}

export default function UseCallbackHook() {
  const [tick, setTick] = useState(0);
  const [c1, setC1] = useState(0);
  const [c2, setC2] = useState(0);
  const [c3, setC3] = useState(0);

  // 1) useCallback 없음 : 매 렌더마다 새 함수
  const handleLeft = () => setC1((v) => v + 1);

  // 2) useCallback([]) : 최초 한 번 만든 함수(참조 고정)
  const handleMiddle = useCallback(() => setC2((v) => v + 1), []);

  // 3) useCallback([c3]) : c3가 바뀔 때만 새 함수
  const handleRight = useCallback(() => setC3((v) => v + 1), [c3]);

  return (
    <div style={{ padding: 24}}>
      <h2 style={{ marginBottom: 8 }}>useCallback 비교: 없음 / [] / [state]</h2>
      <p>
        부모만 리렌더를 눌러보면 왼쪽은 매번 색이 바뀌고, 가운데는 절대 안 바뀌며,
        오른쪽은 c3가 변할 때만 바뀝니다. 각 카드의 배지로 자식 렌더 횟수와
        onClick 참조 변경 횟수를 확인할 수 있습니다.
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
        <button
          onClick={() => setTick((t) => t + 1)}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ccc"}}
        >
          부모만 리렌더 (클릭 수 : {tick})
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 20 }}>
        <Child label={`useCallback 없음 (c1 클릭 수 : ${c1})`} onClick={handleLeft} />
        <Child label={`useCallback([]) (c2 클릭 수 : ${c2})`} onClick={handleMiddle} />
        <Child label={`useCallback([c3]) (c3 클릭 수 : ${c3})`} onClick={handleRight} />
      </div>
    </div>
  );
}
